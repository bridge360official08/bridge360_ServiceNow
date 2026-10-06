import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAssistant, type AssistantGuideTarget, type MascotMode, type MascotAnimation, type AgentRun } from '../../store/AssistantContext';
import { CustomerMascotSVG, AdminMascotSVG, MASCOT_IDLE_GESTURES } from './MascotSVGs';
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
  100% { transform: translate3d(0, 0, 0) rotate(0deg); }
}
@keyframes mascot-flight-body {
  0%,100% { transform: rotate(0) translateY(0) scale(1); }
  28% { transform: rotate(-9deg) translateY(-5px) scale(1.015); }
  58% { transform: rotate(8deg) translateY(-10px) scale(.99); }
  82% { transform: rotate(-4deg) translateY(-3px) scale(1.01); }
}
@keyframes mascot-flight-return-body {
  0%,100% { transform: rotate(0) translateY(0); }
  22% { transform: rotate(-12deg) translateY(-6px); }
  48% { transform: rotate(8deg) translateY(-9px) scale(1.02); }
  76% { transform: rotate(-5deg) translateY(-3px); }
}
@keyframes mascot-work-screen {
  0%,100% { opacity: .72; transform: translateY(2px) scale(.96); }
  50% { opacity: 1; transform: translateY(-3px) scale(1); }
}
@keyframes mascot-work-chart {
  0%,100% { stroke-dashoffset: 28; }
  50% { stroke-dashoffset: 0; }
}
@keyframes b360-mini-work-hop {
  0%,100% { transform: translateY(0) rotate(0); }
  35% { transform: translateY(-7px) rotate(-7deg); }
  68% { transform: translateY(1px) rotate(5deg); }
}
@keyframes b360-mini-work-arm {
  0%,100% { transform: rotate(0); }
  50% { transform: rotate(-28deg); }
}
@keyframes b360-mini-work-thrust {
  0%,100% { opacity: .5; transform: scaleY(.65); }
  45% { opacity: 1; transform: scaleY(1.45); }
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
.b360-mascot-flight[data-flight="return"] { animation: mascot-fly-return 1.5s cubic-bezier(.4,0,.2,1) forwards; }
.b360-mascot-flight[data-flight="return"] .rig-root { animation: mascot-flight-return-body 1.5s cubic-bezier(.4,0,.2,1) forwards; }
.b360-mascot-flight .b360-boot-thruster { animation: flight-thrust .24s ease-in-out infinite alternate; }
@keyframes flight-thrust {
  from { opacity: .42; transform: scaleY(.72); }
  to { opacity: 1; transform: scaleY(1.35); }
}
svg[data-skin="admin"][data-anim="work"] .rig-work-displays { opacity: 1; }
svg[data-skin="admin"][data-anim="work"] .rig-work-screen-a { animation: mascot-work-screen 1.5s ease-in-out infinite; }
svg[data-skin="admin"][data-anim="work"] .rig-work-screen-b { animation: mascot-work-screen 1.8s ease-in-out .3s infinite; }
svg[data-skin="admin"][data-anim="work"] .rig-work-chart { animation: mascot-work-chart 1.3s ease-in-out infinite; }
svg[data-skin="admin"][data-anim="work"] .rig-arm-r { animation: rig-wave .85s ease-in-out infinite alternate; }
svg[data-skin="admin"][data-anim="work"] .rig-arm-l { animation: rig-stretch-l 1.1s ease-in-out infinite alternate; }
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

const MINI_MASCOT_CSS = `
@keyframes b360-mini-thrust {
  0%,100% { opacity: .45; transform: scaleY(.65); }
  50% { opacity: 1; transform: scaleY(1.15); }
}
@keyframes b360-mini-arm-wave {
  0%,100% { transform: rotate(0deg); }
  50% { transform: rotate(-42deg); }
}
@keyframes b360-mini-leg-step {
  0%,100% { transform: rotate(0deg); }
  50% { transform: rotate(-18deg); }
}
@keyframes b360-mini-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
@keyframes b360-mini-sway { 0%,100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
@keyframes b360-mini-twirl {
  0% { transform: perspective(55px) rotateY(0deg); }
  25% { transform: perspective(55px) rotateY(90deg); }
  50% { transform: perspective(55px) rotateY(180deg); }
  75% { transform: perspective(55px) rotateY(270deg); }
  100% { transform: perspective(55px) rotateY(360deg); }
}
@keyframes b360-mini-spin {
  0% { transform: perspective(55px) rotateY(0deg); }
  25% { transform: perspective(55px) rotateY(90deg); }
  50% { transform: perspective(55px) rotateY(180deg); }
  75% { transform: perspective(55px) rotateY(270deg); }
  100% { transform: perspective(55px) rotateY(360deg); }
}
@keyframes b360-mini-bounce { 0%,100% { transform: translateY(0) scale(1); } 45% { transform: translateY(-7px) scale(1.05); } 72% { transform: translateY(-1px) scale(1.01); } }
@keyframes b360-mini-stretch-left { 0%,100% { transform: rotate(0); } 50% { transform: rotate(34deg); } }
@keyframes b360-mini-stretch-right { 0%,100% { transform: rotate(0); } 50% { transform: rotate(-34deg); } }
@keyframes b360-mini-skate-push-left {
  0%,100% { transform: rotate(0); }
  28% { transform: rotate(-36deg) translateY(2px); }
  54% { transform: rotate(8deg); }
}
@keyframes b360-mini-skate-push-right {
  0%,100% { transform: rotate(0); }
  62% { transform: rotate(0); }
  84% { transform: rotate(36deg) translateY(2px); }
}
@keyframes b360-mini-skate-balance { 0%,100% { transform: rotate(0); } 50% { transform: rotate(-22deg); } }
@keyframes b360-mini-skate-board { 0%,100% { transform: translateX(0) rotate(0); } 30% { transform: translateX(-4px) rotate(-4deg); } 70% { transform: translateX(4px) rotate(4deg); } }
@keyframes b360-mini-dance { 0%,100% { transform: translateY(0) rotate(-6deg); } 25% { transform: translateY(-5px) rotate(8deg); } 50% { transform: translateY(0) rotate(-8deg); } 75% { transform: translateY(-4px) rotate(6deg); } }
@keyframes b360-mini-dance-left { 0%,100% { transform: rotate(-5deg); } 25%,75% { transform: rotate(22deg); } 50% { transform: rotate(-14deg); } }
@keyframes b360-mini-dance-right { 0%,100% { transform: rotate(5deg); } 25%,75% { transform: rotate(-20deg); } 50% { transform: rotate(14deg); } }
@keyframes b360-mini-wheel-roll { to { transform: rotate(360deg); } }
@keyframes b360-mini-look { 0%,100% { transform: rotate(0); } 35% { transform: rotate(-12deg); } 70% { transform: rotate(10deg); } }
@keyframes b360-mini-peek { 0%,100% { transform: translateX(0) rotate(0); } 45% { transform: translateX(-4px) rotate(-12deg); } }
@keyframes b360-mini-skate { 0%,100% { transform: translateX(0) rotate(0); } 35% { transform: translateX(-6px) rotate(-7deg); } 70% { transform: translateX(6px) rotate(7deg); } }
@keyframes b360-mini-moonwalk { 0%,100% { transform: translateX(0); } 25% { transform: translateX(6px); } 75% { transform: translateX(-6px); } }
@keyframes b360-mini-juggle-ball { 0%,100% { transform: translateY(4px); } 50% { transform: translateY(-8px); } }
@keyframes b360-mini-heart { 0%,100% { transform: scale(1); } 35% { transform: scale(1.18); } 65% { transform: scale(.94); } }
@keyframes b360-mini-bow { 0%,100% { transform: rotate(0); } 45%,70% { transform: rotate(16deg); } }
@keyframes b360-mini-cape { 0%,100% { transform: skewX(0) rotate(0); } 50% { transform: skewX(-18deg) rotate(8deg); } }
@keyframes b360-mini-orbital-hover-left { 0%,100% { transform: translate(0,0) rotate(-3deg); } 50% { transform: translate(-2px,-7px) rotate(3deg); } }
@keyframes b360-mini-orbital-hover-right { 0%,100% { transform: translate(0,-3px) rotate(3deg); } 50% { transform: translate(2px,4px) rotate(-3deg); } }
@keyframes b360-mini-work-hop {
  0%,100% { transform: translate(0,0) rotate(0); }
  35% { transform: translate(4px,-8px) rotate(-8deg); }
  68% { transform: translate(-3px,1px) rotate(6deg); }
}
@keyframes b360-mini-work-arm { 0%,100% { transform: rotate(0); } 50% { transform: rotate(-36deg); } }
@keyframes b360-mini-work-thrust { 0%,100% { opacity: .5; transform: scaleY(.65); } 45% { opacity: 1; transform: scaleY(1.45); } }
.b360-mini-root,
.b360-mini-arm-left,
.b360-mini-arm-right,
.b360-mini-left-leg,
.b360-mini-right-leg,
.b360-mini-head,
.b360-mini-cape,
.b360-mini-board,
.b360-mini-orbs,
.b360-mini-heart {
  transform-box: fill-box;
}
.b360-mini-root { transform-origin: center bottom; transform-style: preserve-3d; }
.b360-mini-arm-left,
.b360-mini-arm-right { transform-origin: center top; }
.b360-mini-left-leg,
.b360-mini-right-leg { transform-origin: center top; }
.b360-mini-head { transform-origin: center bottom; }
.b360-mini-cape { transform-origin: top center; }
.b360-mini-thruster { transform-box: fill-box; transform-origin: center top; animation: b360-mini-thrust .42s ease-in-out infinite; }
.b360-mini-board,
.b360-mini-cape,
.b360-mini-orbs,
.b360-mini-heart,
.b360-mini-soundmarks { opacity: 0; }
.b360-mini-torso { transform-box: fill-box; transform-origin: center; animation: b360-mini-float 3.2s ease-in-out infinite; }
[data-agent-gesture="idle-wave"] .b360-mini-arm-right { animation: b360-mini-arm-wave .55s ease-in-out 3; }
[data-agent-gesture="idle-listen"] .b360-mini-head { animation: b360-mini-look .8s ease-in-out 2; }
[data-agent-gesture="idle-listen"] .b360-mini-soundmarks { opacity: 1; animation: b360-mini-float .65s ease-in-out infinite; }
[data-agent-gesture="idle-stretch"] .b360-mini-arm-left { animation: b360-mini-stretch-left .8s ease-in-out 2; }
[data-agent-gesture="idle-stretch"] .b360-mini-arm-right { animation: b360-mini-stretch-right .8s ease-in-out 2; }
[data-agent-gesture="idle-sway"] .b360-mini-root { animation: b360-mini-sway 1.2s ease-in-out 2; }
[data-agent-gesture="idle-twirl"] .b360-mini-root { animation: b360-mini-twirl 1.1s ease-in-out 2; }
[data-agent-gesture="idle-bounce"] .b360-mini-root { animation: b360-mini-bounce .8s ease-in-out 2; }
[data-agent-gesture="idle-kick"] .b360-mini-left-leg { animation: b360-mini-leg-step .55s ease-in-out 2; }
[data-agent-gesture="idle-kick"] .b360-mini-right-leg { animation: b360-mini-leg-step .55s ease-in-out 2 reverse; }
[data-agent-gesture="idle-look"] .b360-mini-head { animation: b360-mini-look .7s ease-in-out 3; }
[data-agent-gesture="idle-look"] .b360-mini-eye-left { animation: b360-mini-look .55s ease-in-out 3; }
[data-agent-gesture="idle-look"] .b360-mini-eye-right { animation: b360-mini-look .55s ease-in-out 3 reverse; }
[data-agent-gesture="idle-salute"] .b360-mini-arm-right { animation: b360-mini-arm-wave .7s ease-in-out 2; }
[data-agent-gesture="idle-dance"] .b360-mini-root { animation: b360-mini-dance .65s ease-in-out 4; }
[data-agent-gesture="idle-dance"] .b360-mini-arm-left { animation: b360-mini-stretch-left .55s ease-in-out 4; }
[data-agent-gesture="idle-dance"] .b360-mini-arm-right { animation: b360-mini-stretch-right .55s ease-in-out 4; }
[data-agent-gesture="idle-dance"] .b360-mini-left-leg { animation: b360-mini-dance-left .65s ease-in-out 4; }
[data-agent-gesture="idle-dance"] .b360-mini-right-leg { animation: b360-mini-dance-right .65s ease-in-out 4; }
[data-agent-gesture="idle-skate"] .b360-mini-root { animation: b360-mini-skate .7s ease-in-out 3; }
[data-agent-gesture="idle-skate"] .b360-mini-left-leg { animation: b360-mini-skate-push-left .7s ease-in-out 3; }
[data-agent-gesture="idle-skate"] .b360-mini-right-leg { animation: b360-mini-skate-push-right .7s ease-in-out 3; }
[data-agent-gesture="idle-skate"] .b360-mini-arm-left { animation: b360-mini-skate-balance .7s ease-in-out 3; }
[data-agent-gesture="idle-skate"] .b360-mini-arm-right { animation: b360-mini-skate-balance .7s ease-in-out 3 reverse; }
[data-agent-gesture="idle-skate"] .b360-mini-board { opacity: 1; }
[data-agent-gesture="idle-skate"] .b360-mini-board { animation: b360-mini-skate-board .7s ease-in-out 3; }
[data-agent-gesture="idle-skate"] .b360-mini-board circle { transform-box: fill-box; transform-origin: center; animation: b360-mini-wheel-roll .3s linear 7; }
[data-agent-gesture="idle-cape"] .b360-mini-cape { opacity: 1; animation: b360-mini-cape .65s ease-in-out 4; }
[data-agent-gesture="idle-spin"] .b360-mini-root { animation: b360-mini-spin 1s ease-in-out 2; }
[data-agent-gesture="idle-shrug"] .b360-mini-arm-left { animation: b360-mini-stretch-left .7s ease-in-out 2; }
[data-agent-gesture="idle-shrug"] .b360-mini-arm-right { animation: b360-mini-stretch-right .7s ease-in-out 2; }
[data-agent-gesture="idle-peek"] .b360-mini-head { animation: b360-mini-peek .7s ease-in-out 2; }
[data-agent-gesture="idle-cheer"] .b360-mini-root { animation: b360-mini-bounce .75s ease-in-out 3; }
[data-agent-gesture="idle-cheer"] .b360-mini-arm-left { animation: b360-mini-stretch-left .6s ease-in-out 3; }
[data-agent-gesture="idle-cheer"] .b360-mini-arm-right { animation: b360-mini-stretch-right .6s ease-in-out 3; }
[data-agent-gesture="idle-moonwalk"] .b360-mini-root { animation: b360-mini-moonwalk .75s ease-in-out 3; }
[data-agent-gesture="idle-moonwalk"] .b360-mini-left-leg { animation: b360-mini-leg-step .5s ease-in-out 3; }
[data-agent-gesture="idle-moonwalk"] .b360-mini-right-leg { animation: b360-mini-leg-step .5s ease-in-out 3 reverse; }
[data-agent-gesture="idle-juggle"] .b360-mini-orbs { opacity: 1; }
[data-agent-gesture="idle-juggle"] .b360-mini-orb-a { animation: b360-mini-juggle-ball .55s ease-in-out infinite; }
[data-agent-gesture="idle-juggle"] .b360-mini-orb-b { animation: b360-mini-juggle-ball .55s ease-in-out .18s infinite reverse; }
[data-agent-gesture="idle-juggle"] .b360-mini-orb-c { animation: b360-mini-juggle-ball .55s ease-in-out .36s infinite; }
[data-agent-gesture="idle-spinbow"] .b360-mini-root { animation: b360-mini-spin .9s ease-in-out 1; }
[data-agent-gesture="idle-spinbow"] .b360-mini-head { animation: b360-mini-bow .6s ease-in-out 2 1.3s; }
[data-agent-gesture="idle-heart"] .b360-mini-heart { opacity: 1; animation: b360-mini-heart .7s ease-in-out 3; }
[data-agent-working="true"] .b360-mini-root { animation: b360-mini-work-hop .7s ease-in-out infinite; }
[data-agent-working="true"] .b360-mini-arm-right { animation: b360-mini-work-arm .38s ease-in-out infinite alternate; }
[data-agent-working="true"] .b360-mini-thruster { animation: b360-mini-work-thrust .25s ease-in-out infinite alternate; }
.b360-mini-hover-left { animation: b360-mini-orbital-hover-left 2.8s ease-in-out infinite; }
.b360-mini-hover-right { animation: b360-mini-orbital-hover-right 3s ease-in-out infinite; }
`;

const MiniAdvisoryMascot: React.FC<{
  color: string;
  icon: React.ReactNode;
  role: AdvisoryStageId;
  isWorking: boolean;
  className?: string;
}> = ({ color, icon, role, isWorking, className }) => {
  const [gesture, setGesture] = useState<MascotAnimation>(() =>
    MASCOT_IDLE_GESTURES[Math.floor(Math.random() * MASCOT_IDLE_GESTURES.length)],
  );

  useEffect(() => {
    if (isWorking) return undefined;
    let timer: ReturnType<typeof setTimeout>;
    const chooseNextGesture = () => {
      setGesture(previous => {
        const options = MASCOT_IDLE_GESTURES.filter(animation => animation !== previous);
        return options[Math.floor(Math.random() * options.length)];
      });
      timer = setTimeout(chooseNextGesture, 4200 + Math.random() * 2400);
    };
    timer = setTimeout(chooseNextGesture, 4200 + Math.random() * 2400);
    return () => clearTimeout(timer);
  }, [isWorking]);

  const headgear = {
    triage: <><path d="M9 12Q11 5 18 5Q25 5 27 12H9Z" fill={color} /><path d="M7 12H29L26 15H10Z" fill="#E0F2FE" /><path d="M18 5V1" stroke="#E0F2FE" strokeWidth="1.5" /><circle cx="18" cy="1.5" r="1.5" fill="#FDE68A" /></>,
    docs: <><path d="M18 3L27 12L18 16L9 12Z" fill={color} stroke="#F5F3FF" strokeWidth="1.5" /><path d="M18 5V14M11 12L18 15L25 12" fill="none" stroke="#FFFFFF" strokeWidth="1" /></>,
    completeness: <><rect x="9" y="5" width="18" height="10" rx="3" fill={color} /><path d="M13 8L15 10L18 7M20 8H24M13 12L15 14L18 11M20 12H24" fill="none" stroke="#FEF3C7" strokeWidth="1.2" /></>,
    support: <><path d="M10 13V11A8 8 0 0 1 26 11V13" fill="none" stroke={color} strokeWidth="3" /><circle cx="10" cy="14" r="2.5" fill="#FFE4E6" /><circle cx="26" cy="14" r="2.5" fill="#FFE4E6" /><path d="M18 7V12M15.5 9.5H20.5" stroke="#FFFFFF" strokeWidth="1.5" /></>,
    risk: <><path d="M18 3L27 7V12Q25 18 18 20Q11 18 9 12V7Z" fill={color} stroke="#D1FAE5" strokeWidth="1" /><path d="M18 7L22 9V12Q21 15 18 16Q15 15 14 12V9Z" fill="#D1FAE5" /></>,
    decision: <><path d="M19 12Q25 4 28 5Q28 12 20 15" fill={color} /><path d="M19 13Q22 7 27 6" fill="none" stroke="#FFEDD5" strokeWidth="1" /><path d="M9 8L12 5L14 7L11 10Z" fill="#FFFFFF" stroke={color} strokeWidth="1" /></>,
  }[role];

  return (
    <div className={className} data-agent-gesture={isWorking ? 'work' : gesture} data-agent-working={isWorking ? 'true' : undefined} data-agent-role={role} style={{
      width: '34px',
      height: '48px',
      position: 'relative',
      filter: `drop-shadow(0 0 4px ${color}99)`,
    }}>
      <svg aria-hidden="true" viewBox="0 0 36 52" width="34" height="48" style={{ overflow: 'visible' }}>
        <g className="b360-mini-root">
          <path className="b360-mini-cape" d="M12 23L7 39L16 35L18 40L21 35L29 39L24 23Z" fill={color} stroke="#E0F2FE" strokeWidth=".8" opacity=".88" />
          <g className="b360-mini-board">
            <path d="M5 45Q18 42 31 45L29 48Q18 50 7 48Z" fill="#DCE7FF" stroke={color} strokeWidth="1" />
            <circle cx="10" cy="49" r="1.4" fill="#FDE68A" />
            <circle cx="26" cy="49" r="1.4" fill="#FDE68A" />
          </g>
          <g className="b360-mini-orbs">
            <circle className="b360-mini-orb-a" cx="8" cy="8" r="2" fill="#FDE68A" />
            <circle className="b360-mini-orb-b" cx="18" cy="3" r="2" fill="#67E8F9" />
            <circle className="b360-mini-orb-c" cx="28" cy="8" r="2" fill="#F0ABFC" />
          </g>
          <path d="M16 2C12 -1 9 3 12 6L18 11L24 6C27 3 24 -1 20 2L18 4Z" className="b360-mini-heart" fill="#FB7185" />
          <ellipse cx="18" cy="48" rx="9" ry="2" fill={color} opacity=".45" />
          <path d="M13 42L12 47M23 42L24 47" stroke={color} strokeWidth="2" strokeLinecap="round" className="b360-mini-thruster" />
          <path className="b360-mini-left-leg" d="M13 35L12 43H16L18 36" fill="#172554" stroke="#BFDBFE" strokeWidth="1" strokeLinejoin="round" />
          <path className="b360-mini-right-leg" d="M23 35L24 43H20L18 36" fill="#172554" stroke="#BFDBFE" strokeWidth="1" strokeLinejoin="round" />
          <g className="b360-mini-torso">
            <path d="M12 22Q18 19 24 22L27 36Q18 39 9 36Z" fill={color} stroke="#E0F2FE" strokeWidth="1" />
            <path d="M16 25L18 31L20 25" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity=".75" />
          </g>
          <g className="b360-mini-arm-left">
            <path d="M12 24L6 30L9 32L14 28" fill="none" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6" cy="30" r="2" fill="#FDE68A" />
          </g>
          <g className="b360-mini-arm-right">
            <path d="M24 24L30 29L27 32L22 28" fill="none" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="30" cy="29" r="2" fill="#FDE68A" />
          </g>
          <g className="b360-mini-head">
            <rect x="10" y="7" width="16" height="15" rx="5" fill="#0B1220" stroke={color} strokeWidth="1.4" />
            <path d="M12 13Q18 8 24 13V17H12Z" fill="#172554" stroke="#BFDBFE" strokeWidth=".6" />
            <g className="b360-mini-eye-left"><circle cx="15" cy="14" r="1.4" fill="#67E8F9" /></g>
            <g className="b360-mini-eye-right"><circle cx="21" cy="14" r="1.4" fill="#67E8F9" /></g>
            <path d="M16 19H20" stroke="#F8FAFC" strokeWidth=".8" strokeLinecap="round" />
            {headgear}
            <g className="b360-mini-soundmarks" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round">
              <path d="M28 11Q31 14 28 17" />
              <path d="M31 9Q35 14 31 19" />
            </g>
          </g>
        </g>
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
  const activeRole = ADVISORY_ROLES.find(role =>
    stages.some(stage => stage.id === role.stageId && stage.status === 'active'),
  );
  const visibleRoles = activeRole ? [activeRole] : availableRoles;
  const idleSlots = [
    { left: '0px', top: '40px' },
    { left: '130px', top: '40px' },
    { left: '7px', top: '137px' },
    { left: '45px', top: '137px' },
    { left: '83px', top: '137px' },
    { left: '121px', top: '137px' },
  ];

  return (
    <div aria-label="Advisory agents collaborating around the mascot" style={{
      position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 6,
    }}>
      {visibleRoles.map((role, index) => {
        const Icon = role.icon;
        const isWorking = role.stageId === activeRole?.stageId;
        const isComplete = workingStages.has(role.stageId) && !isWorking;
        const slot = activeRole
          ? { left: 'calc(50% + 43px)', top: '50%' }
          : idleSlots[index];
        return (
          <div
            key={role.stageId}
            aria-label={`${role.name}, ${role.role}${isWorking ? ', working' : ', standing by'}`}
            title={`${role.name} · ${role.role}${isWorking ? ' · working' : ' · waiting'}`}
            style={{
              position: 'absolute',
              ...slot,
              width: '42px',
              height: '54px',
              display: 'grid',
              placeItems: 'center',
              opacity: isWorking ? 1 : isComplete ? .82 : .72,
              transform: activeRole ? 'translateY(-50%) scale(.82)' : 'scale(.66)',
              transformOrigin: activeRole ? 'left center' : 'top left',
              animation: isWorking ? 'b360-agent-glow 1s ease-in-out infinite' : undefined,
              ['--agent-color' as string]: `${role.color}99`,
            }}
          >
            <MiniAdvisoryMascot
              color={role.color}
              icon={<Icon size={9} strokeWidth={2.5} />}
              role={role.stageId}
              isWorking={isWorking}
              className={!activeRole && index < 2 ? `b360-mini-hover-${index === 0 ? 'left' : 'right'}` : undefined}
            />
            {!activeRole && <span style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#FFFFFF',
              fontSize: '6px',
              fontWeight: 800,
              textShadow: '0 1px 4px #020617',
              whiteSpace: 'nowrap',
              padding: '1px 3px',
              borderRadius: '4px',
              background: 'rgba(2,6,23,.72)',
              border: `1px solid ${role.color}88`,
            }}>{role.name}</span>}
          </div>
        );
      })}
    </div>
  );
};

