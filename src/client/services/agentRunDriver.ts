// agentRunDriver.ts
// Drives an admin "verification run" and feeds the shared `agentRun` state that
// the live timeline + result canvas render.
//
// Mirrors Bridge360's existing SN→Gemini→canned philosophy with a three-tier
// cascade:
//   1. serviceNowVerificationDriver  — the REAL Verification Agent (Feature 2).
//   2. localOrchestratorDriver       — the deterministic rule engine (no LLM).
//   3. simulatorDriver               — clearly-labeled demo data, last resort.
//
// Every result carries a `provenance` tag so the canvas can badge it honestly;
// nothing simulated is ever presented as "synchronized to ServiceNow", and the
// ServiceNow driver invents no member names/outcomes — those come only from the
// real payload.

import type {
  RunStage,
  RunStageStatus,
  RunResult,
  RunProvenance,
  RunMemberRow,
} from '../store/AssistantContext';
import { FamilyRecord, DocumentRecord } from '../types/bridge360';
import { AgentOrchestrator, AgentResult } from './AgentOrchestrator';
import { snVerifyApplication, SNVerificationAgentResponse } from './snApi';
import { mapFeatureCards } from './featureContextMapper';

/** Everything a driver needs to evaluate one application. */
export interface VerificationRunInput {
  applicationId: string;
  family: FamilyRecord;
  documents: DocumentRecord[];
  membersCount: number;
  language?: string;
}

/** The driver pushes progress by re-emitting the full stage list each transition. */
export type RunEmit = (stages: RunStage[], provenance: RunProvenance) => void;

interface RunDriver {
  key: RunProvenance;
  run(input: VerificationRunInput, emit: RunEmit): Promise<RunResult>;
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Small helper that owns a stage list and re-emits an immutable snapshot on
 * every transition, so React sees a new array reference each time.
 */
function makeTracker(
  defs: Array<{ id: string; label: string }>,
  emit: RunEmit,
  provenance: RunProvenance,
) {
  const stages: RunStage[] = defs.map(d => ({ id: d.id, label: d.label, status: 'pending' as RunStageStatus }));
  const emitNow = () => emit(stages.map(s => ({ ...s })), provenance);
  const set = (id: string, status: RunStageStatus, detail?: string) => {
    const s = stages.find(x => x.id === id);
    if (s) {
      s.status = status;
      if (detail !== undefined) s.detail = detail;
    }
    emitNow();
  };
  return {
    active: (id: string, detail?: string) => set(id, 'active', detail),
    done: (id: string, detail?: string) => set(id, 'done', detail),
    error: (id: string, detail?: string) => set(id, 'error', detail),
    emitNow,
  };
}

// ── Normalizer helpers (defensive — the SN payload shape is not contractual) ─

/** First non-empty string among the candidates (numbers coerced to string). */
function firstStr(...vals: any[]): string | undefined {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number' && !isNaN(v)) return String(v);
  }
  return undefined;
}

/** Coerce a confidence-ish value to a 0–100 integer (fractions scaled up). */
function toPct(v: any): number | undefined {
  if (v === null || v === undefined) return undefined;
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  if (isNaN(n)) return undefined;
  if (n >= 0 && n <= 1) return Math.round(n * 100);
  return Math.round(n);
}

function firstArray(...vals: any[]): any[] {
  for (const v of vals) if (Array.isArray(v) && v.length) return v;
  return [];
}

function pickMessage(res: any): string | undefined {
  return firstStr(res?.message, res?.error_code, res?.error?.message);
}

/** 'READY_FOR_APPROVAL' → 'Ready For Approval'; undefined for empty/non-strings. */
function humanizeToken(token?: any): string | undefined {
  if (!token || typeof token !== 'string') return undefined;
  const t = token.trim();
  return t ? t.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : undefined;
}

/** True when the payload is Feature 2's `evaluateApplication` contract. */
function isFeature2Response(res: any): boolean {
  return (
    !!res &&
    (((res.verification_context && typeof res.verification_context === 'object') ||
      (res.correlation_analysis && typeof res.correlation_analysis === 'object') ||
      Array.isArray(res.reasoning_trail)) as boolean)
  );
}

/**
 * Map Feature 2's real `evaluateApplication` contract into a RunResult. Member
 * rows come from `correlation_analysis.member_audit`; the recommendation +
 * summary from the synthesized decision package; flags/details from
 * `verification_context.summary_stats`. The two Feature 2 cards are built from
 * `verification_context` via the pure mapper. Fabricates nothing.
 */
