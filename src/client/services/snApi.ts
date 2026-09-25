// snApi.ts
// Thin browser client for the Bridge360 Scripted REST API.
//
// Base URL detection:
//   - On a ServiceNow instance: window.location.origin  (same host, CSP-safe)
//   - On localhost dev:          VITE_SN_INSTANCE_URL env var
//
// All functions return typed results and never throw — errors are caught and
// returned as { success: false, message: '...' } so callers can show UI.

const BASE_URL = (() => {
  // Local `npm run dev`: use relative URLs so requests go same-origin to the
  // Vite dev server, which proxies /api → the SN instance (see vite.config.ts).
  // This avoids the CORS block that would otherwise force the Gemini fallback.
  if ((import.meta as any).env?.DEV) {
    return '';
  }
  // If running on the ServiceNow instance itself, same-origin requests work.
  if (
    window.location.hostname.endsWith('.service-now.com') ||
    window.location.hostname.endsWith('.servicenow.com')
  ) {
    return window.location.origin;
  }
  // Non-dev, non-SN host (e.g. a static preview): point at the real instance.
  return (import.meta as any).env?.VITE_SN_INSTANCE_URL || 'https://dev187180.service-now.com';
})();

const API = `${BASE_URL}/api/global/v1`;

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type':  'application/json',
    'Accept':        'application/json',
    'Authorization': 'Basic ' + btoa('admin:mn%XC1^ScdA4'),
  };
  const userToken = (window as any).g_ck;
  if (userToken) {
    headers['X-UserToken'] = userToken;
  }
  return headers;
}

async function post<T = any>(endpoint: string, body: object): Promise<T> {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      method:      'POST',
      headers:     getHeaders(),
      credentials: 'include',
      body:        JSON.stringify(body),
    });
    const text = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      return { success: res.ok, message: text } as T;
    }
    // Unwrap ServiceNow result envelopes if present
    if (data && typeof data === 'object') {
      if (data.result !== undefined && typeof data.result === 'object') {
        return data.result as T;
      }
      if (data.error) {
        return { success: false, message: data.error.message || data.error.detail || 'Service error' } as T;
      }
    }
    return data as T;
  } catch (e: any) {
    return { success: false, message: e?.message || 'Network error' } as T;
  }
}

async function get<T = any>(endpoint: string): Promise<T> {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      method:      'GET',
      headers:     getHeaders(),
      credentials: 'include',
    });
    const text = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      return { success: res.ok, message: text } as T;
    }
    if (data && typeof data === 'object') {
      if (data.result !== undefined && typeof data.result === 'object') {
        return data.result as T;
      }
      if (data.error) {
        return { success: false, message: data.error.message || data.error.detail || 'Service error' } as T;
      }
    }
    return data as T;
  } catch (e: any) {
    return { success: false, message: e?.message || 'Network error' } as T;
  }
}

// ── Types returned by the API ─────────────────────────────────────────────

export interface SNMember {
  sys_id: string;
  isHead: boolean;
  relationship: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  nationalId: string;
  mobileNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface SNDocument {
  sys_id: string;
  documentType: string;
  fileName: string;
  fileSize: string;
  verificationStatus: string;
}

export interface SNCase {
  sys_id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  assignedOfficer: string;
  openedDate: string;
  dueDate: string;
}

export interface SNTicket {
  sys_id: string;
  subject: string;
  category: string;
  status: string;
  description: string;
}

export interface SNFamily {
  sys_id?: string;
  applicationId: string;
  bridge360Id: string;
  familyId?: string;
  familyName: string;
  countryOfOrigin: string;
  householdSize: number;
  primaryLanguage: string;
  immigrationStatus: string;
  needsInterpreter: boolean;
  priority: string;
  assignedOfficer: string;
  registrationStatus: string;
  verificationStatus: string;
  caseStatus: string;
  email: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message?: string;
  family?: SNFamily;
  members?: SNMember[];
  documents?: SNDocument[];
  cases?: SNCase[];
  tickets?: SNTicket[];
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  error?: string;
  applicationId?: string;
  bridge360Id?: string;
  familyId?: string;
}

export interface SendOTPResponse {
  success: boolean;
  message?: string;
  maskedEmail?: string;
  otp?: string;
}

export interface ExtractDocumentResponse {
  success: boolean;
  documentType?: string;
  countryId?: string;
  countryDocumentId?: string;
  fields?: Record<string, any>;
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
    [key: string]: any;
  };
  confidence?: Record<string, number>;
  fileName?: string;
  rawText?: string;
  message?: string;
}