interface ChatPanelPlacement {
  right: number;
  width: number;
  bottom: number;
  maxHeight: number;
  viewportWidth: number;
  viewportHeight: number;
}

const WorkConsole: React.FC<{
  runs: AgentRun[];
  onDismiss: (id: string) => void;
  dockPosition: { right: number; bottom: number };
  chatPanel: ChatPanelPlacement | null;
}> = ({ runs, onDismiss, dockPosition, chatPanel }) => {
  if (runs.length === 0) return null;
  const isRunning = runs.some(run => run.status === 'running');
  const hasErrors = runs.some(run => run.status === 'error');
  const HeadingIcon = isRunning ? Loader : hasErrors ? AlertTriangle : CheckCircle;
  const heading = isRunning ? 'Work Console' : hasErrors ? 'Needs attention' : 'Task updates';
  const panelLeft = chatPanel
    ? chatPanel.viewportWidth - chatPanel.right - chatPanel.width
    : 0;
  const canFitBesidePanel = Boolean(chatPanel && panelLeft >= 266);
  const placeAbovePanel = Boolean(chatPanel && !canFitBesidePanel);
  const consoleBottom = placeAbovePanel && chatPanel
      ? chatPanel.bottom + chatPanel.maxHeight + 8
      : dockPosition.bottom + 104;
  const consoleHeight = placeAbovePanel && chatPanel
    ? Math.max(80, Math.min(320, chatPanel.viewportHeight - chatPanel.bottom - chatPanel.maxHeight - 16))
    : chatPanel
    ? Math.min(320, chatPanel.viewportHeight - 24)
    : 320;
  const consoleRight = chatPanel
    ? canFitBesidePanel
        ? chatPanel.right + chatPanel.width + 12
        : chatPanel.right
      : dockPosition.right + 145;
  return (
    <div style={{
        position: 'fixed', right: `${consoleRight}px`, bottom: `${consoleBottom}px`,
      width: `min(250px, calc(100vw - 24px))`,
      maxHeight: `${consoleHeight}px`, overflowY: 'auto',
      background: 'linear-gradient(135deg, rgba(8,15,30,.94) 0%, rgba(15,30,55,.90) 100%)',
      border: '1px solid rgba(0,245,212,.35)',
      borderRadius: '16px', padding: '12px 14px',
      boxShadow: '0 0 30px rgba(0,245,212,.15), inset 0 0 30px rgba(0,245,212,.05)',
      animation: 'console-in-left .4s ease-out forwards, work-pulse 3s ease-in-out infinite',
      backdropFilter: 'blur(14px)',
      pointerEvents: 'auto',
      zIndex: 9997,
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
    ? (() => {
        const x = guideTarget.x + guideTarget.width / 2 - (window.innerWidth - position.right - 80);
        const y = guideTarget.y + guideTarget.height / 2 - (window.innerHeight - position.bottom - 94 - 119);
        const heading = Math.atan2(y, x) * 180 / Math.PI + 90;
        return { x: `${x}px`, y: `${y}px`, angle: `${heading}deg` };
      })()
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

      {portal === 'admin' && mode !== 'moving' && <AdvisorySwarm stages={companions} />}

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
      {actions && actions.length > 0 && (
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
export const FloatingMascot: React.FC<{
  position: { right: number; bottom: number };
  chatPanelPlacement: ChatPanelPlacement;
}> = ({ position, chatPanelPlacement }) => {
  const {
    portal,
    isOpen,
    proactiveMessage, proactiveAction,
    setProactiveMessage, setProactiveAction,
    mascotAnimation, mascotAnimationKey, isThinking,
    assistantEnabled,
    mascotMode, setMascotMode,
    agentRuns, removeAgentRun,
    guideTarget, setGuideTarget,
    reportActivity,
  } = useAssistant();

  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [idleAnimation, setIdleAnimation] = useState<MascotAnimation>('idle');
  const lastIdleGestureRef = useRef<MascotAnimation>('idle');
  const dockScale = mascotMode === 'docked' ? 0.82 : 1.06;

  // Effective animation cue
  const effectiveAnimation = isThinking ? 'think'
    : agentRuns.some(run => run.status === 'running') ? 'work'
    : isTyping ? 'talk'
    : mascotAnimation;
  const hasPriorityAnimation = isThinking || isTyping || agentRuns.some(run => run.status === 'running');
  const displayedAnimation = hasPriorityAnimation
    ? effectiveAnimation
    : mascotMode !== 'moving' && idleAnimation !== 'idle'
    ? idleAnimation
    : effectiveAnimation;

  useEffect(() => {
    if (
      !assistantEnabled || mascotMode === 'moving' || isThinking || isTyping ||
      agentRuns.some(run => run.status === 'running')
    ) {
      setIdleAnimation('idle');
      return undefined;
    }

    const idleGestures = MASCOT_IDLE_GESTURES;
    let gestureTimer: ReturnType<typeof setTimeout>;
    let resetTimer: ReturnType<typeof setTimeout>;
    const playRandomGesture = () => {
      const choices = idleGestures.filter(gesture => gesture !== lastIdleGestureRef.current);
      const gesture = choices[Math.floor(Math.random() * choices.length)];
      lastIdleGestureRef.current = gesture;
      setIdleAnimation(gesture);
      resetTimer = setTimeout(() => {
        setIdleAnimation('idle');
        gestureTimer = setTimeout(playRandomGesture, 5_000 + Math.random() * 4_000);
      }, 3_100);
    };
    gestureTimer = setTimeout(playRandomGesture, 5_000 + Math.random() * 4_000);

    return () => {
      clearTimeout(gestureTimer);
      clearTimeout(resetTimer);
    };
  }, [assistantEnabled, mascotMode, isThinking, isTyping, agentRuns]);

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
    }, 20);
    return () => clearInterval(timer);
  }, [proactiveMessage]);

  const activeRuns = useMemo(() => agentRuns.filter(r => r.status !== 'idle'), [agentRuns]);
  const activeRun = activeRuns.find(run => run.status === 'running');
  const showSpeechBubble = Boolean(proactiveMessage) && !activeRun;
  const isGuiding = Boolean(guideTarget) && mascotMode === 'moving';
  const idleAdvisoryStages: AgentRun['stages'] = ADVISORY_ROLES.map(role => ({
    id: role.stageId,
    label: role.role,
    status: 'pending',
  }));

  const handleDismissBubble = () => {
    setProactiveMessage(null);
    setProactiveAction(null);
    reportActivity('action', 'Dismissed proactive assistant suggestion');
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
      {/* During an accepted guide action, let the single mascot fly to the target. */}
      {!isOpen && !isGuiding && showSpeechBubble && proactiveMessage && (
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
      {(!isOpen || isGuiding) && (!showSpeechBubble || isGuiding) && (
        <HologramCage
          portal={portal}
          mode={mascotMode}
          position={position}
          guideTarget={guideTarget}
          onReturnEnd={() => { setMascotMode('docked'); setGuideTarget(null); }}
          companions={activeRun?.stages || idleAdvisoryStages}
        >
          {portal === 'customer'
            ? <CustomerMascotSVG animation={displayedAnimation} animationKey={mascotAnimationKey} />
            : <AdminMascotSVG animation={displayedAnimation} animationKey={mascotAnimationKey} />}
        </HologramCage>
      )}
      {!isOpen && showSpeechBubble && <div aria-hidden="true" style={{ width: '160px', height: '212px' }} />}

      <style>{`${HOLO_CSS}${MINI_MASCOT_CSS}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
    {portal === 'admin' && (
      <WorkConsole
        runs={activeRuns}
        onDismiss={removeAgentRun}
        dockPosition={position}
        chatPanel={isOpen ? chatPanelPlacement : null}
      />
    )}
    </>
  );
};
