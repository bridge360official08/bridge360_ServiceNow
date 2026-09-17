// AssistantService.ts
// Single entry point the UI uses to talk to the assistant. Honors the locked
// decision: ServiceNow AI Agent Studio is PRIMARY, Gemini is the fallback, and
// canned copy is the last resort so the app always responds.
//
//   send()        conversational turn (SN agent → Gemini → canned)
//   approve()     resolve a supervised (input-required) action
//   proactiveTip() short screen-aware nudge for the floating mascot (fast path)
//
// The browser never talks to sn_aia directly — it goes through our BFF Scripted
// REST (snAgentStart/Poll/Approve). All calls degrade gracefully and never throw.

import {
  snAgentStart,
  snAgentPoll,
  snAgentApprove,
  type SNAgentPollResponse,
} from './snApi';
import { GeminiService, type GeminiTurn } from './GeminiService';
import type { PendingApproval, ChatMessage } from '../store/AssistantContext';

export type AssistantRole = 'customer' | 'admin';
export type AssistantSource = 'servicenow' | 'gemini' | 'canned';

export interface AssistantReply {
  text: string;
  /** Parsed [ACTION: X] directive, if the agent emitted one. */
  action?: string | null;
  /** Set when a supervised action is awaiting officer approval. */
  pendingApproval?: PendingApproval | null;
  /** Conversation id to carry into the next turn (SN multi-turn memory). */
  conversationId?: string | null;
  source: AssistantSource;
  isError?: boolean;
}

export interface AssistantSendOptions {
  role: AssistantRole;
  screenContext: string;
  language: string;
  /** Prior turns, for memory (both SN continuation and Gemini replay). */
  history?: ChatMessage[];
  /** Continue an existing SN conversation. */
  conversationId?: string | null;
  /** Optional record the agent should reason over (e.g. a family). */
  targetTable?: string;
  targetRecordId?: string;
  /** Which SN agent to route to; defaults from role. */
  agent?: 'customer' | 'admin' | 'verification';
}

const ACTION_RE_ALL = /\[ACTION:\s*[^\]]+\]/gi;
const ACTION_RE_ONE = /\[ACTION:\s*([^\]]+)\]/i;

