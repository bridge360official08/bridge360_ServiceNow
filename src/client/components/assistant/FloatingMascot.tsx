import React, { useState, useEffect, useMemo } from 'react';
import { useAssistant, type MascotMode, type AgentRun } from '../../store/AssistantContext';
import { CustomerMascotSVG, AdminMascotSVG } from './MascotSVGs';
import { CheckCircle, Circle, Loader, AlertTriangle, X } from 'lucide-react';

/* ── Hologram cage colours per portal ── */
const HOLO = {
  customer: { primary: '#A855F7', secondary: '#C084FC', glow: 'rgba(168,85,247,0.35)', scanline: 'rgba(168,85,247,0.08)' },
  admin:    { primary: '#22D3EE', secondary: '#67E8F9', glow: 'rgba(34,211,238,0.35)', scanline: 'rgba(34,211,238,0.08)' },
} as const;

/* ── Inline keyframes (injected once) ── */
const HOLO_CSS = `
@keyframes holo-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes holo-scanline { 0%{background-position:0 100%} 100%{background-position:0 -200%} }
@keyframes holo-glitch {
  0%,90%,100%{transform:translate(0,0) skewX(0);opacity:1}
  92%{transform:translate(3px,-2px) skewX(-2deg);opacity:.85}
  94%{transform:translate(-2px,1px) skewX(1deg);opacity:.9}
  96%{transform:translate(1px,3px) skewX(-1deg);opacity:.8}
  98%{transform:translate(-1px,-1px) skewX(0);opacity:.95}
}
@keyframes holo-pulse { 0%,100%{opacity:.55} 50%{opacity:.85} }
@keyframes holo-cone-pulse { 0%,100%{opacity:.18} 50%{opacity:.32} }
@keyframes holo-ring { 0%{transform:scale(.8);opacity:.6} 50%{transform:scale(1.1);opacity:1} 100%{transform:scale(.8);opacity:.6} }
@keyframes mascot-undock {
  0%{transform:translateY(0) scale(.92);opacity:.7;filter:hue-rotate(0deg) brightness(1.3)}
  100%{transform:translateY(-12px) scale(1);opacity:1;filter:hue-rotate(0deg) brightness(1)}
}
@keyframes mascot-dock {
  0%{transform:translateY(-12px) scale(1);opacity:1;filter:brightness(1)}
  100%{transform:translateY(0) scale(.92);opacity:.7;filter:brightness(1.3)}
}
@keyframes bubble-in { 0%{opacity:0;transform:translateY(12px) scale(.9)} 100%{opacity:1;transform:translateY(0) scale(1)} }
@keyframes console-in { 0%{opacity:0;transform:translateX(-20px)} 100%{opacity:1;transform:translateX(0)} }
@keyframes work-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,211,238,.4)} 50%{box-shadow:0 0 12px 4px rgba(34,211,238,.2)} }
@media (prefers-reduced-motion: reduce) {
  .holo-glitch-layer { animation: none !important; }
}
`;

/* ══════════════════════════════════════════════════════════════
   Work Console — holographic timeline beside the mascot
   ══════════════════════════════════════════════════════════════ */
