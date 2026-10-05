import React, { useEffect, useState } from 'react';
import type { MascotAnimation } from '../../store/AssistantContext';

/**
 * One rigged skeleton, skinned two ways (customer "Guide" / admin "Intern").
 * Every body part is its own <g class="rig-*"> so it can be animated
 * independently. Animations are declarative CSS gated by the root svg's
 * `data-anim` (current cue) and `data-skin` (which character) attributes;
 * gestures auto-return to idle. Sustained cues (talk/think/alert) stay until
 * changed. Re-firing the same gesture is handled via `animationKey`.
 *
 * This is a glossy, volumetric redraw: radial-gradient shading for sphere-like
 * helmet/eyes, soft specular highlights, rim light, and rounder "chibi"
 * proportions to match the 3D reference mascots.
 */

type Skin = 'customer' | 'admin';

interface SkinConfig {
  faceTop: string;
  faceBottom: string;
  brow: string;
  eye: string;
  eyeCore: string;
  eyeEdge: string;      // darker iris rim (keeps iris coloured, not black)
  glow: string;         // filter id suffix used for eyes/antenna
  antenna: string;
  headphone: string;
  headphoneRim: string;
  hoodLining: string;   // inner hood colour
  glove: string;        // hand/glove fill
  gloveStroke: string;
  logo: 'heart' | 'wave';
  stripe: string;
  cuff: string;
  shoeAccent: string;
  mouth: string;
  hoodieGrad: string;   // gradient id suffix
  pants: string;        // tracksuit trouser fill
  hasCape: boolean;
  hasBadge: boolean;
  pose: 'wave' | 'pockets';
  bubbleAccent: string;
}

const SKINS: Record<Skin, SkinConfig> = {
  customer: {
    faceTop: '#243149',
    faceBottom: '#060B18',
    brow: '#C084FC',
    eye: '#A855F7',
    eyeCore: '#F5D0FE',
    eyeEdge: '#7E22CE',
    glow: 'PurpleGlow',
    antenna: '#F472B6',
    headphone: '#7C3AED',
    headphoneRim: '#A78BFA',
    hoodLining: '#22D3EE',
    glove: '#6D28D9',
    gloveStroke: '#4C1D95',
    logo: 'heart',
    stripe: '#22D3EE',
    cuff: '#FFFFFF',
    shoeAccent: '#7C3AED',
    mouth: '#F9A8D4',
    hoodieGrad: 'CustHoodie',
    pants: 'CustPants',
    hasCape: true,
    hasBadge: false,
    pose: 'wave',
    bubbleAccent: '#8B5CF6',
  },
  admin: {
    faceTop: '#16365F',
    faceBottom: '#071320',
    brow: '#22D3EE',
    eye: '#38BDF8',
    eyeCore: '#E0F2FE',
    eyeEdge: '#0C4A6E',
    glow: 'CyanGlow',
    antenna: '#5EEAD4',
    headphone: '#0F213D',
    headphoneRim: '#22D3EE',
    hoodLining: '#22D3EE',
    glove: '#13294A',
    gloveStroke: '#0A1526',
    logo: 'wave',
    stripe: '#A3E635',
    cuff: '#0F213D',
    shoeAccent: '#A3E635',
    mouth: '#7DD3FC',
    hoodieGrad: 'AdHoodie',
    pants: 'AdPants',
    hasCape: false,
    hasBadge: true,
    pose: 'pockets',
    bubbleAccent: '#22D3EE',
  },
};

/** Small family-crest emblem (3 figures under an arch). */
function FamilyCrest({ scale = 1, stroke = '#FFFFFF' }: { scale?: number; stroke?: string }) {
  return (
    <g transform={`scale(${scale})`} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round">
      <path d="M -16 9 A 17 17 0 0 1 16 9" />
      <circle cx="-9" cy="-1" r="3.4" fill={stroke} stroke="none" />
      <path d="M -9 3 L -9 12" />
      <circle cx="0" cy="-6" r="4" fill={stroke} stroke="none" />
      <path d="M 0 -1 L 0 13" />
      <circle cx="9" cy="-1" r="3.4" fill={stroke} stroke="none" />
      <path d="M 9 3 L 9 12" />
    </g>
  );
}

function HeartLogo({ color = '#FFFFFF', scale = 1 }: { color?: string; scale?: number }) {
  return (
    <path
      transform={`scale(${scale}) translate(-12,-11)`}
      d="M 12 6 C 8.5 2, 2 5, 2 10.5 C 2 16, 12 21, 12 21 C 12 21, 22 16, 22 10.5 C 22 5, 15.5 2, 12 6 Z"
      fill={color}
    />
  );
}

