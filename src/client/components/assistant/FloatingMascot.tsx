import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAssistant, type AssistantGuideTarget, type MascotMode, type MascotAnimation, type AgentRun } from '../../store/AssistantContext';
import { CustomerMascotSVG, AdminMascotSVG } from './MascotSVGs';
import { CheckCircle, Circle, Loader, AlertTriangle, X } from 'lucide-react';

/* ── Hologram theme colors per mascot/portal ── */
const HOLO_THEMES = {
  customer: {
    primary: '#D946EF',    // Electric Magenta
    secondary: '#A855F7',  // Neon Violet / Purple
    tertiary: '#EC4899',   // Hot Pink
    beamTop: 'rgba(217, 70, 239, 0.02)',
    beamMid: 'rgba(217, 70, 239, 0.22)',
    beamCore: 'rgba(236, 72, 153, 0.45)',
    glow: 'rgba(217, 70, 239, 0.4)',
    ringGlow: '0 0 25px rgba(217, 70, 239, 0.7), 0 0 50px rgba(168, 85, 247, 0.4)',
    scanline: 'rgba(217, 70, 239, 0.12)',
  },
  admin: {
    primary: '#7DD3FC',
    secondary: '#38BDF8',
    tertiary: '#BAE6FD',
    beamTop: 'rgba(125, 211, 252, 0.015)',
    beamMid: 'rgba(125, 211, 252, 0.10)',
    beamCore: 'rgba(56, 189, 248, 0.20)',
    glow: 'rgba(56, 189, 248, 0.20)',
    ringGlow: '0 0 14px rgba(125, 211, 252, 0.35), 0 0 28px rgba(56, 189, 248, 0.18)',
    scanline: 'rgba(125, 211, 252, 0.07)',
  },
} as const;