function parseAction(text: string): { clean: string; action: string | null } {
  const m = text.match(ACTION_RE_ONE);
  const action = m ? m[1].trim() : null;
  const clean = text.replace(ACTION_RE_ALL, '').trim();
  return { clean, action };
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

function cannedFor(role: AssistantRole): string {
  return role === 'customer'
    ? "I'm having trouble reaching my assistant service right now, but I'm still here. Please try again in a moment."
    : 'Assistant service is temporarily unreachable. Please retry shortly.';
}

// Friendly, screen-aware proactive lines used when no live model is reachable.
// Keyed on substrings of the screenContext so it stays robust to naming.
function cannedTip(role: AssistantRole, screenContext: string): string {
  const s = (screenContext || '').toLowerCase();
  if (role === 'customer') {
    if (s.includes('regist')) return "Take your time filling this in — I'll flag anything that looks off before you submit. Your progress is saved as you go.";
    if (s.includes('track') || s.includes('status')) return "You can check your case status here anytime. I'll explain what each stage means — just ask!";
    if (s.includes('document') || s.includes('upload')) return 'A clear photo of your ID, passport, or birth certificate works best. I can tell you which documents help most.';
    if (s.includes('dashboard') || s.includes('home')) return "Welcome! I'm right here if any step feels confusing — nothing you do here is final until you're ready.";
    return "I'm here to guide you through this — ask me anything, in your own language.";
  }
  // admin
  if (s.includes('family') || s.includes('case')) return 'Want a quick case summary or next-best-actions? I can draft one and hand verification to the specialist agent on your go.';
  if (s.includes('verif')) return 'I can run document verification and prepare a decision — you approve before anything changes state.';
  if (s.includes('dashboard')) return 'Caseload loaded. Ask me to triage, summarize, or draft customer messages whenever you like.';
  return "Ready to help — summaries, verification handoff, and drafts are one request away.";
}


// Only turns that are safe to replay as memory (skip errors + approval prompts).
function toTurns(history?: ChatMessage[]): GeminiTurn[] {
  return (history || [])
    .filter(m => !m.isError && !m.pendingApproval && m.text?.trim())
    .map(m => ({ sender: m.sender, text: m.text }));
}

// ── SN circuit breaker ─────────────────────────────────────────────────────
// If the BFF isn't deployed / reachable, stop hammering it for a couple of
// minutes so chat stays snappy on the Gemini path.
let snFailures = 0;
let snDisabledUntil = 0;
const SN_DISABLE_MS = 120_000;

function snUsable(): boolean {
  return Date.now() >= snDisabledUntil;
}
function noteSnFailure(): void {
  snFailures += 1;
  if (snFailures >= 2) snDisabledUntil = Date.now() + SN_DISABLE_MS;
}
function noteSnSuccess(): void {
  snFailures = 0;
  snDisabledUntil = 0;
}

/** Poll until the plan settles (completed / input-required / error) or we time out. */
async function pollUntilSettled(conversationId: string): Promise<SNAgentPollResponse | null> {
  const delays = [600, 900, 1200, 1500, 1800, 2000, 2000, 2500, 2500, 3000]; // ~18s
  let last: SNAgentPollResponse | null = null;
  for (const d of delays) {
    await sleep(d);
    const res = await snAgentPoll(conversationId);
    if (!res || res.success === false) return last; // transient; return partial if any
    last = res;
    if (res.done || res.status === 'completed' || res.status === 'input-required' || res.status === 'error') {
      return res;
    }
  }
  return last; // timed out — caller decides whether to use partial or fall back
}

function toReply(conversationId: string, poll: SNAgentPollResponse): AssistantReply {
  const raw = poll.message || '';
  const { clean, action } = parseAction(raw);
  let pending: PendingApproval | null = null;
  if (poll.status === 'input-required' && poll.pendingApproval) {
    pending = {
      conversationId,
      actionLabel: poll.pendingApproval.actionLabel,
      summary: poll.pendingApproval.summary,
      raw: poll.pendingApproval.raw,
    };
  }
  return {
    text: clean || raw,
    action,
    pendingApproval: pending,
    conversationId,
    source: 'servicenow',
  };
}

async function trySN(message: string, opts: AssistantSendOptions): Promise<AssistantReply | null> {
  if (!snUsable()) return null;

  const start = await snAgentStart({
    agent: opts.agent ?? (opts.role === 'admin' ? 'admin' : 'customer'),
    objective: message,
    targetTable: opts.targetTable,
    targetRecordId: opts.targetRecordId,
    language: opts.language,
    conversationId: opts.conversationId ?? undefined,
  });

  if (!start || !start.success || !start.conversationId) {
    noteSnFailure();
    return null;
  }
  noteSnSuccess();

  const poll = await pollUntilSettled(start.conversationId);
  // No message at all, or a hard error → let the caller fall back to Gemini.
  if (!poll || poll.status === 'error' || (!poll.message && poll.status !== 'input-required')) {
    return null;
  }
  return toReply(start.conversationId, poll);
}

async function tryGemini(message: string, opts: AssistantSendOptions): Promise<AssistantReply> {
  const raw = await GeminiService.sendMessage(
    message,
    opts.role,
    opts.screenContext,
    toTurns(opts.history),
    opts.language,
  );
  const { clean, action } = parseAction(raw);
  return {
    text: clean || raw,
    action,
    pendingApproval: null,
    conversationId: opts.conversationId ?? null,
    source: GeminiService.isConfigured() ? 'gemini' : 'canned',
  };
}

export const AssistantService = {
  /** A conversational turn. Tries SN agents first, then Gemini, then canned. */
  async send(message: string, opts: AssistantSendOptions): Promise<AssistantReply> {
    try {
      const sn = await trySN(message, opts);
      if (sn) return sn;
    } catch (e) {
      console.warn('AssistantService SN path failed:', e);
    }
    try {
      return await tryGemini(message, opts);
    } catch (e) {
      console.error('AssistantService Gemini path failed:', e);
      return {
        text: cannedFor(opts.role),
        source: 'canned',
        isError: true,
        conversationId: opts.conversationId ?? null,
      };
    }
  },

  /** Resolve a supervised action (Approve/Reject), then settle the run. */
  async approve(conversationId: string, approve: boolean): Promise<AssistantReply> {
    try {
      const res = await snAgentApprove(conversationId, approve);
      if (!res || res.success === false) {
        return {
          text: approve ? 'Action approved.' : 'Action rejected.',
          source: 'servicenow',
          conversationId,
        };
      }
      const settled =
        res.status === 'working' || res.status === 'queued'
          ? (await pollUntilSettled(conversationId)) || res
          : res;
      return toReply(conversationId, settled);
    } catch (e) {
      console.error('AssistantService approve failed:', e);
      return {
        text: approve ? 'Action approved.' : 'Action rejected.',
        source: 'servicenow',
        conversationId,
        isError: true,
      };
    }
  },

  /**
   * Short screen-aware nudge for the floating mascot. Prioritises speed
   * (Gemini → friendly canned); conversational chat is where SN agents add the
   * most value. Kept here so it can be re-routed to SN later without touching
   * callers.
   */
  async proactiveTip(role: AssistantRole, screenContext: string, language: string): Promise<string> {
    const prompt =
      role === 'customer'
        ? `Give ONE short, warm, proactive tip (max 2 sentences) for a first-time refugee user on the "${screenContext}" screen. No greeting — just the tip.`
        : `Give ONE short, professional proactive tip (max 2 sentences) for a case officer on the "${screenContext}" screen. No greeting — just the tip.`;
    if (GeminiService.isConfigured()) {
      try {
        const raw = await GeminiService.sendMessage(prompt, role, screenContext, [], language);
        const clean = parseAction(raw).clean;
        if (clean) return clean;
      } catch (e) {
        console.warn('AssistantService proactiveTip failed:', e);
      }
    }
    // No live model → a friendly, screen-aware line (never the config nag).
    return cannedTip(role, screenContext);
  },
};