/** Stylised soundwave mark for the admin headphone cups. */
function WaveLogo({ color = '#22D3EE', scale = 1 }: { color?: string; scale?: number }) {
  return (
    <path
      transform={`scale(${scale})`}
      d="M -11 -6 L -6 8 L 0 -3 L 6 8 L 11 -6"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** Open "high-five" hand with four fingers + thumb (palm to viewer). */
function OpenHand({ fill, stroke, scale = 1 }: { fill: string; stroke: string; scale?: number }) {
  return (
    <g transform={`scale(${scale})`} stroke={stroke} strokeWidth={1.5}>
      {/* fingers */}
      <rect x="-17" y="-36" width="9" height="24" rx="4.5" fill={fill} />
      <rect x="-6" y="-42" width="9" height="28" rx="4.5" fill={fill} />
      <rect x="5" y="-40" width="9" height="26" rx="4.5" fill={fill} />
      <rect x="15" y="-33" width="9" height="21" rx="4.5" fill={fill} />
      {/* thumb */}
      <rect x="-28" y="-12" width="9" height="20" rx="4.5" fill={fill} transform="rotate(-38 -23 -2)" />
      {/* palm */}
      <circle cx="0" cy="2" r="19" fill={fill} />
    </g>
  );
}

/** Rounded fist/mitt with finger ridges (hand hanging at side). */
function FistHand({ fill, stroke, scale = 1 }: { fill: string; stroke: string; scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <rect x="-16" y="-15" width="32" height="32" rx="13" fill={fill} stroke={stroke} strokeWidth="2" />
      <path d="M -8 3 L -8 15 M 0 4 L 0 16 M 8 3 L 8 15" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* thumb */}
      <rect x="-20" y="-6" width="9" height="15" rx="4.5" fill={fill} stroke={stroke} strokeWidth="2" transform="rotate(-20 -16 1)" />
    </g>
  );
}

/** Detailed chunky sneaker (toe cap, laces, side swoosh, coloured sole). */
function Sneaker({ accent, soleId, flip = false }: { accent: string; soleId: string; flip?: boolean }) {
  return (
    <g transform={flip ? 'scale(-1,1)' : undefined}>
      {/* upper */}
      <path d="M -34 -34 Q -40 -34 -40 -14 Q -40 2 -26 4 L 30 4 Q 40 4 40 -8 Q 40 -26 20 -32 Q -8 -40 -34 -34 Z" fill={`url(#${soleId}Shoe)`} stroke="#C3CDDC" strokeWidth="2.5" />
      {/* toe cap */}
      <path d="M -30 -10 Q -34 4 -16 4 L 2 4 Q 6 -8 -6 -13 Q -20 -16 -30 -10 Z" fill="#FFFFFF" stroke="#C7D1DE" strokeWidth="1.5" opacity="0.95" />
      {/* laces */}
      <path d="M -8 -27 L 12 -21 M -9 -19 L 13 -13 M -7 -11 L 13 -5" stroke="#C7D1DE" strokeWidth="2.5" strokeLinecap="round" />
      {/* side swoosh */}
      <path d="M 14 -29 Q 34 -14 23 4" stroke={accent} strokeWidth="5.5" fill="none" strokeLinecap="round" />
      {/* coloured sole */}
      <path d="M -40 2 Q -43 17 -28 19 L 34 19 Q 45 17 42 2 Z" fill={accent} />
      <path d="M -35 11 L 39 11" stroke="#FFFFFF" strokeWidth="2" opacity="0.45" />
    </g>
  );
}

function Defs({ id, skin }: { id: string; skin: SkinConfig }) {
  return (
    <defs>
      {/* Glossy white helmet — spherical shading */}
      <radialGradient id={id + 'Helmet'} cx="38%" cy="28%" r="80%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="42%" stopColor="#F6F8FC" />
        <stop offset="78%" stopColor="#DCE3EC" />
        <stop offset="100%" stopColor="#B7C2D1" />
      </radialGradient>

      {/* Dark glossy face screen */}
      <radialGradient id={id + 'Screen'} cx="44%" cy="32%" r="85%">
        <stop offset="0%" stopColor={skin.faceTop} />
        <stop offset="60%" stopColor={skin.faceBottom} />
        <stop offset="100%" stopColor="#02060F" />
      </radialGradient>

      {/* Iris — bright core to saturated coloured rim (never black) */}
      <radialGradient id={id + 'Iris'} cx="42%" cy="36%" r="70%">
        <stop offset="0%" stopColor={skin.eyeCore} />
        <stop offset="45%" stopColor={skin.eye} />
        <stop offset="100%" stopColor={skin.eyeEdge} />
      </radialGradient>

      {/* Customer hoodie: purple -> indigo -> pink */}
      <linearGradient id={id + 'CustHoodie'} x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="42%" stopColor="#6366F1" />
        <stop offset="72%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id={id + 'CustPants'} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>

      {/* Admin tracksuit: deep navy */}
      <linearGradient id={id + 'AdHoodie'} x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#213B63" />
        <stop offset="48%" stopColor="#13294A" />
        <stop offset="100%" stopColor="#0A1526" />
      </linearGradient>
      <linearGradient id={id + 'AdPants'} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#13294A" />
        <stop offset="100%" stopColor="#070F1C" />
      </linearGradient>

      {/* Customer cape */}
      <linearGradient id={id + 'Cape'} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C084FC" />
        <stop offset="50%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>

      {/* Chunky sneaker */}
      <linearGradient id={id + 'Shoe'} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#D5DEE9" />
      </linearGradient>

      <filter id={id + 'CyanGlow'} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id={id + 'PurpleGlow'} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4.5" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id={id + 'Drop'} x="-25%" y="-20%" width="150%" height="150%">
        <feDropShadow dx="0" dy="9" stdDeviation="7" floodColor="#0B1120" floodOpacity="0.26" />
      </filter>
      <filter id={id + 'Soft'} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
  );
}

const GESTURE_MS: Partial<Record<MascotAnimation, number>> = {
  wave: 1700,
  nod: 1400,
  point: 1800,
  celebrate: 1900,
  'idle-wave': 1900,
  'idle-listen': 2400,
  'idle-stretch': 2200,
  'idle-sway': 2400,
  'idle-twirl': 2000,
  'idle-bounce': 1800,
  'idle-kick': 1800,
  'idle-look': 2200,
  'idle-salute': 1800,
  'idle-dance': 2600,
  'idle-skate': 2600,
  'idle-cape': 2200,
  'idle-spin': 2200,
  'idle-shrug': 1900,
  'idle-peek': 1900,
};

const RiggedMascot: React.FC<{
  skin: Skin;
  animation?: MascotAnimation;
  animationKey?: number;
}> = ({ skin, animation = 'idle', animationKey = 0 }) => {
  const id = skin === 'customer' ? 'cust' : 'adm';
  const s = SKINS[skin];
  const glow = `url(#${id}${s.glow})`;
  const [current, setCurrent] = useState<MascotAnimation>('idle');

  // Sustained cues persist; one-shot gestures auto-return to idle.
  useEffect(() => {
    setCurrent(animation);
    const ms = GESTURE_MS[animation];
    if (ms) {
      const t = setTimeout(() => setCurrent('idle'), ms);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [animation, animationKey]);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 500 680"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-anim={current}
      data-skin={skin}
    >
      <style>{`
        .rig-root { animation: rig-float 5s cubic-bezier(.45,0,.55,1) infinite; transform-box: fill-box; transform-origin: center bottom; }
        .rig-eyes { animation: rig-blink 5.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .rig-antenna-ball { animation: rig-glow 2.2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .rig-cape { animation: rig-cape 6s ease-in-out infinite; transform-box: fill-box; transform-origin: top center; }
        .rig-leg-l { animation: rig-dangle 5s ease-in-out infinite; transform-box: fill-box; transform-origin: top center; }
        .rig-leg-r { animation: rig-dangle 5s ease-in-out .4s infinite; transform-box: fill-box; transform-origin: top center; }
        .rig-think { opacity: 0; transition: opacity .25s; }
        .rig-brows, .rig-head, .rig-arm-r, .rig-arm-l, .rig-mouth, .rig-hp-logo, .rig-torso { transform-box: fill-box; }
        .rig-head { transform-origin: center bottom; }
        .rig-brows { transform-origin: center; }
        .rig-arm-r, .rig-arm-l { transform-origin: center top; }
        svg[data-skin="customer"] .rig-arm-r { transform-origin: center bottom; }
        .rig-mouth { transform-origin: center; }
        .rig-torso { transform-origin: center top; }
        .rig-hp-logo { transform-origin: center; }
        .rig-skateboard, .rig-soundmarks { opacity: 0; }

        @keyframes rig-float { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-10px) rotate(.6deg)} }
        @keyframes rig-blink { 0%,92%,100%{transform:scaleY(1)} 96%{transform:scaleY(.08)} }
        @keyframes rig-glow { 0%,100%{opacity:.85; transform:scale(1)} 50%{opacity:1; transform:scale(1.16)} }
        @keyframes rig-cape { 0%,100%{transform:rotate(0) skewX(0)} 50%{transform:rotate(1.6deg) skewX(-2.4deg)} }
        @keyframes rig-dangle { 0%,100%{transform:rotate(-2.5deg)} 50%{transform:rotate(2.5deg)} }
        @keyframes rig-breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.015,1.025)} }
        @keyframes rig-wave { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-18deg)} 60%{transform:rotate(12deg)} }
        @keyframes rig-nod { 0%,100%{transform:rotate(0)} 30%{transform:rotate(6deg)} 65%{transform:rotate(-3deg)} }
        @keyframes rig-tilt { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
        @keyframes rig-talk { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.75)} }
        @keyframes rig-browraise { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes rig-celebrate { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-24px) scale(1.05)} 70%{transform:translateY(-6px) scale(1.02)} }
        @keyframes rig-hp { 0%,100%{opacity:.7; transform:scale(1)} 50%{opacity:1; transform:scale(1.15)} }
        @keyframes rig-dot { 0%,80%,100%{transform:scale(.4); opacity:.4} 40%{transform:scale(1); opacity:1} }
        @keyframes rig-sway { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
        @keyframes rig-twirl { 0%,100%{transform:rotate(0) translateY(0)} 35%{transform:rotate(-12deg) translateY(-8px)} 70%{transform:rotate(12deg) translateY(-5px)} }
        @keyframes rig-kick-l { 0%,100%{transform:rotate(-2deg)} 45%{transform:rotate(-22deg)} }
        @keyframes rig-kick-r { 0%,100%{transform:rotate(2deg)} 55%{transform:rotate(22deg)} }
        @keyframes rig-look { 0%,100%{transform:translateX(0)} 30%{transform:translateX(8px)} 65%{transform:translateX(-7px)} }
        @keyframes rig-stretch-l { 0%,100%{transform:rotate(0)} 45%{transform:rotate(28deg)} }
        @keyframes rig-stretch-r { 0%,100%{transform:rotate(0)} 45%{transform:rotate(-28deg)} }
        @keyframes rig-peek { 0%,100%{transform:rotate(0) translateX(0)} 45%{transform:rotate(-8deg) translateX(-7px)} }
        @keyframes rig-skate { 0%,100%{transform:translateX(0) rotate(0)} 30%{transform:translateX(-12px) rotate(-5deg)} 70%{transform:translateX(12px) rotate(5deg)} }
        @keyframes rig-salute { 0%,100%{transform:rotate(0)} 35%,75%{transform:rotate(-45deg)} }
        @keyframes rig-shrug { 0%,100%{transform:rotate(0)} 40%,75%{transform:rotate(-14deg)} }

        .rig-torso { animation: rig-breathe 4.5s ease-in-out infinite; }
        svg[data-anim="talk"] .rig-mouth { animation: rig-talk .34s ease-in-out infinite; }
        svg[data-anim="think"] .rig-head { animation: rig-tilt 3s ease-in-out infinite; }
        svg[data-anim="think"] .rig-think { opacity: 1; }
        svg[data-anim="alert"] .rig-brows { animation: rig-browraise .5s ease-in-out infinite; }
        svg[data-anim="nod"] .rig-head { animation: rig-nod .7s ease-in-out 2; }
        svg[data-anim="celebrate"] .rig-root { animation: rig-celebrate .95s ease-in-out 2; }
        svg[data-anim="point"] .rig-arm-r { animation: rig-wave 1s ease-in-out 2; }
        svg[data-skin="customer"][data-anim="wave"] .rig-arm-r { animation: rig-wave .8s ease-in-out 3; }
        svg[data-skin="admin"][data-anim="wave"] .rig-head { animation: rig-nod .8s ease-in-out 2; }
        svg[data-skin="admin"] .rig-hp-logo { animation: rig-hp 2s ease-in-out infinite; }
        .rig-think circle:nth-child(1){ animation: rig-dot 1.3s infinite; }
        .rig-think circle:nth-child(2){ animation: rig-dot 1.3s .2s infinite; }
        .rig-think circle:nth-child(3){ animation: rig-dot 1.3s .4s infinite; }
        svg[data-anim="idle-wave"] .rig-arm-r { animation: rig-wave .55s ease-in-out 3; }
        svg[data-anim="idle-listen"] .rig-head { animation: rig-nod .8s ease-in-out 2; }
        svg[data-anim="idle-listen"] .rig-soundmarks { opacity: 1; animation: rig-glow .8s ease-in-out 3; }
        svg[data-anim="idle-stretch"] .rig-arm-l { animation: rig-stretch-l .9s ease-in-out 2; }
        svg[data-anim="idle-stretch"] .rig-arm-r { animation: rig-stretch-r .9s ease-in-out 2; }
        svg[data-anim="idle-sway"] .rig-root { animation: rig-sway 1.2s ease-in-out 2; }
        svg[data-anim="idle-twirl"] .rig-root { animation: rig-twirl 1s ease-in-out 2; }
        svg[data-anim="idle-bounce"] .rig-root { animation: rig-celebrate .8s ease-in-out 2; }
        svg[data-anim="idle-kick"] .rig-leg-l { animation: rig-kick-l .7s ease-in-out 2; }
        svg[data-anim="idle-kick"] .rig-leg-r { animation: rig-kick-r .7s ease-in-out 2; }
        svg[data-anim="idle-look"] .rig-eye-l,
        svg[data-anim="idle-look"] .rig-eye-r { animation: rig-look .7s ease-in-out 3; }
        svg[data-anim="idle-salute"] .rig-arm-r { animation: rig-salute .8s ease-in-out 2; }
        svg[data-anim="idle-dance"] .rig-root { animation: rig-sway .55s ease-in-out 4; }
        svg[data-anim="idle-dance"] .rig-arm-r,
        svg[data-anim="idle-dance"] .rig-arm-l { animation: rig-wave .55s ease-in-out 4; }
        svg[data-anim="idle-skate"] .rig-root { animation: rig-skate .8s ease-in-out 3; }
        svg[data-anim="idle-skate"] .rig-skateboard { opacity: 1; }
        svg[data-anim="idle-cape"] .rig-cape { animation: rig-cape .55s ease-in-out 4; }
        svg[data-anim="idle-spin"] .rig-root { animation: rig-twirl .65s ease-in-out 3; }
        svg[data-anim="idle-shrug"] .rig-arm-r,
        svg[data-anim="idle-shrug"] .rig-arm-l { animation: rig-shrug .8s ease-in-out 2; }
        svg[data-anim="idle-peek"] .rig-head { animation: rig-peek .7s ease-in-out 2; }
      `}</style>

      <Defs id={id} skin={s} />

      <g className="rig-root">
        <g className="rig-skateboard" transform="translate(250,612)">
          <path d="M-112 -8 Q-120 0 -112 8 L112 8 Q120 0 112 -8 Z" fill="#7C3AED" stroke="#FACC15" strokeWidth="5" />
          <circle cx="-76" cy="13" r="10" fill="#F472B6" stroke="#E2E8F0" strokeWidth="3" />
          <circle cx="76" cy="13" r="10" fill="#F472B6" stroke="#E2E8F0" strokeWidth="3" />
          <path d="M-42 -3h84" stroke="#E9D5FF" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* Ground shadow */}
        <ellipse cx="250" cy="658" rx="116" ry="13" fill="#0B1120" opacity="0.18" filter={`url(#${id}Soft)`} />

        {/* Cape (customer only) — windswept hero cape sweeping up to one side */}
        {s.hasCape && (
          <g className="rig-cape">
            <path
              d="M 300 298 C 250 286, 190 286, 170 292 C 110 300, 66 274, 48 304
                 C 34 334, 52 380, 58 424 C 50 456, 78 470, 74 502
                 C 104 486, 122 512, 146 520 C 174 504, 196 528, 224 524
                 C 256 518, 268 470, 272 420 C 282 372, 292 332, 300 298 Z"
              fill={`url(#${id}Cape)`}
              filter={`url(#${id}Drop)`}
            />
            {/* fold ridges fanning from the shoulder to the hem */}
            <path d="M 266 302 C 220 330, 130 348, 72 484" stroke="#00000022" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M 278 304 C 250 346, 196 388, 150 512" stroke="#0000001c" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 288 306 C 278 352, 254 420, 230 514" stroke="#00000016" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 190 294 C 120 310, 66 316, 50 404" stroke="#FFFFFF" strokeOpacity="0.09" strokeWidth="9" strokeLinecap="round" fill="none" />
            <g transform="translate(150, 426)" opacity="0.82">
              <FamilyCrest scale={1.05} />
            </g>
          </g>
        )}

        {/* ---------- BODY ---------- */}
        <g className="rig-body">
          {/* Legs — jogger pants with side stripe + ribbed ankle cuff */}
          <g className="rig-leg-l">
            <rect x="192" y="468" width="44" height="88" rx="20" fill={`url(#${id}${s.pants})`} stroke="#0B0A1F" strokeWidth="2" />
            <path d="M 200 490 L 200 536" stroke={s.stripe} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
            <path d="M 210 490 L 210 536" stroke={s.shoeAccent} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            <rect x="189" y="544" width="48" height="17" rx="7" fill={skin === 'admin' ? '#0A1526' : '#5B21B6'} stroke="#0B0A1F" strokeWidth="1.5" />
            <path d="M 197 547 L 197 558 M 207 547 L 207 558 M 217 547 L 217 558 M 227 547 L 227 558" stroke="#00000055" strokeWidth="2" />
          </g>
          <g className="rig-leg-r">
            <rect x="264" y="468" width="44" height="88" rx="20" fill={`url(#${id}${s.pants})`} stroke="#0B0A1F" strokeWidth="2" />
            <path d="M 300 490 L 300 536" stroke={s.stripe} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
            <path d="M 290 490 L 290 536" stroke={s.shoeAccent} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            <rect x="263" y="544" width="48" height="17" rx="7" fill={skin === 'admin' ? '#0A1526' : '#5B21B6'} stroke="#0B0A1F" strokeWidth="1.5" />
            <path d="M 271 547 L 271 558 M 281 547 L 281 558 M 291 547 L 291 558 M 301 547 L 301 558" stroke="#00000055" strokeWidth="2" />
          </g>

          {/* Sneakers */}
          <g className="rig-shoe-l" transform="translate(207,578) scale(0.82)">
            <Sneaker accent={s.shoeAccent} soleId={id} flip />
          </g>
          <g className="rig-shoe-r" transform="translate(289,578) scale(0.82)">
            <Sneaker accent={s.shoeAccent} soleId={id} />
          </g>

          {/* Left arm — down at side with a fingered hand (both skins) */}
          <g className="rig-arm-l">
            <path d="M 162 316 Q 120 352, 122 448" stroke={`url(#${id}${s.hoodieGrad})`} strokeWidth="40" strokeLinecap="round" fill="none" filter={`url(#${id}Drop)`} />
            <path d="M 150 330 Q 120 360, 122 440" stroke={s.stripe} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M 158 322 Q 128 352, 130 430" stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="7" strokeLinecap="round" fill="none" />
            <rect x="104" y="430" width="36" height="16" rx="7" fill={s.cuff} stroke="#CBD5E1" strokeWidth="1.5" transform="rotate(6 122 438)" />
            <g className="rig-hand-l" transform="translate(120,468)">
              <FistHand fill={s.glove} stroke={s.gloveStroke} />
            </g>
          </g>

          {/* Torso / hoodie */}
          <g className="rig-torso">
            {/* hood lining behind neck */}
            <path d="M 184 302 Q 250 274, 316 302 Q 298 320, 250 320 Q 202 320, 184 302 Z" fill={s.hoodLining} opacity="0.9" />
            <path
              d="M 158 300 C 196 288, 304 288, 342 300 C 366 358, 372 430, 352 496
                 C 300 508, 200 508, 148 496 C 128 430, 134 358, 158 300 Z"
              fill={`url(#${id}${s.hoodieGrad})`}
              filter={`url(#${id}Drop)`}
            />
            {/* soft left highlight for volume */}
            <path d="M 178 312 C 160 362, 158 438, 174 488" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="14" strokeLinecap="round" fill="none" />
            {/* hood collar edge */}
            <path d="M 186 304 Q 250 332, 314 304" fill="none" stroke="#00000030" strokeWidth="5" />
            {/* ribbed hem */}
            <path d="M 150 488 Q 250 504, 350 488 L 350 502 Q 250 518, 150 502 Z" fill="#00000026" />
            <path d="M 172 496 L 172 508 M 192 499 L 192 511 M 212 501 L 212 513 M 232 502 L 232 514 M 252 502 L 252 514 M 272 501 L 272 513 M 292 499 L 292 511 M 312 496 L 312 508 M 332 493 L 332 505" stroke="#00000030" strokeWidth="2" />
            {skin === 'admin' ? (
              <>
                {/* centre zipper */}
                <path d="M 250 320 L 250 488" stroke={s.headphoneRim} strokeWidth="4" />
                <path d="M 245 334 L 255 334 M 245 350 L 255 350 M 245 366 L 255 366 M 245 382 L 255 382 M 245 398 L 255 398 M 245 414 L 255 414 M 245 430 L 255 430" stroke="#0A1526" strokeWidth="2.5" />
                {/* raglan accent lines */}
                <path d="M 170 318 Q 210 302, 250 302" stroke={s.shoeAccent} strokeWidth="3.5" fill="none" opacity="0.85" />
                <path d="M 330 318 Q 290 302, 250 302" stroke={s.stripe} strokeWidth="3.5" fill="none" opacity="0.85" />
              </>
            ) : (
              <>
                {/* kangaroo pocket */}
                <path d="M 192 432 Q 250 448, 308 432 L 300 482 Q 250 494, 200 482 Z" fill="#00000020" stroke="#00000016" strokeWidth="2" />
                {/* drawstrings */}
                <path d="M 232 302 L 232 356" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.92" />
                <path d="M 268 302 L 268 350 L 278 362" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.92" />
                <circle cx="232" cy="359" r="4.5" fill="#FFFFFF" opacity="0.92" />
                <circle cx="279" cy="365" r="4.5" fill="#FFFFFF" opacity="0.92" />
              </>
            )}


            {/* Chest emblem / badge */}
            {s.hasBadge ? (
              <g className="rig-badge">
                <path d="M 230 300 L 244 360" stroke={s.stripe} strokeWidth="6" />
                <path d="M 270 300 L 256 360" stroke={s.stripe} strokeWidth="6" />
                <g transform="translate(188, 358)" filter={`url(#${id}Drop)`}>
                  <rect x="0" y="0" width="124" height="86" rx="13" fill="#0A101E" stroke={s.stripe} strokeWidth="3" />
                  <text x="62" y="28" textAnchor="middle" fill={s.stripe} fontSize="21" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="1">AI</text>
                  <text x="62" y="49" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="0.5">INTERN</text>
                  <text x="62" y="67" textAnchor="middle" fill={s.brow} fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.5">ASSISTANT</text>
                </g>
              </g>
            ) : (
              <g className="rig-emblem" transform="translate(250, 392)">
                <FamilyCrest scale={1.2} />
              </g>
            )}
          </g>

          {/* Right arm — customer waves (raised); admin tucks hand in pocket */}
          {s.pose === 'wave' ? (
            <g className="rig-arm-r">
              <path d="M 338 302 Q 420 272, 442 158" stroke={`url(#${id}${s.hoodieGrad})`} strokeWidth="40" strokeLinecap="round" fill="none" filter={`url(#${id}Drop)`} />
              <path d="M 352 302 Q 426 276, 446 166" stroke={s.stripe} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
              <rect x="424" y="150" width="36" height="16" rx="7" fill={s.cuff} stroke="#CBD5E1" strokeWidth="1.5" transform="rotate(-10 442 158)" />
              <g className="rig-hand-r" transform="translate(445,116)">
                <OpenHand fill={s.glove} stroke={s.gloveStroke} />
                <g transform="translate(0,4)"><HeartLogo color="#FFFFFF" scale={0.72} /></g>
              </g>
            </g>
          ) : (
            <g className="rig-arm-r">
              <path d="M 338 316 Q 380 352, 378 448" stroke={`url(#${id}${s.hoodieGrad})`} strokeWidth="40" strokeLinecap="round" fill="none" filter={`url(#${id}Drop)`} />
              <path d="M 350 330 Q 380 360, 378 440" stroke={s.stripe} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
              <path d="M 342 322 Q 372 352, 370 430" stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="7" strokeLinecap="round" fill="none" />
              <rect x="360" y="430" width="36" height="16" rx="7" fill={s.cuff} stroke="#CBD5E1" strokeWidth="1.5" transform="rotate(-6 378 438)" />
              <g className="rig-hand-r" transform="translate(380,468)">
                <FistHand fill={s.glove} stroke={s.gloveStroke} />
              </g>
            </g>
          )}
        </g>

        {/* ---------- HEAD ---------- */}
        <g className="rig-head">
          {/* Antenna */}
          <g className="rig-antenna">
            <path d="M 250 70 Q 258 40, 282 24" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle className="rig-antenna-ball" cx="284" cy="22" r="15" fill={s.antenna} filter={glow} />
            <circle cx="279" cy="17" r="5" fill="#FFFFFF" opacity="0.65" />
          </g>

          {/* Helmet */}
          <rect className="rig-helmet" x="104" y="56" width="292" height="244" rx="108" fill={`url(#${id}Helmet)`} stroke="#AEB9C8" strokeWidth="4" filter={`url(#${id}Drop)`} />
          {/* top specular highlight */}
          <ellipse cx="196" cy="108" rx="62" ry="30" fill="#FFFFFF" opacity="0.55" filter={`url(#${id}Soft)`} />

          {/* Over-ear headphones: band worn over the crown + big ear cups */}
          <path d="M 120 150 C 120 92, 180 66, 250 66 C 320 66, 380 92, 380 150" stroke={s.headphone} strokeWidth="22" fill="none" strokeLinecap="round" />
          <path d="M 120 150 C 120 92, 180 66, 250 66 C 320 66, 380 92, 380 150" stroke={s.headphoneRim} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4" />
          <g className="rig-hp-l">
            {/* yoke from band into cup */}
            <path d="M 120 148 L 112 176" stroke={s.headphone} strokeWidth="15" strokeLinecap="round" />
            {/* padded ear cup hugging the head */}
            <rect x="86" y="168" width="56" height="94" rx="27" fill={s.headphone} stroke={s.headphoneRim} strokeWidth="4" filter={`url(#${id}Drop)`} />
            <ellipse cx="114" cy="215" rx="18" ry="29" fill="#0A101E" stroke={s.headphoneRim} strokeWidth="2.5" />
            <g transform="translate(114,215)" className="rig-hp-logo">
              {s.logo === 'heart' ? <HeartLogo color="#FFFFFF" scale={0.7} /> : <WaveLogo color={s.headphoneRim} scale={0.85} />}
            </g>
            <ellipse cx="100" cy="190" rx="7" ry="14" fill="#FFFFFF" opacity="0.2" />
          </g>
          <g className="rig-hp-r">
            <path d="M 380 148 L 388 176" stroke={s.headphone} strokeWidth="15" strokeLinecap="round" />
            <rect x="358" y="168" width="56" height="94" rx="27" fill={s.headphone} stroke={s.headphoneRim} strokeWidth="4" filter={`url(#${id}Drop)`} />
            <ellipse cx="386" cy="215" rx="18" ry="29" fill="#0A101E" stroke={s.headphoneRim} strokeWidth="2.5" />
            <g transform="translate(386,215)" className="rig-hp-logo">
              {s.logo === 'heart' ? <HeartLogo color="#FFFFFF" scale={0.7} /> : <WaveLogo color={s.headphoneRim} scale={0.85} />}
            </g>
            <g className="rig-soundmarks" transform="translate(424,148)" stroke={s.antenna} strokeWidth="5" strokeLinecap="round" fill="none">
              <path d="M0 0 Q12 -12 0 -24" />
              <path d="M10 6 Q28 -12 10 -30" />
            </g>
            <ellipse cx="372" cy="190" rx="7" ry="14" fill="#FFFFFF" opacity="0.2" />
          </g>

          {/* Face screen */}
          <rect className="rig-face" x="138" y="92" width="224" height="176" rx="78" fill={`url(#${id}Screen)`} stroke="#000000" strokeOpacity="0.3" strokeWidth="2" />
          <path d="M 162 108 A 150 150 0 0 1 338 108" stroke="#FFFFFF" strokeWidth="4" fill="none" opacity="0.16" />

          {/* Eyebrows — tapered droplet shape */}
          <g className="rig-brows">
            <path className="rig-brow-l" d="M 176 157 C 188 143, 214 141, 231 150 C 216 152, 192 155, 176 157 Z" fill={s.brow} filter={glow} />
            <path className="rig-brow-r" d="M 324 157 C 312 143, 286 141, 269 150 C 284 152, 308 155, 324 157 Z" fill={s.brow} filter={glow} />
          </g>

          {/* Eyes — white ring, coloured iris, black pupil */}
          <g className="rig-eyes">
            <g className="rig-eye-l">
              <circle cx="204" cy="190" r="33" fill={s.eye} opacity="0.35" filter={glow} />
              <circle cx="204" cy="190" r="30" fill="#FFFFFF" />
              <circle cx="204" cy="190" r="25" fill={`url(#${id}Iris)`} />
              <circle className="rig-pupil-l" cx="205" cy="191" r="10" fill="#05070F" />
              <circle cx="196" cy="181" r="7.5" fill="#FFFFFF" />
              <circle cx="211" cy="199" r="3.5" fill="#FFFFFF" opacity="0.85" />
            </g>
            <g className="rig-eye-r">
              <circle cx="296" cy="190" r="33" fill={s.eye} opacity="0.35" filter={glow} />
              <circle cx="296" cy="190" r="30" fill="#FFFFFF" />
              <circle cx="296" cy="190" r="25" fill={`url(#${id}Iris)`} />
              <circle className="rig-pupil-r" cx="295" cy="191" r="10" fill="#05070F" />
              <circle cx="288" cy="181" r="7.5" fill="#FFFFFF" />
              <circle cx="303" cy="199" r="3.5" fill="#FFFFFF" opacity="0.85" />
            </g>
          </g>

          {/* Cheeks (customer) */}
          {skin === 'customer' && (
            <>
              <circle cx="168" cy="224" r="10" fill="#EC4899" opacity="0.55" filter={`url(#${id}Soft)`} />
              <circle cx="332" cy="224" r="10" fill="#EC4899" opacity="0.55" filter={`url(#${id}Soft)`} />
            </>
          )}

          {/* Mouth: open smile with tongue */}
          <g className="rig-mouth">
            <path d="M 222 220 Q 250 252 278 220 Z" fill="#7F1D1D" />
            <path d="M 233 232 Q 250 244 267 232 Z" fill="#EF4444" />
            <path d="M 222 220 Q 250 248 278 220" stroke={s.mouth} strokeWidth="5" strokeLinecap="round" fill="none" filter={glow} />
          </g>

          {/* Admin headset mic boom */}
          {skin === 'admin' && (
            <>
              <path d="M 118 210 Q 140 250, 176 248" stroke="#64748B" strokeWidth="5" strokeLinecap="round" fill="none" />
              <circle cx="181" cy="248" r="7" fill={s.antenna} filter={glow} />
            </>
          )}

          {/* Thinking dots (shown only during 'think') */}
          <g className="rig-think" transform="translate(372, 84)">
            <circle cx="0" cy="0" r="7" fill={s.bubbleAccent} />
            <circle cx="20" cy="-6" r="8" fill={s.bubbleAccent} />
            <circle cx="42" cy="-14" r="9" fill={s.bubbleAccent} />
          </g>
        </g>
      </g>
    </svg>
  );
};

export const CustomerMascotSVG: React.FC<{ animation?: MascotAnimation; animationKey?: number }> = (props) => (
  <RiggedMascot skin="customer" {...props} />
);

export const AdminMascotSVG: React.FC<{ animation?: MascotAnimation; animationKey?: number }> = (props) => (
  <RiggedMascot skin="admin" {...props} />
);
