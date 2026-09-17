import React from 'react';
import {
  ShieldCheck, AlertTriangle, FileCheck2, GitCompareArrows, XCircle, FileWarning, Gavel,
} from 'lucide-react';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { Badge } from '../common/Badge';

// ============================================================================
// Bridge360 — Feature 2 UI: AI Verification Summary Card
// ----------------------------------------------------------------------------
// Presentational only. Renders the advisory output shape produced by
// global.Bridge360AIVerification.generateVerificationContext(...) — specifically
// its `summary_stats` and `advisory_verdict`. This component does NOT call any
// agent or REST endpoint; the parent will pass `summary`/`advisory` once the
// verification agent is connected in a later phase.
// ============================================================================

/** Mirrors `summary_stats` from the verification context. */
export interface AIVerificationSummary {
  documents_analyzed: number;
  fields_extracted: number;
  fields_matched: number;
  possible_variations: number;
  mismatches: number;
  missing_evidence: number;
  overall_confidence: number; // 0–100
  risk_indicator: string;     // HIGH | MEDIUM | ELEVATED | LOW_CONFIDENCE | LOW
}

/** Mirrors `advisory_verdict` from the verification context. */
export interface AIAdvisoryVerdict {
  verdict: string;          // READY_FOR_APPROVAL | READY_WITH_VARIATION_NOTE | ADDITIONAL_DOCUMENTS_REQUESTED | REQUIRES_OFFICER_REVIEW
  advisory_action?: string;
  rationale: string;
}

export interface AIVerificationSummaryCardProps {
  summary?: AIVerificationSummary | null;
  advisory?: AIAdvisoryVerdict | null;
  /** Optional footnote, e.g. the deterministic engine / correlation id. */
  sourceNote?: string;
}

type Tone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

function riskTone(risk: string): Tone {
  switch ((risk || '').toUpperCase()) {
    case 'HIGH': return 'error';
    case 'MEDIUM':
    case 'ELEVATED': return 'warning';
    case 'LOW_CONFIDENCE': return 'info';
    case 'LOW': return 'success';
    default: return 'neutral';
  }
}

function verdictTone(verdict: string): Tone {
  switch ((verdict || '').toUpperCase()) {
    case 'READY_FOR_APPROVAL': return 'success';
    case 'READY_WITH_VARIATION_NOTE': return 'info';
    case 'ADDITIONAL_DOCUMENTS_REQUESTED': return 'warning';
    case 'REQUIRES_OFFICER_REVIEW': return 'error';
    default: return 'neutral';
  }
}

function humanize(token: string): string {
  return (token || '').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

const shell: React.CSSProperties = {
  backgroundColor: 'var(--color-white)',
  border: '1px solid var(--color-neutral-200)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-xs)',
  overflow: 'hidden',
};

const StatTile: React.FC<{ label: string; value: React.ReactNode; icon: React.ReactNode; tone?: Tone }> = ({
  label, value, icon, tone = 'neutral',
}) => {
  const toneColor: Record<Tone, string> = {
    success: 'var(--color-success-text)',
    warning: 'var(--color-warning-text)',
    error: 'var(--color-error-text)',
    info: 'var(--color-info-text)',
    neutral: 'var(--color-neutral-700)',
  };
  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-neutral-200)',
        backgroundColor: 'var(--color-neutral-50)',
        display: 'flex', flexDirection: 'column', gap: '6px',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-neutral-500)', fontWeight: 600 }}>
        <span style={{ color: toneColor[tone], display: 'inline-flex' }}>{icon}</span>
        {label}
      </span>
      <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-navy-900)', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </span>
    </div>
  );
};

export const AIVerificationSummaryCard: React.FC<AIVerificationSummaryCardProps> = ({
  summary, advisory, sourceNote,
}) => {
  return (
    <div style={shell}>
      {/* Header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--color-neutral-200)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}
      >
        <span
          style={{
            width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)',
          }}
        >
          <ShieldCheck size={18} />
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            AI Verification Summary
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
            Advisory analysis of identity documents vs. registration
          </p>
        </div>
        {summary && (
          <ConfidenceBadge score={Math.max(0, Math.min(100, Math.round(summary.overall_confidence)))} />
        )}
      </div>

      <div style={{ padding: '18px' }}>
        {!summary ? (
          <div
            style={{
              padding: '22px', textAlign: 'center', borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--color-neutral-300)', backgroundColor: 'var(--color-neutral-50)',
              color: 'var(--color-neutral-500)', fontSize: '13px',
            }}
          >
            No verification analysis yet. This card populates once the verification agent is connected.
          </div>
        ) : (
          <>
            {/* Confidence + Risk row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <Badge variant={riskTone(summary.risk_indicator)}>
                Risk: {humanize(summary.risk_indicator)}
              </Badge>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                {summary.fields_matched} of {summary.fields_extracted} extracted fields matched
              </span>
            </div>

            {/* Stats grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px', marginBottom: advisory ? '16px' : 0,
              }}
            >
              <StatTile label="Documents analyzed" value={summary.documents_analyzed} icon={<FileCheck2 size={13} />} tone="info" />
              <StatTile label="Matched fields" value={summary.fields_matched} icon={<FileCheck2 size={13} />} tone="success" />
              <StatTile label="Variations" value={summary.possible_variations} icon={<GitCompareArrows size={13} />} tone="info" />
              <StatTile label="Mismatches" value={summary.mismatches} icon={<XCircle size={13} />} tone={summary.mismatches > 0 ? 'error' : 'neutral'} />
              <StatTile label="Missing evidence" value={summary.missing_evidence} icon={<FileWarning size={13} />} tone={summary.missing_evidence > 0 ? 'warning' : 'neutral'} />
            </div>

            {/* Advisory verdict */}
            {advisory && (
              <div
                style={{
                  padding: '14px 16px', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-neutral-200)', backgroundColor: 'var(--color-neutral-50)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Gavel size={15} style={{ color: 'var(--color-neutral-600)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-600)' }}>Advisory Verdict</span>
                  <span style={{ marginLeft: 'auto' }}>
                    <Badge variant={verdictTone(advisory.verdict)}>{humanize(advisory.verdict)}</Badge>
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-navy-800)', lineHeight: 1.5 }}>
                  {advisory.rationale}
                </p>
                {advisory.advisory_action && (
                  <p style={{ fontSize: '11px', color: 'var(--color-neutral-500)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={12} />
                    Suggested action: {humanize(advisory.advisory_action)} — advisory only; officer decision required.
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {sourceNote && (
          <p style={{ fontSize: '10.5px', color: 'var(--color-neutral-400)', marginTop: '14px' }}>{sourceNote}</p>
        )}
      </div>
    </div>
  );
};
