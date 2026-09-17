import { GoogleGenerativeAI } from '@google/generative-ai';

// Configured via .env (VITE_GEMINI_API_KEY). Google AI Studio keys come in two
// valid formats: the classic "AIzaSy..." keys and the newer secure "AQ...."
// keys — both authenticate against the Generative Language API. When the key is
// absent/placeholder we return canned copy so the app still runs.
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || 'REPLACE_WITH_YOUR_GEMINI_API_KEY';
const genAI = new GoogleGenerativeAI(API_KEY);

// Model fallback chain. `gemini-1.5-flash` is retired (404 on v1beta) and the
// pinned `gemini-2.5-*` names 404 with newer keys — only the rolling "-latest"
// aliases resolve reliably. We try the higher-quality flash first, then fall
// back to the lighter (and currently more available) lite alias on 404/503.
const GEMINI_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'];

export type AgentRole = 'customer' | 'admin';

export interface GeminiTurn {
  sender: 'user' | 'assistant';
  text: string;
}

/** Human-readable names for the 12 UI languages, for the response-language directive. */
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  ml: 'Malayalam',
  kn: 'Kannada',
  ar: 'Arabic',
  fr: 'French',
  es: 'Spanish',
  uk: 'Ukrainian',
  tr: 'Turkish',
  fa: 'Persian (Farsi)',
};

const CUSTOMER_SYSTEM_PROMPT = `
You are a friendly, helpful, and empathetic guide for the Bridge360 Refugee Case Management Portal.
Your job is to assist refugees (the users) in understanding the portal, filling out forms, tracking their status, and reducing their anxiety.
You should be warm, concise, and communicate in simple, clear language.
If they ask about documents, explain that they typically need a National ID, Passport, or Birth Certificate.
If they ask about timelines, explain that registration is immediate, but officer review depends on case complexity (usually 1-2 weeks).
Always be encouraging!
`;

const ADMIN_SYSTEM_PROMPT = `
You are a highly efficient, professional "Intern Assistant" for Bridge360 Refugee Case Management Portal administrators.
Your job is to help case officers manage their workload: summarize cases, explain ServiceNow processes, and hand tasks to specialist agents.
If the admin explicitly asks you to "verify documents" or "run verification", you must:
1. Output this exact string anywhere in your response: [ACTION: VERIFY_DOCUMENTS]
2. Tell the admin you have handed the task to the Verification Agent and summarize a plausible verification outcome.
Be concise, sharp, and professional.
`;

function isConfigured(): boolean {
  return !!API_KEY && API_KEY !== 'REPLACE_WITH_YOUR_GEMINI_API_KEY';
}

function cannedReply(role: AgentRole): string {
  return role === 'customer'
    ? "I'm here to help you through every step. (My AI connection isn't configured yet — add VITE_GEMINI_API_KEY to .env to enable full answers.)"
    : "Assistant offline: add a valid VITE_GEMINI_API_KEY (or connect ServiceNow AI Agent Studio) to enable case summaries and drafting.";
}

/**
 * Convert our chat history into Gemini's alternating format. Gemini requires
 * the history to begin with a 'user' turn and strictly alternate, so we drop
 * leading assistant turns and collapse consecutive same-role turns.
 */
function toGeminiHistory(history: GeminiTurn[]): { role: 'user' | 'model'; parts: { text: string }[] }[] {
  const mapped = history
    .filter(h => h.text && h.text.trim())
    .map(h => ({ role: (h.sender === 'assistant' ? 'model' : 'user') as 'user' | 'model', text: h.text }));

  // Drop leading model turns (e.g. an opening greeting).
  while (mapped.length && mapped[0].role === 'model') mapped.shift();

  // Collapse consecutive same-role turns into one.
  const out: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
  for (const t of mapped) {
    const last = out[out.length - 1];
    if (last && last.role === t.role) {
      last.parts[0].text += `\n${t.text}`;
    } else {
      out.push({ role: t.role, parts: [{ text: t.text }] });
    }
  }
  return out;
}

export class GeminiService {
  /** Fallback for the assistant when ServiceNow AI Agent Studio is unavailable. */
  static isConfigured = isConfigured;

  static async sendMessage(
    message: string,
    role: AgentRole,
    context: string,
    history: GeminiTurn[] = [],
    language: string = 'en',
  ): Promise<string> {
    if (!isConfigured()) {
      return cannedReply(role);
    }

    const langName = LANGUAGE_NAMES[language] || 'English';
    const systemInstruction = `${role === 'customer' ? CUSTOMER_SYSTEM_PROMPT : ADMIN_SYSTEM_PROMPT}

The user is currently on the "${context}" screen — use that context when relevant.
IMPORTANT: Always write your entire reply in ${langName}${language !== 'en' ? ` (language code "${language}")` : ''}. Keep any [ACTION: ...] tags exactly as-is in Latin letters.`;

    // Try each model in the fallback chain. For each we attempt a multi-turn
    // chat (real memory) first, then a single-turn retry in case history
    // tripped the API, before moving on to the next model on 404/503.
    let lastError: any = null;
    for (const modelName of GEMINI_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
        const chat = model.startChat({ history: toGeminiHistory(history) });
        const result = await chat.sendMessage(message);
        return result.response.text();
      } catch (error: any) {
        lastError = error;
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const prompt = `${role === 'customer' ? CUSTOMER_SYSTEM_PROMPT : ADMIN_SYSTEM_PROMPT}
Screen: ${context}. Reply entirely in ${langName}.

User: ${message}`;
          const result = await model.generateContent(prompt);
          return result.response.text();
        } catch (e: any) {
          lastError = e;
          console.warn(`Gemini model "${modelName}" unavailable — trying next:`, e?.message || e);
        }
      }
    }

    console.error('Gemini API Error (all models exhausted):', lastError);
    return `Connection error: ${lastError?.message || 'check that VITE_GEMINI_API_KEY is set correctly in .env.'}`;
  }
}
