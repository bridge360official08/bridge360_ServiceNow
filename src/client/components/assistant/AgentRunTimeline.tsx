import React from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import type { RunStage, AgentRunStatus } from '../../store/AssistantContext';

export interface AgentRunTimelineProps {
  stages: RunStage[];
  status: AgentRunStatus;
}

/**
 * Vertical "the Intern is working" timeline: a dot + connector per stage that
 * live-updates as the run driver emits (pending → active-pulse → done-check /
 * error). Reads its data straight from `agentRun.stages`.
 */
export const AgentRunTimeline: React.FC<AgentRunTimelineProps> = ({ stages, status }) => {
  if (!stages.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '18px 4px', color: '#64748B', fontSize: '0.85rem' }}>
        <Loader2 size={16} className="b360-run-spin" />
        Starting verification…
      </div>
    );
  }

  return (
    <div style={{ padding: '4px 2px' }}>
      {stages.map((s, i) => {
        const isLast = i === stages.length - 1;
        const dot = dotStyle(s.status);
        return (
          <div key={s.id} style={{ display: 'flex', gap: '12px' }}>
            {/* Rail: dot + connector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, ...dot.circle,
                }}
              >
                {s.status === 'done' && <Check size={14} />}
                {s.status === 'error' && <X size={14} />}
                {s.status === 'active' && <Loader2 size={13} className="b360-run-spin" />}
              </div>
              {!isLast && (
                <div
                  style={{
                    width: '2px', flex: 1, minHeight: '20px',
                    background: s.status === 'done' ? '#16A34A' : '#E2E8F0',
                    margin: '2px 0',
                  }}
                />
              )}
            </div>

            {/* Label + detail */}
            <div style={{ paddingBottom: isLast ? 0 : '14px', paddingTop: '2px', minWidth: 0 }}>
              <div style={{ fontSize: '0.86rem', fontWeight: s.status === 'active' ? 700 : 600, color: dot.text }}>
                {s.label}
              </div>
              {s.detail && (
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '3px', lineHeight: 1.4 }}>
                  {s.detail}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {status === 'error' && (
        <div style={{ marginTop: '10px', fontSize: '0.78rem', color: '#DC2626' }}>
          The run stopped early — see the highlighted step above.
        </div>
      )}

      <style>{`
        .b360-run-spin { animation: b360-run-spin 0.9s linear infinite; }
        @keyframes b360-run-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

/** Circle + label colors for each stage status. */
function dotStyle(status: RunStage['status']): { circle: React.CSSProperties; text: string } {
  switch (status) {
    case 'done':
      return { circle: { background: '#16A34A', color: '#FFFFFF' }, text: '#0F172A' };
    case 'active':
      return {
        circle: {
          background: '#EEF2FF', color: '#4F46E5',
          border: '2px solid #6366F1',
          boxShadow: '0 0 0 4px rgba(99,102,241,0.15)',
        },
        text: '#4338CA',
      };
    case 'error':
      return { circle: { background: '#DC2626', color: '#FFFFFF' }, text: '#B91C1C' };
    default: // pending
      return { circle: { background: '#F1F5F9', color: '#94A3B8', border: '2px solid #E2E8F0' }, text: '#94A3B8' };
  }
}

export default AgentRunTimeline;