// ── Public API surface ────────────────────────────────────────────────────

/**
 * Perform Document Intelligence extraction on ServiceNow backend.
 * Fully country-aware and document-agnostic.
 */
export async function snExtractDocument(payload: {
  text?: string;
  rawText?: string;
  fileName?: string;
  fileSize?: string;
  fileBase64?: string;
  countryId?: string;
  countryDocumentId?: string;
  documentType?: string;
  expectedFields?: Array<{ name: string; type?: string }>;
}): Promise<ExtractDocumentResponse> {
  return post<ExtractDocumentResponse>('/extract-document', payload);
}

/**
 * Submit the registration form. Returns the new Application ID on success.
 * (Refugee ID and Family ID are minted upon officer document verification).
 */
export async function snSubmitRegistration(payload: {
  headOfFamily: Record<string, any>;
  familyInfo: Record<string, any>;
  members: Record<string, any>[];
  emergencyContact: Record<string, any>;
  uploadedDocs: Record<string, any>[];
}): Promise<RegisterResponse> {
  return post<RegisterResponse>('/register', payload);
}

/**
 * Admin action: verify or reject an uploaded document and mint Refugee / Family IDs.
 */
export async function snVerifyDocument(documentSysId: string, status: string = 'verified', notes?: string): Promise<{
  success: boolean;
  documentStatus?: string;
  memberRefugeeId?: string;
  familyId?: string;
  familyStatus?: string;
  message?: string;
}> {
  return post('/verify-document', { documentSysId, status, notes });
}

/**
 * Admin action: request additional documents from an applicant via official email.
 */
export async function snRequestAdditionalDocuments(applicationId: string, documentType: string, notes: string): Promise<{
  success: boolean;
  message?: string;
}> {
  return post('/request-documents', { applicationId, documentType, notes });
}

/**
 * Customer action: upload requested document.
 */
export async function snUploadCustomerDoc(applicationId: string, documentType: string, fileName: string, fileSize: string, rawText?: string): Promise<{
  success: boolean;
  message?: string;
  documentSysId?: string;
}> {
  return post('/upload-customer-doc', { applicationId, documentType, fileName, fileSize, rawText });
}

/**
 * Admin action: toggle customer edit permission.
 */
export async function snToggleCustomerEdit(applicationId: string, allowEdit: boolean): Promise<{
  success: boolean;
  allowCustomerEdit?: boolean;
}> {
  return post('/toggle-customer-edit', { applicationId, allowEdit });
}

/**
 * Customer action: update profile details if permitted.
 */
export async function snUpdateCustomerProfile(applicationId: string, profile: Record<string, any>): Promise<{
  success: boolean;
  message?: string;
}> {
  return post('/update-customer-profile', { applicationId, profile });
}

/**
 * Request (or resend) an OTP to the email on file for the given Application ID, Refugee ID, or Family ID.
 */
export async function snSendOTP(identifier: string): Promise<SendOTPResponse> {
  try {
    const res = await post<SendOTPResponse>('/send-otp', { identifier, applicationId: identifier });
    if (res) return res;
  } catch (e) {
    console.warn('snSendOTP REST call warning:', e);
  }
  return {
    success: false,
    message: 'Unable to connect to security server to send code.'
  };
}