/* ── Hologram Animations CSS ── */
const HOLO_CSS = `
@keyframes holo-ring-dash {
  to { stroke-dashoffset: -38; }
}
@keyframes holo-emitter-link {
  0%, 100% { opacity: .35; transform: translateX(-50%) scaleY(.82); }
  50% { opacity: .9; transform: translateX(-50%) scaleY(1); }
}
@keyframes boot-thruster {
  0%, 100% { opacity: .45; transform: scaleY(.7); }
  50% { opacity: 1; transform: scaleY(1.1); }
}
@keyframes holo-beam-pulse {
  0%, 100% { opacity: 0.52; transform: scaleX(1); }
  50% { opacity: 0.72; transform: scaleX(1.04); }
}
@keyframes holo-ray-flicker {
  0%, 100% { opacity: 0.6; }
  25% { opacity: 0.85; }
  50% { opacity: 0.5; }
  75% { opacity: 0.95; }
}
@keyframes holo-particle-rise {
  0% { transform: translateY(0px) scale(0.6); opacity: 0; }
  30% { opacity: 0.9; }
  80% { opacity: 0.7; }
  100% { transform: translateY(-130px) scale(1.3); opacity: 0; }
}
@keyframes holo-glitch {
  0%,91%,100%{transform:translate(0,0) skewX(0);filter:none}
  92%{transform:translate(-2px,0) skewX(-1deg);filter:drop-shadow(2px 0 rgba(0,245,212,.8)) drop-shadow(-2px 0 rgba(217,70,239,.65))}
  94%{transform:translate(2px,1px) skewX(1deg);filter:drop-shadow(-2px 0 rgba(0,245,212,.8)) drop-shadow(2px 0 rgba(217,70,239,.65))}
  96%{transform:translate(-1px,-1px);filter:drop-shadow(1px 0 rgba(0,245,212,.75)) drop-shadow(-1px 0 rgba(217,70,239,.6))}
}
@keyframes holo-scanline-glitch {
  0%,91%,100%{opacity:0;transform:translateX(0)}
  92%{opacity:.8;transform:translateX(-3px);clip-path:inset(18% 0 68% 0)}
  94%{opacity:.65;transform:translateX(3px);clip-path:inset(54% 0 29% 0)}
  96%{opacity:.75;transform:translateX(-1px);clip-path:inset(78% 0 12% 0)}
}
@keyframes mascot-undock {
  0%{transform:translateY(0) scale(1);opacity:.72;filter:brightness(1.15)}
  100%{transform:translateY(-18px) scale(1);opacity:1;filter:brightness(1)}
}
@keyframes mascot-dock {
  0%{transform:translateY(-18px) scale(1);opacity:1;filter:brightness(1)}
  100%{transform:translateY(0) scale(1);opacity:.72;filter:brightness(1.15)}
}
@keyframes mascot-fly-return {
  0% { transform: translate3d(var(--flight-x), var(--flight-y), 0) rotate(var(--flight-angle)); }
  48% { transform: translate3d(calc(var(--flight-x) * .55), calc(var(--flight-y) * .55), 0) rotate(calc(var(--flight-angle) + 180deg)); }
  100% { transform: translate3d(0, 0, 0) rotate(360deg); }
}
@keyframes mascot-flight-body {
  0%,100% { transform: rotate(0) translateY(0); }
  35% { transform: rotate(-8deg) translateY(-7px); }
  70% { transform: rotate(7deg) translateY(-4px); }
}
@keyframes bubble-in-right {
  0%{opacity:0;transform:translateY(14px) scale(.9)}
  100%{opacity:1;transform:translateY(0) scale(1)}
}
@keyframes console-in-left {
  0%{opacity:0;transform:translateX(20px)}
  100%{opacity:1;transform:translateX(0)}
}
@keyframes work-pulse {
  0%,100%{box-shadow:0 0 0 0 rgba(0,245,212,.4)}
  50%{box-shadow:0 0 16px 4px rgba(0,245,212,.25)}
}
.holo-glitch-layer::before,
.holo-glitch-layer::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: inherit;
  pointer-events: none;
  mix-blend-mode: screen;
}
.holo-glitch-layer::before {
  filter: hue-rotate(110deg);
  animation: holo-scanline-glitch 5.2s steps(1,end) infinite;
}
.holo-glitch-layer::after {
  filter: hue-rotate(250deg);
  animation: holo-scanline-glitch 5.2s steps(1,end) infinite .04s;
}
.b360-boot-thruster {
  transform-box: fill-box;
  transform-origin: center top;
  animation: boot-thruster .32s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 5px currentColor);
}
.b360-boot-thruster-right { animation-delay: .14s; }
.b360-mascot-flight .rig-root { animation: mascot-flight-body .9s ease-in-out infinite; }
.b360-mascot-flight .rig-arm-l,
.b360-mascot-flight .rig-arm-r { animation: rig-wave .65s ease-in-out infinite alternate; }
.b360-mascot-flight .rig-leg-l { animation: rig-kick-l .5s ease-in-out infinite alternate; }
.b360-mascot-flight .rig-leg-r { animation: rig-kick-r .5s ease-in-out infinite alternate; }
.b360-mascot-flight[data-flight="out"] { transition: transform 1.15s cubic-bezier(.2,.8,.2,1); }
.b360-mascot-flight[data-flight="return"] { animation: mascot-fly-return 1.35s cubic-bezier(.4,0,.2,1) forwards; }
@media (prefers-reduced-motion: reduce) {
  .b360-assistant-motion,
  .b360-assistant-motion *,
  .b360-assistant-motion *::before,
  .b360-assistant-motion *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
@media (max-height: 520px) {
  .b360-speech-bubble {
    bottom: 24px !important;
    right: calc(100% + 8px) !important;
    max-height: calc(100vh - 110px);
    overflow-y: auto;
  }
}
`;

/* ══════════════════════════════════════════════════════════════
   Work Console — holographic timeline beside the mascot (on the left)
   ══════════════════════════════════════════════════════════════ */
