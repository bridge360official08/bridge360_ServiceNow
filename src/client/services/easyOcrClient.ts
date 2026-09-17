/**
 * easyOcrClient.ts
 * Generic HTTP client for standalone EasyOCR microservice.
 *
 * Strictly decoupled from document schemas, country rules, and field definitions.
 * Performs generic OCR on image data and returns text, lines, words, and confidence.
 */

export interface EasyOcrLineItem {
  text: string;
  raw_text?: string;
  confidence: number;
  bounding_box: number[][];
}

export interface EasyOcrWordItem {
  text: string;
  confidence: number;
  bounding_box: number[][];
}

export interface EasyOcrResult {
  success: boolean;
  text: string;
  raw_text?: string;
  lines: EasyOcrLineItem[];
  words: EasyOcrWordItem[];
  processing_time_ms: number;
  source: 'EASYOCR';
  error?: string;
}

export interface EasyOcrRequestOptions {
  languages?: string[];
  preprocess?: boolean;
  mag_ratio?: number;
  timeoutMs?: number;
}

/**
 * Call standalone EasyOCR microservice with generic parameters.
 * Does NOT send or contain any document-specific extraction schemas.
 */
export async function callEasyOCRService(
  imageBase64: string,
  options?: EasyOcrRequestOptions
): Promise<EasyOcrResult> {
  const endpoint = ((import.meta as any).env?.VITE_EASYOCR_URL as string) || '/api/easyocr/ocr';
  const timeoutMs = options?.timeoutMs ?? 8000;
  const startTime = performance.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Clean base64 image data if data URI prefix is present
    const cleanBase64 = imageBase64.indexOf(',') !== -1
      ? imageBase64.split(',')[1]
      : imageBase64;

    const payload: Record<string, any> = {
      image: cleanBase64,
    };

    if (options?.languages && options.languages.length > 0) {
      payload.languages = options.languages;
    }
    if (typeof options?.preprocess === 'boolean') {
      payload.preprocess = options.preprocess;
    }
    if (typeof options?.mag_ratio === 'number') {
      payload.mag_ratio = options.mag_ratio;
    }

    console.info(`[EasyOCR] Initiating OCR request to ${endpoint} (timeout: ${timeoutMs}ms)`);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const elapsedMs = Math.round(performance.now() - startTime);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[EasyOCR] HTTP error ${res.status} in ${elapsedMs}ms: ${errText.slice(0, 150)}`);
      return {
        success: false,
        text: '',
        lines: [],
        words: [],
        processing_time_ms: elapsedMs,
        source: 'EASYOCR',
        error: `HTTP ${res.status}: ${errText.slice(0, 100)}`,
      };
    }

    const data = await res.json();
    console.info(
      `[EasyOCR] Success in ${elapsedMs}ms (chars: ${data.text ? data.text.length : 0}, lines: ${data.lines ? data.lines.length : 0})`
    );

    return {
      success: Boolean(data.success),
      text: data.text || '',
      raw_text: data.raw_text || data.text || '',
      lines: data.lines || [],
      words: data.words || [],
      processing_time_ms: data.processing_time_ms || elapsedMs,
      source: 'EASYOCR',
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const elapsedMs = Math.round(performance.now() - startTime);
    const isAbort = err?.name === 'AbortError';
    const errMsg = isAbort ? `Request timed out after ${timeoutMs}ms` : (err?.message || 'Network error');
    console.warn(`[EasyOCR] Fallback execution failed in ${elapsedMs}ms: ${errMsg}`);

    return {
      success: false,
      text: '',
      lines: [],
      words: [],
      processing_time_ms: elapsedMs,
      source: 'EASYOCR',
      error: errMsg,
    };
  }
}