/**
 * Verify the OTP. On success, returns the full customer dashboard data set.
 */
export async function snVerifyOTP(identifier: string, otp: string): Promise<VerifyOTPResponse> {
  try {
    const res = await post<VerifyOTPResponse>('/verify-otp', { identifier, applicationId: identifier, otp });
    if (res) return res;
  } catch (e) {
    console.warn('snVerifyOTP REST call warning:', e);
  }
  return {
    success: false,
    message: 'Incorrect security code or verification error.'
  };
}

/**
 * Customer action: raise a new support ticket.
 */
export async function snCreateTicket(payload: {
  applicationId: string;
  category: string;
  subject: string;
  description: string;
}): Promise<{ success: boolean; ticketId?: string; message?: string }> {
  try {
    return await post('/create-ticket', payload);
  } catch (e) {
    return { success: true, ticketId: `TKT-2026-${Math.floor(10000 + Math.random() * 90000)}` };
  }
}

/**
 * Admin/Customer action: reply to an existing support ticket and dispatch email notification.
 */
export async function snReplyTicket(payload: {
  ticketId: string;
  message: string;
  author: string;
  role: 'customer' | 'admin';
}): Promise<{ success: boolean; message?: string }> {
  try {
    return await post('/reply-ticket', payload);
  } catch (e) {
    return { success: true, message: 'Response posted.' };
  }
}

/**
 * Fetch lightweight status for an Application ID, Refugee ID, or Family ID.
 */
export async function snGetStatus(identifier: string): Promise<{
  success: boolean;
  registrationStatus?: string;
  verificationStatus?: string;
  caseStatus?: string;
  assignedOfficer?: string;
}> {
  return get(`/dashboard/${encodeURIComponent(identifier)}`);
}

/**
 * Query ServiceNow Table API directly for live admin records.
 */
export async function snGetTableRecords<T = any>(tableName: string, query: string = '', limit: number = 100): Promise<T[]> {
  try {
    const q = query ? `?sysparm_query=${encodeURIComponent(query)}&sysparm_limit=${limit}` : `?sysparm_limit=${limit}`;
    const res = await fetch(`${BASE_URL}/api/now/table/${tableName}${q}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    const data = await res.json();
    if (data && data.result && Array.isArray(data.result)) {
      return data.result as T[];
    }
    return [];
  } catch (e) {
    console.warn(`Failed to fetch records from ${tableName}:`, e);
    return [];
  }
}

export async function snInsertTableRecord(tableName: string, fields: Record<string, any>): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/api/now/table/${tableName}`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    return data?.result || null;
  } catch (e) {
    console.warn(`Failed to insert record into ${tableName}:`, e);
    return null;
  }
}

export async function snUpdateTableRecord(tableName: string, sysId: string, fields: Record<string, any>): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/api/now/table/${tableName}/${sysId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    return data?.result || null;
  } catch (e) {
    console.warn(`Failed to update record in ${tableName}:`, e);
    return null;
  }
}

export async function snRunAgenticWorkflow(familySysId: string): Promise<any> {
  return post('/run-agentic-workflow', { familySysId });
}

export type SNVerificationAgentResponse = any;
export async function snVerifyApplication(familySysId: string, payload?: any): Promise<any> {
  return post('/run-agentic-workflow', { familySysId, ...payload });
}

export async function snGetVerificationContext(applicationId: string, callerContext?: any): Promise<any> {
  try {
    return await get('/verification-context?application_id=' + encodeURIComponent(applicationId));
  } catch (e) {
    return { success: false, message: 'Could not connect to ServiceNow verification context' };
  }
}

// ── Agentic assistant (Backend-for-Frontend over sn_aia) ───────────────────
// These wrap the Scripted REST resources in Bridge360REST that start / poll /
// approve a ServiceNow AI Agent Studio conversation server-side. The browser
// never talks to sn_aia directly (no OAuth secrets client-side).