function normalizeFeature2(res: SNVerificationAgentResponse): RunResult {
  const vctx =
    res.verification_context && typeof res.verification_context === 'object'
      ? res.verification_context
      : undefined;
  const corr =
    res.correlation_analysis && typeof res.correlation_analysis === 'object'
      ? res.correlation_analysis
      : undefined;
  const stats = vctx?.summary_stats;

  // Members: correlation_analysis.member_audit (fallback verification_context.members).
  const audit = firstArray(corr?.member_audit, vctx?.members);
  const members: RunMemberRow[] = audit.map((m: any, i: number) => ({
    name:
      firstStr(m.name, [m.first_name, m.last_name].filter(Boolean).join(' ')) || `Member ${i + 1}`,
    role: m.is_head ? 'Head of family' : humanizeToken(m.relationship),
    status: humanizeToken(m.verification_status) || 'Reviewed',
    // member_audit carries no per-member confidence → omit rather than invent.
    advisory: m.has_direct_document === false ? 'No directly-matched identity document' : undefined,
  }));

  const recommendation =
    humanizeToken(res.overall_verdict) || humanizeToken(res.recommended_action) || 'Reviewed';
  const justification =
    firstStr(res.action_rationale, res.executive_brief) ||
    'The Verification Agent completed its evaluation.';
  const summary =
    firstStr(res.executive_brief, res.action_rationale) || 'Verification evaluation complete.';

  const details: { label: string; value: string }[] = [];
  const conf = toPct(res.confidence_score);
  if (conf !== undefined) details.push({ label: 'Overall confidence', value: `${conf}%` });
  const risk = humanizeToken(res.risk_level);
  if (risk) details.push({ label: 'Risk level', value: risk });
  const action = humanizeToken(res.recommended_action);
  if (action) details.push({ label: 'Recommended action', value: action });
  if (stats) {
    if (typeof stats.documents_analyzed === 'number')
      details.push({ label: 'Documents analyzed', value: String(stats.documents_analyzed) });
    if (typeof stats.fields_matched === 'number' && typeof stats.fields_extracted === 'number')
      details.push({ label: 'Fields matched', value: `${stats.fields_matched}/${stats.fields_extracted}` });
  }

  const flags: string[] = [];
  if (stats) {
    if (Number(stats.mismatches) > 0) flags.push(`${stats.mismatches} attribute mismatch(es) detected`);
    if (Number(stats.missing_evidence) > 0) flags.push(`${stats.missing_evidence} missing evidence item(s)`);
    if (Number(stats.possible_variations) > 0)
      flags.push(`${stats.possible_variations} transliteration variation(s) noted`);
  }
  if (corr) {
    if (corr.household_size_consistent === false)
      flags.push('Declared household size is inconsistent with member records');
    firstArray(corr.missing_required_documents).forEach((d: any) => {
      const s = firstStr(typeof d === 'string' ? d : d?.document_name ?? d?.label ?? d?.name);
      if (s) flags.push(`Missing required document: ${s}`);
    });
  }

  return {
    members,
    summary,
    decision: { recommendation, justification },
    details: details.length ? details : undefined,
    flags: flags.length ? flags : undefined,
    provenance: 'servicenow',
    featureCards: vctx ? mapFeatureCards(vctx) : undefined,
    raw: res,
  };
}

/**
 * Fallback normalizer for a non-Feature-2 payload. Probes several plausible
 * field names; renders exactly what's present and fabricates nothing.
 */