const WorkConsole: React.FC<{ runs: AgentRun[]; onDismiss: (id: string) => void }> = ({ runs, onDismiss }) => {
  if (runs.length === 0) return null;
  return (
    <div style={{
      position: 'absolute', left: '130px', bottom: '10px', width: '240px',
      maxHeight: '320px', overflowY: 'auto',
      background: 'linear-gradient(135deg, rgba(10,16,30,.92) 0%, rgba(19,41,74,.88) 100%)',
      border: '1px solid rgba(34,211,238,.35)',
      borderRadius: '14px', padding: '10px 12px',
      boxShadow: '0 0 24px rgba(34,211,238,.12), inset 0 0 40px rgba(34,211,238,.04)',
      animation: 'console-in .4s ease-out forwards, work-pulse 3s ease-in-out infinite',
      backdropFilter: 'blur(12px)',
      pointerEvents: 'auto',
      zIndex: 10,
    }}>
      <div style={{ fontSize: '.65rem', fontWeight: 800, color: '#22D3EE', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Loader size={10} style={{ animation: 'spin 1.5s linear infinite' }} /> Work Console
      </div>
      {runs.map(run => (
        <div key={run.id} style={{ marginBottom: '10px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
            <span style={{ fontSize: '.78rem', fontWeight: 700, color: '#E0F2FE', lineHeight: 1.3 }}>{run.title}</span>
            <button onClick={() => onDismiss(run.id)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '2px', flexShrink: 0 }}>
              <X size={12} />
            </button>
          </div>
          {/* Timeline steps */}
          <div style={{ paddingLeft: '6px', borderLeft: '2px solid rgba(34,211,238,.25)' }}>
            {run.stages.map((stage, i) => {
              const icon = stage.status === 'done' ? <CheckCircle size={12} color="#22C55E" />
                : stage.status === 'active' ? <Loader size={12} color="#22D3EE" style={{ animation: 'spin 1.2s linear infinite' }} />
                : stage.status === 'error' ? <AlertTriangle size={12} color="#EF4444" />
                : <Circle size={12} color="#475569" />;
              return (
                <div key={stage.id} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: i < run.stages.length - 1 ? '6px' : 0, paddingLeft: '8px' }}>
                  <span style={{ flexShrink: 0, marginTop: '1px' }}>{icon}</span>
                  <div>
                    <span style={{ fontSize: '.72rem', fontWeight: 600, color: stage.status === 'done' ? '#86EFAC' : stage.status === 'active' ? '#E0F2FE' : '#94A3B8' }}>{stage.label}</span>
                    {stage.detail && <div style={{ fontSize: '.65rem', color: '#64748B', lineHeight: 1.3 }}>{stage.detail}</div>}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Needs-input prompt */}
          {run.needsInput && (
            <div style={{ marginTop: '6px', padding: '6px 8px', borderRadius: '8px', background: 'rgba(251,191,36,.12)', border: '1px solid rgba(251,191,36,.3)', fontSize: '.72rem', color: '#FCD34D', fontWeight: 600 }}>
              ⚠ {run.needsInput.prompt}
            </div>
          )}
          {/* Result summary */}
          {run.status === 'completed' && run.resultSummary && (
            <div style={{ marginTop: '6px', padding: '6px 8px', borderRadius: '8px', background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.25)', fontSize: '.72rem', color: '#86EFAC', fontWeight: 600 }}>
              ✓ {run.resultSummary}
            </div>
          )}
        </div>
      ))}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   Hologram Cage — the projector base + light cone the mascot sits in
   ══════════════════════════════════════════════════════════════ */
const HologramCage: React.FC<{ portal: 'customer' | 'admin'; mode: MascotMode; children: React.ReactNode }> = ({ portal, mode, children }) => {
  const h = HOLO[portal];
  const isDocked = mode === 'docked';

  return (
    <div style={{ position: 'relative', width: '115px', height: '150px' }}>
      {/* Light cone (visible when docked) */}
      <div style={{
        position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
        width: '90px', height: '120px',
        background: `linear-gradient(to top, ${h.glow} 0%, transparent 85%)`,
        clipPath: 'polygon(15% 100%, 85% 100%, 100% 0%, 0% 0%)',
        opacity: isDocked ? 1 : 0,
        transition: 'opacity .5s ease',
        animation: 'holo-cone-pulse 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Scanlines overlay */}
      <div className="holo-glitch-layer" style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${h.scanline} 3px, ${h.scanline} 4px)`,
        backgroundSize: '100% 200%',
        animation: isDocked ? 'holo-scanline 4s linear infinite, holo-glitch 8s step-end infinite' : 'none',
        opacity: isDocked ? 0.7 : 0,
        transition: 'opacity .4s',
        pointerEvents: 'none',
        borderRadius: '12px',
        zIndex: 2,
      }} />

      {/* Mascot container — slides up when active */}
      <div style={{
        position: 'relative',
        width: '100%', height: '100%',
        animation: isDocked ? 'mascot-dock .5s ease forwards' : 'mascot-undock .5s ease forwards',
        zIndex: 3,
      }}>
        {children}
      </div>

      {/* Projector base pad */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '85px', height: '12px',
        background: `linear-gradient(90deg, ${h.primary}, ${h.secondary}, ${h.primary})`,
        borderRadius: '50%',
        boxShadow: `0 0 20px ${h.glow}, 0 0 40px ${h.glow}`,
        animation: 'holo-ring 3s ease-in-out infinite',
        zIndex: 4,
      }} />

      {/* Inner ring pulse */}
      <div style={{
        position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)',
        width: '55px', height: '8px',
        background: h.secondary,
        borderRadius: '50%',
        opacity: 0.6,
        animation: 'holo-pulse 2s ease-in-out infinite',
        zIndex: 4,
      }} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   Proactive Speech Bubble — comic-style bubble by the mascot
   ══════════════════════════════════════════════════════════════ */
const SpeechBubble: React.FC<{
  portal: 'customer' | 'admin';
  text: string;
  displayText: string;
  actions?: { label: string; onClick: () => void; primary?: boolean }[] | null;
  doneTyping: boolean;
  onDismiss: () => void;
}> = ({ portal, text, displayText, actions, doneTyping, onDismiss }) => {
  const isCustomer = portal === 'customer';
  const accent = isCustomer ? '#A855F7' : '#22D3EE';
  const bg = isCustomer
    ? 'linear-gradient(135deg, rgba(88,28,135,.92), rgba(49,10,90,.88))'
    : 'linear-gradient(135deg, rgba(10,16,30,.94), rgba(19,41,74,.90))';

  return (
    <div style={{
      position: 'absolute', bottom: '155px', left: '5px',
      maxWidth: '250px', minWidth: '180px',
      background: bg,
      border: `1.5px solid ${accent}55`,
      borderRadius: '16px', borderBottomLeftRadius: '6px',
      padding: '12px 16px',
      boxShadow: `0 8px 32px rgba(0,0,0,.25), 0 0 20px ${accent}15`,
      backdropFilter: 'blur(12px)',
      animation: 'bubble-in .35s cubic-bezier(.16,1,.3,1) forwards',
      pointerEvents: 'auto',
      zIndex: 15,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontWeight: 800, fontSize: '.75rem', color: accent, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          {isCustomer ? 'Your Guide' : 'AI Intern'}
        </span>
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '2px' }}>
          <X size={13} />
        </button>
      </div>

      {/* Message text — bold, high-contrast */}
      <div style={{
        fontSize: '.88rem', fontWeight: 600, lineHeight: 1.55,
        color: '#F1F5F9', minHeight: '28px',
      }}>
        {displayText}
        {!doneTyping && <span style={{ opacity: 0.6 }}>▌</span>}
      </div>

      {/* Action buttons */}
      {actions && actions.length > 0 && doneTyping && (
        <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {actions.map((a, i) => (
            <button key={i} onClick={a.onClick} style={{
              padding: '5px 12px', borderRadius: '8px', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all .15s',
              ...(a.primary ? {
                background: accent, color: '#0A0F1C', border: 'none',
              } : {
                background: 'transparent', color: accent, border: `1.5px solid ${accent}55`,
              }),
            }}>
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* Tail pointing down-left to the mascot */}
      <div style={{
        position: 'absolute', bottom: '-8px', left: '12px',
        width: '16px', height: '16px',
        background: isCustomer ? 'rgba(88,28,135,.92)' : 'rgba(10,16,30,.94)',
        borderLeft: `1.5px solid ${accent}55`,
        borderBottom: `1.5px solid ${accent}55`,
        transform: 'rotate(-45deg)',
      }} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   FloatingMascot — the main export
   ══════════════════════════════════════════════════════════════ */
export const FloatingMascot: React.FC = () => {
  const {
    portal,
    proactiveMessage, proactiveAction,
    setProactiveMessage, setProactiveAction,
    mascotAnimation, mascotAnimationKey, isThinking,
    assistantEnabled,
    mascotMode, setMascotMode,
    agentRuns, removeAgentRun,
  } = useAssistant();

  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Effective animation cue
  const effectiveAnimation = isThinking ? 'think'
    : isTyping ? 'talk'
    : (agentRuns.some(r => r.status === 'running') ? 'work' : mascotAnimation);

  // Auto dock/undock based on activity
  useEffect(() => {
    if (proactiveMessage || isThinking || agentRuns.some(r => r.status === 'running')) {
      setMascotMode('active');
    } else {
      const t = setTimeout(() => setMascotMode('docked'), 2500);
      return () => clearTimeout(t);
    }
  }, [proactiveMessage, isThinking, agentRuns, setMascotMode]);

  // Typewriter for proactive messages
  useEffect(() => {
    if (!proactiveMessage) { setDisplayText(''); return; }
    setIsTyping(true);
    setDisplayText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < proactiveMessage.length) {
        setDisplayText(proactiveMessage.substring(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 35);
    return () => clearInterval(timer);
  }, [proactiveMessage]);

  // Memoize admin runs with 'running' status for Work Console
  const activeRuns = useMemo(() => agentRuns.filter(r => r.status !== 'idle'), [agentRuns]);

  const handleDismissBubble = () => {
    setProactiveMessage(null);
    setProactiveAction(null);
  };

  // If mascot disabled, render nothing (chat icon still shown by GlobalAssistant)
  if (!assistantEnabled) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '20px', left: '20px',
      zIndex: 9997,
      pointerEvents: 'none',
    }}>
      {/* Proactive speech bubble */}
      {proactiveMessage && (
        <SpeechBubble
          portal={portal}
          text={proactiveMessage}
          displayText={displayText}
          actions={proactiveAction}
          doneTyping={displayText === proactiveMessage}
          onDismiss={handleDismissBubble}
        />
      )}

      {/* Hologram cage + mascot */}
      <HologramCage portal={portal} mode={mascotMode}>
        {portal === 'customer'
          ? <CustomerMascotSVG animation={effectiveAnimation} animationKey={mascotAnimationKey} />
          : <AdminMascotSVG animation={effectiveAnimation} animationKey={mascotAnimationKey} />}
      </HologramCage>

      {/* Work Console — shown beside the mascot for admin tasks */}
      {portal === 'admin' && <WorkConsole runs={activeRuns} onDismiss={removeAgentRun} />}

      <style>{HOLO_CSS}</style>
    </div>
  );
};
