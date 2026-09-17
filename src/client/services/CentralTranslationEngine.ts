// Central Translation Engine for Bridge360
// Pure API-driven translation engine: NO popups, NO iframes, NO Google banner bars, NO automatic reversions.

import { SupportedLanguage, SUPPORTED_LANGUAGES, translations, loadTranslationBundle } from '../utils/i18n';

// Map specific language codes to API codes if needed
const API_CODE_MAP: Record<string, string> = {
  'pt-BR': 'pt',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'he': 'iw',
};

class CentralTranslationEngineService {
  private currentLanguage: SupportedLanguage = 'en';
  private listeners: Array<(lang: SupportedLanguage) => void> = [];
  private cache: Map<string, string> = new Map();
  private isDOMTranslating: boolean = false;
  private observer: MutationObserver | null = null;
  private pendingNodes: Set<Text> = new Set();
  private batchTimer: any = null;
  private originalTextMap: WeakMap<Text, string> = new WeakMap();

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public init() {
    // Load local storage cache if available
    try {
      const savedCache = localStorage.getItem('b360_translation_cache');
      if (savedCache) {
        const parsed = JSON.parse(savedCache);
        Object.entries(parsed).forEach(([k, v]) => this.cache.set(k, v as string));
      }
    } catch {}

    // 1. Detect initial language
    const snLang = (window as any).g_user_language;
    const savedLang = localStorage.getItem('bridge360_lang') as SupportedLanguage;

    let initialLang: SupportedLanguage = 'en';
    if (snLang && SUPPORTED_LANGUAGES.some(l => l.code === snLang)) {
      initialLang = snLang as SupportedLanguage;
    } else if (savedLang && SUPPORTED_LANGUAGES.some(l => l.code === savedLang)) {
      initialLang = savedLang;
    }

    this.currentLanguage = initialLang;
    this.applyDocumentMeta(initialLang);

    // 2. Setup DOM observer for dynamic content
    this.setupDOMObserver();

    // 3. If non-English on boot, trigger translation
    if (initialLang !== 'en') {
      setTimeout(() => this.translateFullDOM(initialLang), 200);
    }
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public getLanguageOption(code?: string) {
    const c = code || this.currentLanguage;
    return SUPPORTED_LANGUAGES.find(l => l.code === c) || SUPPORTED_LANGUAGES[0];
  }

  public getAllLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  public subscribe(listener: (lang: SupportedLanguage) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Primary entry point to switch language across the entire application.
   */
  public async setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
    localStorage.setItem('bridge360_lang', lang);

    // 1. Apply document direction and language attribute
    this.applyDocumentMeta(lang);

    // 2. Notify React components for instant re-render
    this.notifySubscribers(lang);

    // 3. Preload dictionary bundle if exists
    loadTranslationBundle(lang).catch(() => {});

    // 4. Synchronize ServiceNow session
    this.syncServiceNowSession(lang);

    // 5. Trigger API-driven DOM translation (zero popups)
    this.translateFullDOM(lang);
  }

  private applyDocumentMeta(lang: SupportedLanguage) {
    if (typeof document === 'undefined') return;
    // Always preserve 'ltr' layout so navigation, headers, forms, and steppers don't flip or break the UI layout
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lang;
  }

  private notifySubscribers(lang: SupportedLanguage) {
    for (const listener of this.listeners) {
      try {
        listener(lang);
      } catch (e) {
        console.error('Translation listener error:', e);
      }
    }
  }

  private syncServiceNowSession(lang: SupportedLanguage) {
    if (typeof window === 'undefined') return;
    fetch('/api/now/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: lang })
    }).catch(() => {});
  }