function normalizeGeneric(res: SNVerificationAgentResponse): RunResult {
  const ev = res && typeof res.evaluation === 'object' && res.evaluation ? res.evaluation : res;

  const rawMembers = firstArray(ev.members, ev.memberResults, ev.evaluations, ev.familyMembers, res.members);
  const members: RunMemberRow[] = rawMembers.map((m: any, i: number) => ({
    name:
      firstStr(
        m.name,
        m.fullName,
        m.memberName,
        [m.firstName, m.middleName, m.lastName].filter(Boolean).join(' '),
        m.member,
      ) || `Member ${i + 1}`,
    role: firstStr(m.role, m.relationship, m.relationshipToHead, m.isHead ? 'Head of family' : undefined),
    status: firstStr(m.status, m.verificationStatus, m.decision, m.outcome, m.result) || 'Reviewed',
    confidence: toPct(m.confidence ?? m.score ?? m.confidenceScore ?? m.matchScore),
    advisory: firstStr(m.advisory, m.reasoning, m.rationale, m.note, m.notes, m.recommendation, m.message),
  }));

  const recommendation =
    firstStr(
      ev.recommendation,
      ev.decision,
      ev.overallDecision,
      ev.overallRecommendation,
      ev.status,
      res.recommendation,
    ) || 'Reviewed';
  const justification =
    firstStr(ev.justification, ev.reasoning, ev.rationale, ev.analysis, ev.summary, res.message) ||
    'The Verification Agent completed its evaluation.';
  const summary =
    firstStr(ev.summary, ev.overallSummary, ev.analysis, res.message, justification) ||
    'Verification evaluation complete.';

  const flags = firstArray(ev.discrepancies, ev.flags, ev.warnings, ev.issues)
    .map((f: any) => (typeof f === 'string' ? f : firstStr(f.message, f.detail, f.text, f.label)))
    .filter((s): s is string => !!s);

  const details: { label: string; value: string }[] = [];
  const addDetail = (label: string, v: any) => {
    const s = firstStr(v);
    if (s) details.push({ label, value: s });
  };
  addDetail('Assigned officer', ev.assignedOfficer ?? ev.officer);
  addDetail('Priority', ev.priority);
  addDetail('Risk score', ev.riskScore ?? ev.risk ?? ev.riskLevel);
  const overallPct = toPct(ev.confidence ?? ev.overallConfidence);
  if (overallPct !== undefined) details.push({ label: 'Overall confidence', value: `${overallPct}%` });
  addDetail('Documents verified', ev.verifiedCount ?? ev.documentsVerified);

  return {
    members,
    summary,
    decision: { recommendation, justification },
    details: details.length ? details : undefined,
    flags: flags.length ? flags : undefined,
    provenance: 'servicenow',
    raw: res,
  };
}

/**
 * Turn whatever the Verification Agent returned into the canvas's RunResult.
 * Uses Feature 2's real contract when present, else defensively probes a generic
 * payload. Fabricates nothing.
 */
function normalizeServiceNow(res: SNVerificationAgentResponse): RunResult {
  return isFeature2Response(res) ? normalizeFeature2(res) : normalizeGeneric(res);
}