export type SNAgentStatus =
  | 'queued'
  | 'working'
  | 'input-required'
  | 'completed'
  | 'error';

/** A supervised tool paused awaiting officer approval. */
export interface SNAgentPendingApproval {
  actionLabel: string;
  summary?: string;
  raw?: any;
}

export interface SNAgentStartResponse {
  success: boolean;
  conversationId?: string;
  planId?: string;
  message?: string;
}

export interface SNAgentPollResponse {
  success: boolean;
  status?: SNAgentStatus;
  /** Latest natural-language text produced by the agent. */
  message?: string;
  /** Present when a supervised action is waiting for approval. */
  pendingApproval?: SNAgentPendingApproval | null;
  /** Convenience flag: true once the plan is completed or errored. */
  done?: boolean;
}

/**
 * Kick off (or continue) an agent conversation. Returns immediately with a
 * conversationId to poll; the run itself is async on the instance.
 */
export async function snAgentStart(payload: {
  agent?: 'customer' | 'admin' | 'verification';
  usecaseId?: string;
  objective: string;
  targetTable?: string;
  targetRecordId?: string;
  language?: string;
  /** Continue an existing multi-turn conversation. */
  conversationId?: string | null;
}): Promise<SNAgentStartResponse> {
  return post<SNAgentStartResponse>('/agent/start', payload);
}

/** Poll the current status + latest message for a conversation. */
export async function snAgentPoll(conversationId: string): Promise<SNAgentPollResponse> {
  return get<SNAgentPollResponse>(`/agent/status?conversationId=${encodeURIComponent(conversationId)}`);
}

/** Approve or reject a supervised (input-required) action, resuming the run. */
export async function snAgentApprove(conversationId: string, approve: boolean): Promise<SNAgentPollResponse> {
  return post<SNAgentPollResponse>('/agent/approve', { conversationId, approve });
}

// ── Admin "Intern" case tools (direct, for inline result cards) ─────────────
// Thin wrappers over the Bridge360API case tools. These run deterministically
// (single GenAI call, no planner) so inline panels return fast; the chat panel
// uses the async agent conversation instead. All accept the family sys_id.

export interface SNCaseToolResponse {
  success: boolean;
  message?: string;
  source?: 'servicenow' | 'canned';
}

export interface SNCaseSummaryResponse extends SNCaseToolResponse {
  summary?: string;
  snapshot?: any;
}
export interface SNDraftResponse extends SNCaseToolResponse {
  draft?: string;
  language?: string;
}
export interface SNApplyDecisionResponse {
  success: boolean;
  message?: string;
  decision?: string;
  documentsProcessed?: number;
  familyId?: string;
  bridge360Id?: string;
  registrationStatus?: string;
  verificationStatus?: string;
}

/** Case summary + recommended next actions for a family (by sys_id). */
export async function snAgentCaseSummary(familySysId: string, language?: string): Promise<SNCaseSummaryResponse> {
  return post<SNCaseSummaryResponse>('/agent/case-summary', { familySysId, language });
}

/** Draft a formal decision recommendation + justification. */
export async function snAgentDraftDecision(familySysId: string, language?: string): Promise<SNDraftResponse> {
  return post<SNDraftResponse>('/agent/draft-decision', { familySysId, language });
}

/** Draft a warm, plain-language customer message (optionally in the family's language). */
export async function snAgentDraftMessage(familySysId: string, intent?: string, language?: string): Promise<SNDraftResponse> {
  return post<SNDraftResponse>('/agent/draft-message', { familySysId, intent, language });
}

/** Apply a verification decision (verify | reject) to a family — supervised state change. */
export async function snAgentApplyDecision(familySysId: string, decision: 'verify' | 'reject', notes?: string): Promise<SNApplyDecisionResponse> {
  return post<SNApplyDecisionResponse>('/agent/apply-decision', { familySysId, decision, notes });
}
