// featureContextMapper.ts
// Pure translation layer between Feature 2's backend `verification_context`
// (produced by Bridge360AIVerification.generateVerificationContext / surfaced by
// Bridge360VerificationAgent.evaluateApplication) and the prop shapes the two
// Feature 2 cards expect. Isolated + side-effect-free so it stays unit-testable
// and the card components never learn the backend field names.
//
// summary_stats and advisory_verdict are 1:1 with the card types. The country
// compliance block needs six field-name / type translations (documented inline).

import type { AIVerificationSummary, AIAdvisoryVerdict } from '../components/verification/AIVerificationSummaryCard';
import type {
  CountryEvidenceCompliance,
  CountryProfile,
  EvidenceDocumentType,
  EvidenceRuleSummary,
  VerificationAuthoritySummary,
  ExternalVerificationRequestSummary,
} from '../components/verification/CountryEvidenceIntelligenceCard';

/** External-verification request statuses the backend treats as pending / completed
 *  (mirrors Bridge360AIVerification._retrieveCountryEvidenceContext, §6). */
const PENDING_STATUSES = ['dispatched', 'in_progress', 'pending_dispatch'];
const COMPLETED_STATUSES = ['verified', 'inconclusive', 'discrepancy_flagged'];

function toInt(v: any): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? 0 : n;
}

function str(v: any): string | undefined {
  if (typeof v === 'string') return v.trim() || undefined;
  if (typeof v === 'number' && !Number.isNaN(v)) return String(v);
  return undefined;
}

/** `summary_stats` → AIVerificationSummary (1:1). Returns null if absent. */
export function mapSummary(ctx: any): AIVerificationSummary | null {
  const s = ctx?.summary_stats;
  if (!s || typeof s !== 'object') return null;
  return {
    documents_analyzed: toInt(s.documents_analyzed),
    fields_extracted: toInt(s.fields_extracted),
    fields_matched: toInt(s.fields_matched),
    possible_variations: toInt(s.possible_variations),
    mismatches: toInt(s.mismatches),
    missing_evidence: toInt(s.missing_evidence),
    overall_confidence: toInt(s.overall_confidence),
    risk_indicator: String(s.risk_indicator || 'LOW'),
  };
}

/** `advisory_verdict` → AIAdvisoryVerdict (1:1). Returns null if absent. */
export function mapAdvisory(ctx: any): AIAdvisoryVerdict | null {
  const a = ctx?.advisory_verdict;
  if (!a || typeof a !== 'object' || !a.verdict) return null;
  return {
    verdict: String(a.verdict),
    advisory_action: str(a.advisory_action),
    rationale: String(a.rationale || ''),
  };
}

/**
 * `country_evidence_compliance` → CountryEvidenceCompliance. Handles the six
 * backend→card translations:
 *   1. doc `category`            → `document_category`
 *   2. doc `issuing_authority`   → `issuing_authority_desc`
 *   3. rule `primary_document_types` array → joined string
 *   4. rule `min_confidence_threshold` (never emitted) → omitted
 *   5. `external_verification_pending/completed` booleans → counts derived from requests
 *   6. request `authority_name` (always '') → fall back to request_type / request_id
 */
export function mapCompliance(ctx: any): CountryEvidenceCompliance | null {
  const c = ctx?.country_evidence_compliance;
  if (!c || typeof c !== 'object') return null;

  const country: CountryProfile | null = c.country
    ? {
        country_name: c.country.country_name || '',
        iso2: str(c.country.iso2),
        iso3: str(c.country.iso3),
        nationality: str(c.country.nationality),
        official_languages: str(c.country.official_languages),
        scripts_used: str(c.country.scripts_used),
        naming_convention: str(c.country.naming_convention),
        civil_registry_info: str(c.country.civil_registry_info),
      }
    : null;

  const relevant_document_types: EvidenceDocumentType[] = Array.isArray(c.relevant_document_types)
    ? c.relevant_document_types.map((d: any) => ({
        document_name: str(d.document_name),
        document_category: str(d.category),          // (1) rename
        local_name: str(d.local_name),
        issuing_authority_desc: str(d.issuing_authority), // (2) rename
      }))
    : [];

  const applicable_evidence_rules: EvidenceRuleSummary[] = Array.isArray(c.applicable_evidence_rules)
    ? c.applicable_evidence_rules.map((r: any) => ({
        description: str(r.description),
        claim_type: str(r.claim_type),
        strictness: str(r.strictness),
        primary_document_types: Array.isArray(r.primary_document_types) // (3) array → string
          ? r.primary_document_types.filter(Boolean).join(', ') || undefined
          : str(r.primary_document_types),
        // (4) min_confidence_threshold intentionally omitted — backend never emits it.
      }))
    : [];

  const verification_authorities: VerificationAuthoritySummary[] = Array.isArray(c.verification_authorities)
    ? c.verification_authorities.map((a: any) => ({
        authority_name: a.authority_name || 'Authority',
        verification_method: str(a.verification_method),
        api_available: !!a.api_available,
        response_sla_days: typeof a.response_sla_days === 'number' ? a.response_sla_days : undefined,
      }))
    : [];

  const rawRequests: any[] = Array.isArray(c.external_verification_requests)
    ? c.external_verification_requests
    : [];
  const external_verification_requests: ExternalVerificationRequestSummary[] = rawRequests.map((rq: any) => ({
    authority_name: str(rq.authority_name) || str(rq.request_type) || str(rq.request_id), // (6) empty-name fallback
    status: str(rq.status),
  }));

  // (5) booleans → derived counts, using the backend's own pending/completed status sets.
  const pending = rawRequests.filter((rq: any) => PENDING_STATUSES.indexOf(rq?.status) !== -1).length;
  const completed = rawRequests.filter((rq: any) => COMPLETED_STATUSES.indexOf(rq?.status) !== -1).length;

  return {
    country,
    relevant_document_types,
    applicable_evidence_rules,
    verification_authorities,
    external_verification_requests,
    evidence_rules_applied:
      typeof c.evidence_rules_applied === 'number' ? c.evidence_rules_applied : undefined,
    external_verification_available: !!c.external_verification_available,
    external_verification_pending: pending,
    external_verification_completed: completed,
  };
}

/** Convenience: build all three card prop bundles from an evaluation's `verification_context`. */
export function mapFeatureCards(verificationContext: any): {
  summary: AIVerificationSummary | null;
  advisory: AIAdvisoryVerdict | null;
  compliance: CountryEvidenceCompliance | null;
} {
  return {
    summary: mapSummary(verificationContext),
    advisory: mapAdvisory(verificationContext),
    compliance: mapCompliance(verificationContext),
  };
}
