export interface ClaudeExtractionResult {
  success: boolean;
  extracted?: {
    documentType?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    passportNumber?: string;
    nationalId?: string;
    mobileNumber?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  error?: string;
  message?: string;
}

export class ClaudeService {
  /**
   * Send document OCR text to local proxy server for Claude-assisted extraction.
   */
  public async extractDocument(text: string, fileName?: string): Promise<ClaudeExtractionResult> {
    try {
      const response = await fetch('/api/claude/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ text, fileName })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Server Error',
          message: data.message || `API request failed with status ${response.status}`
        };
      }

      return data as ClaudeExtractionResult;
    } catch (e: any) {
      console.error('Claude service network error:', e);
      return {
        success: false,
        error: 'Network Error',
        message: e?.message || 'Could not connect to the proxy server. Ensure the proxy server is running.'
      };
    }
  }
}

export const claudeService = new ClaudeService();