const WorkConsole: React.FC<{ runs: AgentRun[]; onDismiss: (id: string) => void }> = ({ runs, onDismiss }) => {
  if (runs.length === 0) return null;
  const isRunning = runs.some(run => run.status === 'running');
  const hasErrors = runs.some(run => run.status === 'error');
  const HeadingIcon = isRunning ? Loader : hasErrors ? AlertTriangle : CheckCircle;
  const heading = isRunning ? 'Work Console' : hasErrors ? 'Needs attention' : 'Task updates';
  return (
    <div style={{
      position: 'absolute', right: '145px', bottom: '10px', width: '250px',
      maxHeight: '320px', overflowY: 'auto',
      background: 'linear-gradient(135deg, rgba(8,15,30,.94) 0%, rgba(15,30,55,.90) 100%)',
      border: '1px solid rgba(0,245,212,.35)',
      borderRadius: '16px', padding: '12px 14px',
      boxShadow: '0 0 30px rgba(0,245,212,.15), inset 0 0 30px rgba(0,245,212,.05)',
      animation: 'console-in-left .4s ease-out forwards, work-pulse 3s ease-in-out infinite',
      backdropFilter: 'blur(14px)',
      pointerEvents: 'auto',
      zIndex: 10,
    }}>
      <div style={{ fontSize: '.68rem', fontWeight: 800, color: hasErrors ? '#FCA5A5' : '#00F5D4', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <HeadingIcon size={12} style={isRunning ? { animation: 'spin 1.5s linear infinite' } : undefined} /> {heading}
      </div>
      {runs.map(run => (
        <div key={run.id} style={{ marginBottom: '10px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
            <span style={{ fontSize: '.78rem', fontWeight: 700, color: '#E0F2FE', lineHeight: 1.3 }}>{run.title}</span>
            <button onClick={() => onDismiss(run.id)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '2px', flexShrink: 0 }}>
              <X size={12} />
            </button>
          </div>
          <div style={{ paddingLeft: '6px', borderLeft: '2px solid rgba(0,245,212,.25)' }}>
            {run.stages.map((stage, i) => {
              const icon = stage.status === 'done' ? <CheckCircle size={12} color="#22C55E" />
                : stage.status === 'active' ? <Loader size={12} color="#00F5D4" style={{ animation: 'spin 1.2s linear infinite' }} />
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
          {run.needsInput && (
            <div style={{ marginTop: '6px', padding: '6px 8px', borderRadius: '8px', background: 'rgba(251,191,36,.12)', border: '1px solid rgba(251,191,36,.3)', fontSize: '.72rem', color: '#FCD34D', fontWeight: 600 }}>
              ⚠ {run.needsInput.prompt}
            </div>
          )}
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
   Hologram Cage — Concentric floor rings HUD & Volumetric Rays
   ══════════════════════════════════════════════════════════════ */
const HologramCage: React.FC<{
  portal: 'customer' | 'admin';
  mode: MascotMode;
  position: { right: number; bottom: number };
  guideTarget: AssistantGuideTarget | null;
  onReturnEnd: () => void;
  children: React.ReactNode;
}> = ({ portal, mode, position, guideTarget, onReturnEnd, children }) => {
  const h = HOLO_THEMES[portal];
  const isDocked = mode === 'docked';
  const lastFlightRef = useRef({ x: '0px', y: '0px', angle: '0deg' });
  const flight = guideTarget
    ? {
        x: `${guideTarget.x + guideTarget.width / 2 - (window.innerWidth - position.right - 80)}px`,
        y: `${guideTarget.y + guideTarget.height / 2 - (window.innerHeight - position.bottom - 94 - 119)}px`,
        angle: guideTarget.x + guideTarget.width / 2 < window.innerWidth - position.right - 80 ? '-12deg' : '12deg',
      }
    : lastFlightRef.current;

  useEffect(() => {
    if (guideTarget) lastFlightRef.current = flight;
  }, [guideTarget, flight]);

  return (
    <div className="b360-hologram-cage" style={{ position: 'relative', width: '160px', height: '200px', flexShrink: 0 }}>
      <div className="b360-speech-bubble" style={{
        position: 'absolute', bottom: '25px', left: '3px',
        width: '154px', height: '126px',
        background: `linear-gradient(to top, ${h.beamCore} 0%, ${h.beamMid} 42%, ${h.beamTop} 100%)`,
        clipPath: 'polygon(35% 100%, 65% 100%, 100% 0%, 0% 0%)',
        opacity: isDocked ? 1 : 0.45,
        filter: `drop-shadow(0 0 18px ${h.glow})`,
        transition: 'opacity .5s ease',
        animation: 'holo-beam-pulse 3.5s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 1,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `repeating-linear-gradient(0deg, transparent 0px, transparent 5px, ${h.primary}18 5px, ${h.primary}18 6px), repeating-linear-gradient(90deg, transparent 0px, transparent 7px, ${h.primary}16 7px, ${h.primary}16 8px)`,
          animation: 'holo-ray-flicker 2.5s ease-in-out infinite alternate',
        }} />
      </div>

      <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', width: '108px', height: '140px', pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '5px', left: '18px', width: '4px', height: '4px', borderRadius: '50%', background: h.primary, boxShadow: `0 0 8px ${h.primary}`, animation: 'holo-particle-rise 2.4s ease-in infinite' }} />
        <div style={{ position: 'absolute', bottom: '15px', left: '54px', width: '5px', height: '5px', borderRadius: '50%', background: h.tertiary, boxShadow: `0 0 10px ${h.tertiary}`, animation: 'holo-particle-rise 3.1s ease-in infinite 0.7s' }} />
        <div style={{ position: 'absolute', bottom: '2px', right: '14px', width: '4px', height: '4px', borderRadius: '50%', background: '#FFFFFF', boxShadow: `0 0 8px ${h.primary}`, animation: 'holo-particle-rise 2.8s ease-in infinite 1.4s' }} />
      </div>

      <div style={{
        position: 'absolute', left: '0', bottom: '49px',
        width: '160px', height: '140px',
        animation: mode === 'moving' ? undefined : isDocked ? 'mascot-dock .5s ease forwards' : 'mascot-undock .5s ease forwards',
        transform: guideTarget ? `translate3d(${flight.x}, ${flight.y}, 0) rotate(${flight.angle})` : undefined,
        transformOrigin: 'center center',
        '--flight-x': flight.x,
        '--flight-y': flight.y,
        '--flight-angle': flight.angle,
        zIndex: 4,
      } as React.CSSProperties & Record<string, string | number | undefined>}
        className={mode === 'moving' ? 'b360-mascot-flight' : undefined}
        data-flight={mode === 'moving' ? guideTarget ? 'out' : 'return' : 'docked'}
        onAnimationEnd={event => {
          if (event.animationName === 'mascot-fly-return') onReturnEnd();
        }}
      >
        <svg aria-hidden="true" viewBox="0 0 500 680" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 2 }}>
          <g className="b360-boot-thruster b360-boot-thruster-left">
            <path d="M184 592 Q207 608 230 592 L222 658 Q207 675 192 658 Z" fill={h.tertiary} opacity=".72" />
            <path d="M194 595 Q207 605 220 595 L216 651 Q207 662 198 651 Z" fill="#FFFFFF" opacity=".9" />
          </g>
          <g className="b360-boot-thruster b360-boot-thruster-right">
            <path d="M270 592 Q293 608 316 592 L308 658 Q293 675 278 658 Z" fill={h.tertiary} opacity=".72" />
            <path d="M280 595 Q293 605 306 595 L302 651 Q293 662 284 651 Z" fill="#FFFFFF" opacity=".9" />
          </g>
        </svg>
        {/* Scanlines overlay on mascot */}
        <div className="holo-glitch-layer" style={{
          position: 'absolute', top: 0, bottom: 0, left: '25px', width: '110px',
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${h.scanline} 3px, ${h.scanline} 4px)`,
          opacity: 0.6,
          pointerEvents: 'none',
          zIndex: 5,
        }} />
        <div className="holo-mascot-art" style={{
          position: 'absolute', top: 0, bottom: 0, left: '25px', width: '110px',
          animation: isDocked ? 'holo-glitch 5.2s steps(1,end) infinite' : 'none',
        }}>
          {children}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)',
        width: '160px', height: '48px',
        pointerEvents: 'none',
        zIndex: 3,
      }}>
        <div style={{ position: 'absolute', inset: '5px 0 0', borderRadius: '50%', background: `radial-gradient(ellipse, ${h.glow} 0%, transparent 72%)`, filter: 'blur(5px)' }} />
        <svg width="160" height="48" viewBox="0 0 160 48" role="presentation" style={{ position: 'relative', overflow: 'visible', filter: `drop-shadow(0 0 5px ${h.primary})` }}>
          <ellipse cx="80" cy="25" rx="77" ry="17" fill="none" stroke={h.primary} strokeWidth="1" opacity=".4" />
          <ellipse cx="80" cy="25" rx="68" ry="14" fill="none" stroke={h.tertiary} strokeWidth="1.2" strokeDasharray="3 4" opacity=".9" style={{ animation: 'holo-ring-dash 5s linear infinite' }} />
          <ellipse cx="80" cy="25" rx="54" ry="10" fill="none" stroke={h.primary} strokeWidth="1.5" strokeDasharray="14 5 2 5" opacity=".95" style={{ animation: 'holo-ring-dash 3.5s linear infinite reverse' }} />
          <ellipse cx="80" cy="25" rx="37" ry="6" fill={h.secondary} opacity=".2" />
          <ellipse cx="80" cy="25" rx="24" ry="3.5" fill="none" stroke={h.tertiary} strokeWidth="1.2" opacity=".9" />
          <ellipse cx="80" cy="25" rx="9" ry="2" fill="#FFFFFF" opacity=".9" />
          <path d="M7 25h16m114 0h16" stroke={h.primary} strokeWidth="1" opacity=".65" />
          <circle cx="24" cy="25" r="1.5" fill="#FFFFFF" />
          <circle cx="136" cy="25" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   Proactive Speech Bubble — comic-style bubble by the mascot (Top-Right)
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
  const accent = isCustomer ? '#D946EF' : '#00F5D4';
  const bg = isCustomer
    ? 'linear-gradient(135deg, rgba(74,14,98,.94), rgba(42,8,60,.90))'
    : 'linear-gradient(135deg, rgba(8,20,38,.95), rgba(12,35,55,.90))';

  return (
    <div className="b360-speech-bubble" style={{
      position: 'absolute', bottom: '165px', right: '5px',
      width: 'min(260px, calc(100vw - 24px))', minWidth: 'min(190px, calc(100vw - 24px))',
      background: bg,
      border: `1.5px solid ${accent}66`,
      borderRadius: '16px', borderBottomRightRadius: '6px',
      padding: '12px 16px',
      boxShadow: `0 10px 35px rgba(0,0,0,.35), 0 0 25px ${accent}25`,
      backdropFilter: 'blur(14px)',
      animation: 'bubble-in-right .35s cubic-bezier(.16,1,.3,1) forwards',
      pointerEvents: 'none',
      zIndex: 15,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontWeight: 800, fontSize: '.75rem', color: accent, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          {isCustomer ? 'Your Guide' : 'AI Intern'}
        </span>
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '2px', pointerEvents: 'auto' }}>
          <X size={13} />
        </button>
      </div>

      {/* Message text */}
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
              pointerEvents: 'auto',
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

      {/* Tail pointing down-right towards the mascot */}
      <div style={{
        position: 'absolute', bottom: '-8px', right: '20px',
        width: '16px', height: '16px',
        background: isCustomer ? 'rgba(74,14,98,.94)' : 'rgba(8,20,38,.95)',
        borderRight: `1.5px solid ${accent}66`,
        borderBottom: `1.5px solid ${accent}66`,
        transform: 'rotate(45deg)',
      }} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   FloatingMascot — the main export (Bottom-Right position)
   ══════════════════════════════════════════════════════════════ */
export const FloatingMascot: React.FC<{ position: { right: number; bottom: number } }> = ({ position }) => {
  const {
    portal,
    proactiveMessage, proactiveAction,
    setProactiveMessage, setProactiveAction,
    mascotAnimation, mascotAnimationKey, isThinking,
    assistantEnabled,
    mascotMode, setMascotMode,
    agentRuns, removeAgentRun,
    guideTarget, setGuideTarget,
  } = useAssistant();

  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [idleAnimation, setIdleAnimation] = useState<MascotAnimation>('idle');
  const dockScale = mascotMode === 'docked' ? 0.82 : 1.06;

  // Effective animation cue
  const effectiveAnimation = isThinking ? 'think'
    : isTyping ? 'talk'
    : (agentRuns.some(r => r.status === 'running') ? 'work' : mascotAnimation);
  const displayedAnimation = mascotMode === 'docked' && effectiveAnimation === 'idle'
    ? idleAnimation
    : effectiveAnimation;

  useEffect(() => {
    if (
      !assistantEnabled || mascotMode !== 'docked' || proactiveMessage ||
      isThinking || agentRuns.some(run => run.status === 'running')
    ) {
      setIdleAnimation('idle');
      return undefined;
    }

    const idleGestures: MascotAnimation[] = [
      'idle-wave', 'idle-listen', 'idle-stretch', 'idle-sway', 'idle-twirl',
      'idle-bounce', 'idle-kick', 'idle-look', 'idle-salute', 'idle-dance',
      'idle-skate', 'idle-cape', 'idle-spin', 'idle-shrug', 'idle-peek',
    ];
    let gestureTimer: ReturnType<typeof setTimeout>;
    let resetTimer: ReturnType<typeof setTimeout>;
    const playRandomGesture = () => {
      const gesture = idleGestures[Math.floor(Math.random() * idleGestures.length)];
      setIdleAnimation(gesture);
      resetTimer = setTimeout(() => {
        setIdleAnimation('idle');
        gestureTimer = setTimeout(playRandomGesture, 16_000 + Math.random() * 8_000);
      }, 2_800);
    };
    gestureTimer = setTimeout(playRandomGesture, 14_000 + Math.random() * 6_000);

    return () => {
      clearTimeout(gestureTimer);
      clearTimeout(resetTimer);
    };
  }, [assistantEnabled, mascotMode, proactiveMessage, isThinking, agentRuns]);

  // Auto dock/undock based on activity
  useEffect(() => {
    if (mascotMode === 'moving') return undefined;
    if (proactiveMessage || isThinking || agentRuns.some(r => r.status === 'running')) {
      setMascotMode('active');
      return undefined;
    } else {
      const t = setTimeout(() => setMascotMode('docked'), 2500);
      return () => clearTimeout(t);
    }
  }, [mascotMode, proactiveMessage, isThinking, agentRuns, setMascotMode]);

  // Typewriter for proactive messages
  useEffect(() => {
    if (!proactiveMessage) { setDisplayText(''); return undefined; }
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

  const activeRuns = useMemo(() => agentRuns.filter(r => r.status !== 'idle'), [agentRuns]);

  const handleDismissBubble = () => {
    setProactiveMessage(null);
    setProactiveAction(null);
  };

  if (!assistantEnabled) return null;

  return (
    <>
    {guideTarget && (
      <div aria-hidden="true" style={{
        position: 'fixed', left: `${guideTarget.x}px`, top: `${guideTarget.y}px`,
        width: `${guideTarget.width}px`, height: `${guideTarget.height}px`,
        border: `2px solid ${portal === 'customer' ? '#A855F7' : '#38BDF8'}`,
        borderRadius: '8px',
        boxShadow: `0 0 0 4px ${portal === 'customer' ? '#A855F733' : '#38BDF833'}, 0 0 24px ${portal === 'customer' ? '#A855F799' : '#38BDF899'}`,
        pointerEvents: 'none', zIndex: 9996,
      }}>
        <span style={{
          position: 'absolute', left: 0, bottom: 'calc(100% + 5px)',
          maxWidth: '240px', padding: '5px 9px', borderRadius: '7px',
          background: '#0F172A', color: '#F8FAFC', fontSize: '12px', fontWeight: 700,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{guideTarget.label}</span>
      </div>
    )}
    <div className="b360-assistant-motion" style={{
      position: 'fixed', bottom: `${position.bottom + 94}px`, right: `${position.right}px`,
      transform: `scale(${dockScale})`,
      transformOrigin: 'bottom center',
      transition: 'transform .5s cubic-bezier(.2,.8,.2,1)',
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
      <HologramCage
        portal={portal}
        mode={mascotMode}
        position={position}
        guideTarget={guideTarget}
        onReturnEnd={() => { setMascotMode('docked'); setGuideTarget(null); }}
      >
        {portal === 'customer'
          ? <CustomerMascotSVG animation={displayedAnimation} animationKey={mascotAnimationKey} />
          : <AdminMascotSVG animation={displayedAnimation} animationKey={mascotAnimationKey} />}
      </HologramCage>

      {/* Work Console — shown to the left of the mascot for admin tasks */}
      {portal === 'admin' && <WorkConsole runs={activeRuns} onDismiss={removeAgentRun} />}

      <style>{HOLO_CSS}</style>
    </div>
    </>
  );
};
