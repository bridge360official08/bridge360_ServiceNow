import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAssistant, type AssistantGuideTarget, type MascotMode, type MascotAnimation, type AgentRun } from '../../store/AssistantContext';
import { CustomerMascotSVG, AdminMascotSVG } from './MascotSVGs';
import {
  AlertTriangle,
  CheckCircle,
  Circle,
  ClipboardCheck,
  Compass,
  FileSearch,
  HeartHandshake,
  Lightbulb,
  Loader,
  ShieldCheck,
  X,
} from 'lucide-react';

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
@keyframes b360-agent-orbit {
  from { transform: rotate(var(--agent-angle)) translateX(48px); }
  to { transform: rotate(calc(var(--agent-angle) + 360deg)) translateX(48px); }
}
@keyframes b360-agent-upright {
  from { transform: rotate(var(--agent-counter-angle)); }
  to { transform: rotate(calc(var(--agent-counter-angle) - 360deg)); }
}
@keyframes b360-agent-glow {
  0%,100% { filter: drop-shadow(0 0 5px var(--agent-color)); }
  50% { filter: drop-shadow(0 0 11px var(--agent-color)); }
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
    bottom: 0 !important;
    right: 0 !important;
    max-height: calc(100vh - 130px);
  }
}
@media (max-width: 700px) {
  .b360-speech-bubble {
    bottom: 0 !important;
    right: 0 !important;
  }
}
`;

/* ══════════════════════════════════════════════════════════════
   Work Console — holographic timeline beside the mascot (on the left)
   ══════════════════════════════════════════════════════════════ */
type AdvisoryStageId = 'triage' | 'docs' | 'completeness' | 'support' | 'risk' | 'decision';

interface AdvisoryRole {
  stageId: AdvisoryStageId;
  name: string;
  role: string;
  color: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

const ADVISORY_ROLES: AdvisoryRole[] = [
  { stageId: 'triage', name: 'Scout', role: 'Case context', color: '#38BDF8', icon: Compass },
  { stageId: 'docs', name: 'Prism', role: 'Document matching', color: '#C084FC', icon: FileSearch },
  { stageId: 'completeness', name: 'Ledger', role: 'Completeness', color: '#FBBF24', icon: ClipboardCheck },
  { stageId: 'support', name: 'Beacon', role: 'Support planning', color: '#FB7185', icon: HeartHandshake },
  { stageId: 'risk', name: 'Aegis', role: 'Record integrity', color: '#34D399', icon: ShieldCheck },
  { stageId: 'decision', name: 'Quill', role: 'Decision draft', color: '#F97316', icon: Lightbulb },
];

const ADVISORY_GESTURES: MascotAnimation[] = [
  'idle-wave', 'idle-listen', 'idle-stretch', 'idle-sway', 'idle-twirl',
  'idle-bounce', 'idle-kick', 'idle-look', 'idle-salute', 'idle-dance',
  'idle-skate', 'idle-cape', 'idle-spin', 'idle-shrug', 'idle-peek',
  'idle-cheer', 'idle-moonwalk', 'idle-juggle', 'idle-spinbow', 'idle-heart',
];

const MINI_MASCOT_CSS = `
@keyframes b360-mini-thrust {
  0%,100% { opacity: .45; transform: scaleY(.65); }
  50% { opacity: 1; transform: scaleY(1.15); }
}
@keyframes b360-mini-arm-wave {
  0%,100% { transform: rotate(0deg); }
  50% { transform: rotate(-38deg); }
}
@keyframes b360-mini-leg-step {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
.b360-mini-thruster { transform-box: fill-box; transform-origin: center top; animation: b360-mini-thrust .42s ease-in-out infinite; }
[data-agent-gesture="idle-wave"] .b360-mini-arm-right,
[data-agent-gesture="idle-salute"] .b360-mini-arm-right { transform-box: fill-box; transform-origin: left center; animation: b360-mini-arm-wave .55s ease-in-out infinite alternate; }
[data-agent-gesture="idle-cheer"] .b360-mini-arm-left,
[data-agent-gesture="idle-cheer"] .b360-mini-arm-right,
[data-agent-gesture="idle-dance"] .b360-mini-arm-left,
[data-agent-gesture="idle-dance"] .b360-mini-arm-right { transform-box: fill-box; transform-origin: center; animation: b360-mini-arm-wave .5s ease-in-out infinite alternate; }
[data-agent-gesture="idle-kick"] .b360-mini-right-leg,
[data-agent-gesture="idle-skate"] .b360-mini-right-leg,
[data-agent-gesture="idle-moonwalk"] .b360-mini-left-leg { transform-box: fill-box; transform-origin: center top; animation: b360-mini-leg-step .45s ease-in-out infinite alternate; }
${ADVISORY_GESTURES.map((gesture, index) =>
  `[data-agent-gesture="${gesture}"]{animation:b360-mini-motion-${index} .9s ease-in-out infinite}` +
  `@keyframes b360-mini-motion-${index}{0%,100%{transform:${index % 2 ? 'translateY(0) rotate(-5deg)' : 'scale(1)'}}50%{transform:${index % 2 ? `translateY(-${3 + index % 5}px) rotate(7deg)` : `rotate(${(index + 1) * 18}deg) scale(1.12)`}}}`,
).join('\n')}
`;

const MiniAdvisoryMascot: React.FC<{
  color: string;
  icon: React.ReactNode;
  role: AdvisoryStageId;
}> = ({ color, icon, role }) => {
  const [gesture, setGesture] = useState<MascotAnimation>(() =>
    ADVISORY_GESTURES[Math.floor(Math.random() * ADVISORY_GESTURES.length)],
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const chooseNextGesture = () => {
      setGesture(ADVISORY_GESTURES[Math.floor(Math.random() * ADVISORY_GESTURES.length)]);
      timer = setTimeout(chooseNextGesture, 1300 + Math.random() * 1100);
    };
    timer = setTimeout(chooseNextGesture, 1300 + Math.random() * 1100);
    return () => clearTimeout(timer);
  }, []);

  const headgear = {
    triage: <><path d="M9 12Q11 5 18 5Q25 5 27 12H9Z" fill={color} /><path d="M7 12H29L26 15H10Z" fill="#E0F2FE" /></>,
    docs: <><path d="M10 11Q13 5 18 5Q23 5 26 11V14H10Z" fill={color} /><path d="M10 12H26V15H10Z" fill="#F5F3FF" opacity=".9" /></>,
    completeness: <><path d="M10 11Q11 5 18 5Q25 5 26 11V13H10Z" fill={color} /><path d="M14 8H22" stroke="#FEF3C7" strokeWidth="1.5" /></>,
    support: <><path d="M10 13V11A8 8 0 0 1 26 11V13" fill="none" stroke={color} strokeWidth="3" /><circle cx="10" cy="14" r="2.5" fill="#FFE4E6" /><circle cx="26" cy="14" r="2.5" fill="#FFE4E6" /></>,
    risk: <><path d="M18 4L26 8V13Q25 18 18 20Q11 18 10 13V8Z" fill={color} /><path d="M18 7L23 9.5V13Q22 16 18 17.5Q14 16 13 13V9.5Z" fill="#D1FAE5" /></>,
    decision: <><path d="M19 12Q25 4 28 5Q28 12 20 15" fill={color} /><path d="M19 13Q22 7 27 6" fill="none" stroke="#FFEDD5" strokeWidth="1" /></>,
  }[role];

  return (
    <div data-agent-gesture={gesture} style={{
      width: '34px',
      height: '48px',
      position: 'relative',
      filter: `drop-shadow(0 0 4px ${color}99)`,
    }}>
      <svg aria-hidden="true" viewBox="0 0 36 52" width="34" height="48" style={{ overflow: 'visible' }}>
        <ellipse cx="18" cy="48" rx="9" ry="2" fill={color} opacity=".45" />
        <path d="M13 42L12 47M23 42L24 47" stroke={color} strokeWidth="2" strokeLinecap="round" className="b360-mini-thruster" />
        <path className="b360-mini-left-leg" d="M13 35L12 43H16L18 36" fill="#172554" stroke="#BFDBFE" strokeWidth="1" strokeLinejoin="round" />
        <path className="b360-mini-right-leg" d="M23 35L24 43H20L18 36" fill="#172554" stroke="#BFDBFE" strokeWidth="1" strokeLinejoin="round" />
        <path d="M12 22Q18 19 24 22L27 36Q18 39 9 36Z" fill={color} stroke="#E0F2FE" strokeWidth="1" />
        <g className="b360-mini-arm-left">
          <path d="M12 24L6 30L9 32L14 28" fill="none" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="30" r="2" fill="#FDE68A" />
        </g>
        <g className="b360-mini-arm-right">
          <path d="M24 24L30 29L27 32L22 28" fill="none" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="30" cy="29" r="2" fill="#FDE68A" />
        </g>
        <circle cx="18" cy="14" r="7" fill="#FDE2C5" stroke="#FFF7ED" strokeWidth=".8" />
        {headgear}
        <circle cx="15.5" cy="14" r=".8" fill="#172554" />
        <circle cx="20.5" cy="14" r=".8" fill="#172554" />
        <path d="M16 17Q18 18.5 20 17" fill="none" stroke="#9A5B45" strokeWidth=".8" strokeLinecap="round" />
        <path d="M16 25L18 31L20 25" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity=".75" />
      </svg>
      <span style={{
        position: 'absolute',
        left: '12px',
        top: '25px',
        color: '#FFFFFF',
        lineHeight: 0,
        filter: 'drop-shadow(0 0 2px #0F172A)',
      }}>{icon}</span>
    </div>
  );
};

const AdvisorySwarm: React.FC<{ stages: AgentRun['stages'] }> = ({ stages }) => {
  const workingStages = new Set(stages.filter(stage => stage.status === 'active' || stage.status === 'done').map(stage => stage.id));
  const availableRoles = ADVISORY_ROLES.filter(role => stages.some(stage => stage.id === role.stageId));
  if (!availableRoles.length) return null;

  return (
    <div aria-label="Advisory agents collaborating around the mascot" style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 6,
    }}>
      {availableRoles.map((role, index) => {
        const Icon = role.icon;
        const isWorking = stages.some(stage => stage.id === role.stageId && stage.status === 'active');
        const isComplete = workingStages.has(role.stageId) && !isWorking;
        return (
          <div
            key={role.stageId}
            title={`${role.name} · ${role.role}${isWorking ? ' · working' : ' · waiting'}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '42px',
              height: '54px',
              marginLeft: '-21px',
              marginTop: '-27px',
              display: 'grid',
              placeItems: 'center',
              opacity: isWorking ? 1 : isComplete ? .82 : .56,
              animation: `b360-agent-orbit ${isWorking ? '8s' : '14s'} linear infinite${isWorking ? `, b360-agent-glow 1s ease-in-out infinite` : ''}`,
              animationDelay: `${-index * 1.2}s`,
              ['--agent-color' as string]: `${role.color}99`,
              ['--agent-angle' as string]: `${index * 60}deg`,
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              animation: `b360-agent-upright ${isWorking ? '8s' : '14s'} linear infinite`,
              animationDelay: `${-index * 1.2}s`,
              ['--agent-counter-angle' as string]: `${-index * 60}deg`,
            }}>
              <MiniAdvisoryMascot
                color={role.color}
                icon={<Icon size={9} strokeWidth={2.5} />}
                role={role.stageId}
              />
              <span style={{
              position: 'absolute',
              top: '46px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#FFFFFF',
              fontSize: '8px',
              fontWeight: 800,
              textShadow: '0 1px 4px #020617',
              whiteSpace: 'nowrap',
              }}>{role.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

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
      <style>{`${MINI_MASCOT_CSS}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
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
  companions: AgentRun['stages'];
}> = ({ portal, mode, position, guideTarget, onReturnEnd, children, companions }) => {
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
      <div style={{
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

      {portal === 'admin' && mode === 'active' && <AdvisorySwarm stages={companions} />}

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
  displayText: string;
  actions?: { label: string; onClick: () => void; primary?: boolean }[] | null;
  doneTyping: boolean;
  onDismiss: () => void;
  mascot: React.ReactNode;
}> = ({ portal, displayText, actions, doneTyping, onDismiss, mascot }) => {
  const isCustomer = portal === 'customer';
  const accent = isCustomer ? '#D946EF' : '#00DCC8';

  return (
    <div className="b360-speech-bubble" style={{
      position: 'absolute', bottom: '0', right: '0',
      width: 'min(220px, calc(100vw - 28px))', minWidth: 'min(180px, calc(100vw - 28px))',
      maxHeight: 'min(135px, calc(100vh - 32px))',
      overflow: 'visible',
      background: isCustomer
        ? 'linear-gradient(132deg, rgba(126, 34, 206, .78) 0%, rgba(190, 48, 128, .76) 52%, rgba(79, 70, 229, .78) 100%)'
        : 'linear-gradient(132deg, rgba(42, 155, 205, .78) 0%, rgba(55, 112, 205, .77) 52%, rgba(42, 158, 148, .78) 100%)',
      border: '1px solid rgba(255,255,255,.46)',
      borderRadius: '14px', borderBottomRightRadius: '6px',
      padding: '8px 9px',
      boxShadow: `0 6px 18px rgba(15,23,42,.17), 0 0 12px ${accent}22, inset 0 1px rgba(255,255,255,.22)`,
      backdropFilter: 'blur(18px) saturate(135%)',
      WebkitBackdropFilter: 'blur(18px) saturate(135%)',
      animation: 'bubble-in-right .35s cubic-bezier(.16,1,.3,1) forwards',
      pointerEvents: 'none',
      zIndex: 15,
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute',
        right: '8px',
        top: '-66px',
        width: '52px',
        height: '74px',
        pointerEvents: 'none',
        zIndex: 2,
        filter: `drop-shadow(0 3px 5px ${accent}88)`,
      }}>{mascot}</div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', paddingRight: '40px' }}>
        <span style={{ fontWeight: 800, fontSize: '.66rem', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '.07em', textShadow: '0 1px 4px rgba(15,23,42,.35)' }}>
          {isCustomer ? 'Your Guide' : 'AI Intern'}
        </span>
        <button onClick={onDismiss} aria-label="Dismiss assistant suggestion" style={{ background: 'rgba(255,255,255,.16)', border: '1px solid rgba(255,255,255,.2)', borderRadius: '50%', color: '#FFFFFF', cursor: 'pointer', padding: '5px', pointerEvents: 'auto', lineHeight: 0 }}>
          <X size={14} />
        </button>
      </div>

      {/* Message text */}
      <div style={{
        fontSize: '.74rem', fontWeight: 650, lineHeight: 1.32,
        color: '#FFFFFF', minHeight: '20px', textShadow: '0 1px 5px rgba(15,23,42,.38)',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden',
      }}>
        {displayText}
        {!doneTyping && <span style={{ opacity: 0.6 }}>▌</span>}
      </div>

      {/* Action buttons */}
      {actions && actions.length > 0 && doneTyping && (
        <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {actions.map((a, i) => (
            <button key={i} onClick={a.onClick} style={{
              padding: '3px 6px', borderRadius: '999px', fontSize: '.62rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all .15s',
              pointerEvents: 'auto',
              ...(a.primary ? {
                background: 'rgba(255,255,255,.9)', color: isCustomer ? '#5B21B6' : '#075985', border: '1px solid rgba(255,255,255,.72)',
              } : {
                background: 'rgba(15,23,42,.14)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,.48)',
              }),
            }}>
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* Tail pointing down-right towards the mascot */}
      <div style={{
        position: 'absolute', bottom: '-7px', right: '18px',
        width: '14px', height: '14px',
        background: isCustomer ? 'rgba(190,48,128,.78)' : 'rgba(55,112,205,.78)',
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

    const idleGestures = ADVISORY_GESTURES;
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
  const activeRun = activeRuns.find(run => run.status === 'running');

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
          displayText={displayText}
          actions={proactiveAction}
          doneTyping={displayText === proactiveMessage}
          onDismiss={handleDismissBubble}
          mascot={portal === 'customer'
            ? <CustomerMascotSVG animation={displayedAnimation} animationKey={mascotAnimationKey} />
            : <AdminMascotSVG animation={displayedAnimation} animationKey={mascotAnimationKey} />}
        />
      )}

      {/* Show the compact character on the bubble while it replaces the hologram. */}
      {!proactiveMessage && (
        <HologramCage
          portal={portal}
          mode={mascotMode}
          position={position}
          guideTarget={guideTarget}
          onReturnEnd={() => { setMascotMode('docked'); setGuideTarget(null); }}
          companions={activeRun?.stages || []}
        >
          {portal === 'customer'
            ? <CustomerMascotSVG animation={displayedAnimation} animationKey={mascotAnimationKey} />
            : <AdminMascotSVG animation={displayedAnimation} animationKey={mascotAnimationKey} />}
        </HologramCage>
      )}
      {proactiveMessage && <div aria-hidden="true" style={{ width: '160px', height: '212px' }} />}

      {/* Work Console — shown to the left of the mascot for admin tasks */}
      {portal === 'admin' && <WorkConsole runs={activeRuns} onDismiss={removeAgentRun} />}

      <style>{HOLO_CSS}</style>
    </div>
    </>
  );
};