/** Map the local rule-engine AgentResult into a RunResult (no invented confidence). */
function mapLocalResult(r: AgentResult, input: VerificationRunInput): RunResult {
  const people = [input.family.headOfFamily, ...(input.family.members || [])].filter(Boolean);
  const verified = r.docAnalysis.status === 'Verified';
  const members: RunMemberRow[] = people.map(p => ({
    name: [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Unnamed member',
    role: p.relationshipToHead === 'Self' ? 'Head of family' : p.relationshipToHead,
    status: verified ? 'Verified' : 'Needs Review',
  }));

  const details = [
    { label: 'Assigned officer', value: r.triage.assignedOfficer },
    { label: 'Priority', value: r.triage.priority },
    { label: 'Risk score', value: r.riskAssessment.score },
    { label: 'Documents verified', value: String(r.docAnalysis.verifiedCount) },
  ];
  const flags = [...r.docAnalysis.discrepancies, ...r.riskAssessment.factors];

  return {
    members,
    summary: `${r.triage.notes} Document status: ${r.docAnalysis.status}. Risk level: ${r.riskAssessment.score}.`,
    decision: { recommendation: r.decisionDraft.recommendation, justification: r.decisionDraft.justification },
    details,
    flags: flags.length ? flags : undefined,
    provenance: 'local',
    raw: r,
  };
}

// ── Drivers ─────────────────────────────────────────────────────────────────

const SN_STAGES = [
  { id: 'triage', label: 'Triage Agent — context ingestion & routing' },
  { id: 'docs', label: 'Document Analyst — attribute & evidence evaluation' },
  { id: 'risk', label: 'Risk Assessment — integrity & household synthesis' },
  { id: 'decision', label: 'Decision Drafter — recommendation & artifacts' },
  { id: 'ready', label: 'Results ready' },
];

const serviceNowVerificationDriver: RunDriver = {
  key: 'servicenow',
  async run(input, emit) {
    const t = makeTracker(SN_STAGES, emit, 'servicenow');

    // The evaluation is a single synchronous call. Show the first named agent
    // (Triage) working while it runs; the real per-agent detail is filled in from
    // the engine's reasoning_trail once the response arrives.
    t.active('triage');
    const res = await snVerifyApplication(input.applicationId, {
      callerContext: {
        caller_type: 'verification_agent',
        caller_id: 'officer_ui',
        calling_agent_name: 'Bridge360 Admin UI',
        purpose: 'officer_initiated_verification',
        correlation_id: input.applicationId,
      },
      userQuery:
        'Evaluate this application for verification readiness and summarize per-member findings.',
    });

    if (!res || res.success === false) {
      const msg = pickMessage(res) || 'Verification Agent unavailable';
      t.error('triage', msg);
      throw new Error(msg);
    }

    // Drive the 4 named agents from the real reasoning_trail step summaries:
    //   step 1 Context Ingestion → Triage
    //   step 2 Deterministic Attribute Evaluation (+ step 5 Country Evidence) → Document Analyst
    //   step 4 Risk & Integrity Synthesis (+ step 3 Household Coverage) → Risk Assessment
    //   decision package (verdict / recommended action) → Decision Drafter
    const trail: any[] = Array.isArray(res.reasoning_trail) ? res.reasoning_trail : [];
    const stepSummary = (n: number): string | undefined => {
      const s = trail.find((x: any) => Number(x?.step) === n);
      return s ? firstStr(s.summary, s.title) : undefined;
    };

    t.done('triage', stepSummary(1));

    t.active('docs');
    await sleep(160);
    t.done('docs', firstStr(stepSummary(2), stepSummary(5)));

    t.active('risk');
    await sleep(160);
    t.done('risk', firstStr(stepSummary(4), stepSummary(3)));

    t.active('decision');
    await sleep(160);
    t.done(
      'decision',
      firstStr(humanizeToken(res.recommended_action), humanizeToken(res.overall_verdict)) ||
        'Decision package compiled',
    );

    t.done('ready');
    return normalizeServiceNow(res);
  },
};

const LOCAL_STAGES = [
  { id: 'triage', label: 'Triage — routing & priority' },
  { id: 'docs', label: 'Document analysis' },
  { id: 'risk', label: 'Risk assessment' },
  { id: 'decision', label: 'Drafting decision' },
  { id: 'ready', label: 'Results ready' },
];

const localOrchestratorDriver: RunDriver = {
  key: 'local',
  async run(input, emit) {
    const t = makeTracker(LOCAL_STAGES, emit, 'local');

    t.active('triage');
    await sleep(320);
    const result = AgentOrchestrator.evaluate(input.family, input.documents, input.membersCount);
    t.done('triage', `Assigned to ${result.triage.assignedOfficer} · ${result.triage.priority} priority`);

    t.active('docs');
    await sleep(360);
    t.done('docs', `${result.docAnalysis.verifiedCount} document(s) matched · ${result.docAnalysis.discrepancies.length} flag(s)`);

    t.active('risk');
    await sleep(300);
    t.done('risk', `Risk level: ${result.riskAssessment.score}`);

    t.active('decision');
    await sleep(300);
    t.done('decision', result.decisionDraft.recommendation);

    t.done('ready');
    return mapLocalResult(result, input);
  },
};

const simulatorDriver: RunDriver = {
  key: 'simulated',
  async run(input, emit) {
    const t = makeTracker(LOCAL_STAGES, emit, 'simulated');
    for (const s of LOCAL_STAGES) {
      t.active(s.id);
      await sleep(220);
      t.done(s.id);
    }

    const people = [input.family.headOfFamily, ...(input.family.members || [])].filter(Boolean);
    const members: RunMemberRow[] = people.map((p, i) => ({
      name: [p.firstName, p.lastName].filter(Boolean).join(' ') || `Member ${i + 1}`,
      role: p.relationshipToHead === 'Self' ? 'Head of family' : p.relationshipToHead,
      status: 'Verified',
      confidence: 86 + ((i * 4) % 12),
    }));

    return {
      members,
      summary:
        'DEMO simulation — no live evaluation was performed. This placeholder illustrates the result layout only and is NOT synchronized to ServiceNow.',
      decision: {
        recommendation: 'Approved',
        justification: 'Simulated recommendation for demonstration. Connect the Verification Agent for a real decision.',
      },
      flags: ['This is simulated data — do not act on it.'],
      provenance: 'simulated',
    };
  },
};

/**
 * Run a verification, cascading SN → local → simulator. Locally, mock
 * application IDs that the real agent can't resolve degrade to the local
 * driver; on the deployed instance real IDs exercise the real agent.
 */
export async function runAgentVerification(input: VerificationRunInput, emit: RunEmit): Promise<RunResult> {
  try {
    return await serviceNowVerificationDriver.run(input, emit);
  } catch (snErr) {
    console.warn('[agentRunDriver] ServiceNow verification unavailable, falling back to local:', snErr);
  }

  try {
    return await localOrchestratorDriver.run(input, emit);
  } catch (localErr) {
    console.warn('[agentRunDriver] Local orchestrator failed, using simulator:', localErr);
  }

  return simulatorDriver.run(input, emit);
}