  /**
   * Direct API Translation call using Google Translate API (JSON, no UI/iframe)
   */
  public async translateText(text: string, targetLang: string): Promise<string> {
    const trimmed = text.trim();
    if (
      !trimmed ||
      targetLang === 'en' ||
      trimmed.toLowerCase() === 'bridge360' ||
      trimmed.toLowerCase() === 'bridge 360' ||
      /^[0-9\s.,:\-_/\\#@!$%^&*()=+]+$/.test(trimmed)
    ) {
      return text;
    }

    const apiLang = API_CODE_MAP[targetLang] || targetLang;
    const cacheKey = `${apiLang}:${trimmed}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(apiLang)}&dt=t&q=${encodeURIComponent(trimmed)}`;
      const res = await fetch(url);
      if (!res.ok) return text;
      
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => item[0]).join('');
        if (translated) {
          this.cache.set(cacheKey, translated);
          this.saveCacheToStorage();
          return translated;
        }
      }
    } catch (e) {
      // Fallback on error
    }
    return text;
  }

  private saveCacheToStorage() {
    try {
      const obj: Record<string, string> = {};
      let count = 0;
      for (const [k, v] of this.cache.entries()) {
        obj[k] = v;
        if (++count > 500) break; // Limit cache size
      }
      localStorage.setItem('b360_translation_cache', JSON.stringify(obj));
    } catch {}
  }

  /**
   * Translates all text nodes in the DOM without using any Google iframes or popups.
   */
  public async translateFullDOM(targetLang: string) {
    if (typeof document === 'undefined') return;
    if (this.isDOMTranslating) return;
    this.isDOMTranslating = true;

    try {
      const root = document.getElementById('root') || document.body;
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toLowerCase();
            if (tag === 'script' || tag === 'style' || tag === 'svg' || tag === 'textarea' || tag === 'code' || tag === 'input') {
              return NodeFilter.FILTER_REJECT;
            }
            if (
              parent.closest('select') ||
              parent.closest('.notranslate') ||
              parent.closest('.bridge360-logo-wrapper') ||
              parent.closest('.stepper-container')
            ) {
              return NodeFilter.FILTER_REJECT;
            }
            const val = (node.nodeValue || '').trim();
            if (!val || val.toLowerCase() === 'bridge360' || /^[0-9\s.,:\-_/\\#@!$%^&*()=+]+$/.test(val)) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      const nodesToTranslate: Array<{ node: Text; original: string }> = [];
      let currentNode: Node | null = walker.nextNode();

      while (currentNode) {
        const textNode = currentNode as Text;
        // Save original text once per Text node using WeakMap
        if (!this.originalTextMap.has(textNode)) {
          this.originalTextMap.set(textNode, textNode.nodeValue || '');
        }
        const original = this.originalTextMap.get(textNode) || textNode.nodeValue || '';
        if (original.trim() && !original.toLowerCase().includes('bridge360')) {
          nodesToTranslate.push({ node: textNode, original });
        }
        currentNode = walker.nextNode();
      }

      // If returning to English, restore all original text immediately
      if (targetLang === 'en') {
        for (const item of nodesToTranslate) {
          const orig = this.originalTextMap.get(item.node);
          if (orig !== undefined && item.node.nodeValue !== orig) {
            item.node.nodeValue = orig;
          }
        }
        this.isDOMTranslating = false;
        return;
      }

      // Process translations in batches via API
      const batchSize = 10;
      for (let i = 0; i < nodesToTranslate.length; i += batchSize) {
        const chunk = nodesToTranslate.slice(i, i + batchSize);
        await Promise.all(
          chunk.map(async ({ node, original }) => {
            const translated = await this.translateText(original, targetLang);
            if (translated && this.currentLanguage === targetLang) {
              node.nodeValue = translated;
            }
          })
        );
      }
    } finally {
      this.isDOMTranslating = false;
    }
  }

  private setupDOMObserver() {
    if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return;

    this.observer = new MutationObserver((mutations) => {
      if (this.currentLanguage === 'en' || this.isDOMTranslating) return;

      let shouldTranslate = false;
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          shouldTranslate = true;
          break;
        }
      }

      if (shouldTranslate) {
        clearTimeout(this.batchTimer);
        this.batchTimer = setTimeout(() => {
          this.translateFullDOM(this.currentLanguage);
        }, 250);
      }
    });

    const root = document.getElementById('root');
    if (root) {
      this.observer.observe(root, { childList: true, subtree: true });
    }
  }

  /**
   * Fast synchronous lookup with background API enrichment.
   */
  public t(key: string, defaultText?: string): string {
    const langDict = (translations as any)[this.currentLanguage];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    
    // Check in-memory API translation cache for this phrase
    const apiLang = API_CODE_MAP[this.currentLanguage] || this.currentLanguage;
    const fallback = defaultText || key;
    const cacheKey = `${apiLang}:${fallback.trim()}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Queue asynchronous background translation
    if (this.currentLanguage !== 'en' && fallback) {
      this.translateText(fallback, this.currentLanguage).then((trans) => {
        if (trans && trans !== fallback) {
          this.notifySubscribers(this.currentLanguage);
        }
      });
    }

    return fallback;
  }
}

export const CentralTranslationEngine = new CentralTranslationEngineService();
