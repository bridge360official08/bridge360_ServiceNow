import React from 'react';
import {
  ShieldCheck, Cpu, FlaskConical, Check, Ban, RefreshCw, Loader2, AlertTriangle, User,
} from 'lucide-react';
import type { AgentTarget, RunResult, RunProvenance } from '../../store/AssistantContext';
import { ConfidenceBadge } from '../common/ConfidenceBadge';

export interface AgentResultCanvasProps {
  result: RunResult;
  target: AgentTarget | null;
  /** True while a Proceed/Reject apply is in flight — disables the buttons. */
  busy: boolean;
  onProceed: () => void;
  onReverify: () => void;
  onReject: () => void;
}

/**
 * The clean "result canvas" the run produces: a provenance badge, per-member
 * findings, key facts, flags, the decision package, and supervised action
 * buttons. Purely presentational — the parent view owns confirm + apply so the
 * side effects live next to the local-state mirror.
 */
export const AgentResultCanvas: React.FC<AgentResultCanvasProps> = ({
  result, target, busy, onProceed, onReverify, onReject,
}) => {
  const prov = provenanceChip(result.provenance);

  return (
    <div style={{ color: '#0F172A' }}>
      {/* Provenance banner */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 12px', borderRadius: '8px', marginBottom: '14px',
          background: prov.bg, border: `1px solid ${prov.border}`, color: prov.color,
          fontSize: '0.76rem', fontWeight: 700,
        }}
      >
        {prov.icon}
        <span>{prov.label}</span>
        {target?.label && (
          <span style={{ marginLeft: 'auto', fontWeight: 600, opacity: 0.85 }}>{target.label}</span>
        )}
      </div>

      {result.provenance === 'simulated' && (
        <div style={{ fontSize: '0.76rem', color: '#B45309', marginBottom: '12px', lineHeight: 1.45 }}>
          This is demonstration data generated locally. It has <strong>not</strong> been evaluated by
          ServiceNow — do not treat it as a real decision.
        </div>
      )}

      {/* Summary */}
      {result.summary && (
        <p style={{ fontSize: '0.88rem', lineHeight: 1.55, color: '#1E293B', margin: '0 0 16px' }}>
          {result.summary}
        </p>
      )}

      {/* Per-member findings */}
      <SectionTitle>Family members</SectionTitle>
      {!result.members || result.members.length === 0 ? (
        <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '16px' }}>
          No per-member breakdown was returned.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
          {result.members.map((m: any, i: number) => {
            const tone = statusTone(m.status);
            return (
              <div
                key={`${m.name}-${i}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '10px', background: '#FFFFFF',
                }}
              >
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={15} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A' }}>{m.name}</div>
                  {m.role && <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{m.role}</div>}
                  {m.advisory && (
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '3px', lineHeight: 1.4 }}>{m.advisory}</div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {typeof m.confidence === 'number' && <ConfidenceBadge score={m.confidence} showLabel={false} />}
                  <span
                    style={{
                      padding: '3px 9px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                      background: tone.bg, color: tone.color, border: `1px solid ${tone.border}`, whiteSpace: 'nowrap',
                    }}
                  >
                    {m.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Key facts */}
      {result.details && result.details.length > 0 && (
        <>
          <SectionTitle>Key facts</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', marginBottom: '18px' }}>
            {result.details.map((d, i) => (
              <div key={i} style={{ padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: '8px', background: '#F8FAFC' }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{d.label}</div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{d.value}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Flags / advisories */}
      {result.flags && result.flags.length > 0 && (
        <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-warning-text)', marginBottom: '6px' }}>
            <AlertTriangle size={14} /> Advisories ({result.flags.length})
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--color-warning-text)', fontSize: '0.8rem', lineHeight: 1.5 }}>
            {result.flags.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}

      {/* Decision package */}
      {result.decision && (
        <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#0F172A', color: '#E2E8F0', marginBottom: '18px' }}>
          <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Recommended decision
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 8px' }}>
            {result.decision?.recommendation}
          </div>
          <div style={{ fontSize: '0.82rem', lineHeight: 1.5, color: '#CBD5E1', whiteSpace: 'pre-wrap' }}>
            {result.decision?.justification}
          </div>
        </div>
      )}

      {/* Supervised actions */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={onProceed}
          disabled={busy}
          style={actionBtn('#16A34A', '#FFFFFF', busy)}
        >
          {busy ? <Loader2 size={15} className="b360-canvas-spin" /> : <Check size={15} />}
          Proceed
        </button>
        <button
          onClick={onReverify}
          disabled={busy}
          style={actionBtn('#FFFFFF', '#0F172A', busy, '#CBD5E1')}
        >
          <RefreshCw size={15} /> Re-verify
        </button>
        <button
          onClick={onReject}
          disabled={busy}
          style={actionBtn('#FFFFFF', '#DC2626', busy, '#FCA5A5')}
        >
          <Ban size={15} /> Reject
        </button>
      </div>

      <style>{`
        .b360-canvas-spin { animation: b360-canvas-spin 0.9s linear infinite; }
        @keyframes b360-canvas-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
    {children}
  </div>
);

function actionBtn(bg: string, color: string, busy: boolean, border?: string): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: '7px',
    padding: '9px 16px', borderRadius: '9px',
    border: border ? `1px solid ${border}` : 'none',
    background: bg, color, fontSize: '0.84rem', fontWeight: 700,
    cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.6 : 1,
  };
}

function provenanceChip(p?: RunProvenance): { label: string; icon: React.ReactNode; bg: string; border: string; color: string } {
  switch (p) {
    case 'servicenow':
      return { label: 'Verified by ServiceNow', icon: <ShieldCheck size={15} />, bg: 'var(--color-success-bg)', border: 'var(--color-success-border)', color: 'var(--color-success-text)' };
    case 'local':
      return { label: 'Computed locally', icon: <Cpu size={15} />, bg: '#EEF2FF', border: '#C7D2FE', color: '#4338CA' };
    case 'simulated':
      return { label: 'DEMO — not synchronized', icon: <FlaskConical size={15} />, bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)', color: 'var(--color-warning-text)' };
    default:
      return { label: 'Computed locally', icon: <Cpu size={15} />, bg: '#EEF2FF', border: '#C7D2FE', color: '#4338CA' };
  }
}

function statusTone(status: string): { bg: string; color: string; border: string } {
  const s = (status || '').toLowerCase();
  if (/verif|approv|match|clear|pass|complet|\bok\b|valid/.test(s)) {
    return { bg: 'var(--color-success-bg)', color: 'var(--color-success-text)', border: 'var(--color-success-border)' };
  }
  if (/reject|fail|mismatch|denied|flag|discrep|invalid|missing/.test(s)) {
    return { bg: 'var(--color-error-bg)', color: 'var(--color-error-text)', border: 'var(--color-error-border)' };
  }
  if (/review|pending|clarif|hold|manual|await/.test(s)) {
    return { bg: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', border: 'var(--color-warning-border)' };
  }
  return { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
}

export default AgentResultCanvas;
