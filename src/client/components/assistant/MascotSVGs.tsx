import React, { useEffect, useState } from 'react';
import type { MascotAnimation } from '../../store/AssistantContext';

/**
 * One rigged skeleton, skinned two ways (customer "Guide" / admin "Intern").
 * Every body part is its own <g class="rig-*"> so it can be animated
 * independently. Animations are declarative CSS gated by the root svg's
 * `data-anim` (current cue) and `data-skin` (which character) attributes;
 * gestures auto-return to idle. Sustained cues (talk/think/alert) stay until
 * changed. Re-firing the same gesture is handled via `animationKey`.
 */

type Skin = 'customer' | 'admin';

interface SkinConfig {
  faceTop: string;
  faceBottom: string;
  brow: string;
  eye: string;
  eyeCore: string;
  glow: string;         // filter id suffix used for eyes/antenna
  antenna: string;
  headphone: string;
  headphoneRim: string;
  logo: 'heart' | 'wave';
  stripe: string;
  cuff: string;
  shoeAccent: string;
  mouth: string;
  hoodieGrad: string;   // gradient id suffix
  hasCape: boolean;
  hasBadge: boolean;
  pose: 'wave' | 'pockets';
  bubbleAccent: string;
}

const SKINS: Record<Skin, SkinConfig> = {
  customer: {
    faceTop: '#1E293B',
    faceBottom: '#020617',
    brow: '#C084FC',
    eye: '#A855F7',
    eyeCore: '#F5D0FE',
    glow: 'PurpleGlow',
    antenna: '#F472B6',
    headphone: '#7C3AED',
    headphoneRim: '#A78BFA',
    logo: 'heart',
    stripe: '#22D3EE',
    cuff: '#FFFFFF',
    shoeAccent: '#7C3AED',
    mouth: '#F9A8D4',
    hoodieGrad: 'CustHoodie',
    hasCape: true,
    hasBadge: false,
    pose: 'wave',
    bubbleAccent: '#8B5CF6',
  },
  admin: {
    faceTop: '#12325A',
    faceBottom: '#0A1A2F',
    brow: '#22D3EE',
    eye: '#38BDF8',
    eyeCore: '#E0F2FE',
    glow: 'CyanGlow',
    antenna: '#5EEAD4',
    headphone: '#0F213D',
    headphoneRim: '#22D3EE',
    logo: 'wave',
    stripe: '#A3E635',
    cuff: '#0F213D',
    shoeAccent: '#A3E635',
    mouth: '#7DD3FC',
    hoodieGrad: 'AdHoodie',
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

/** Stylised "W" / soundwave mark for the admin headphone cups. */
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

function Defs({ id, skin }: { id: string; skin: SkinConfig }) {
  return (
    <defs>
      {/* White glossy helmet */}
      <linearGradient id={id + 'Helmet'} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="18%" stopColor="#F8FAFC" />
        <stop offset="82%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>

      {/* Glossy face screen */}
      <linearGradient id={id + 'Screen'} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={skin.faceTop} />
        <stop offset="55%" stopColor={skin.faceBottom} />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>

      {/* Customer hoodie: purple -> blue -> pink */}
      <linearGradient id={id + 'CustHoodie'} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="45%" stopColor="#6366F1" />
        <stop offset="75%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>

      {/* Admin hoodie: deep navy */}
      <linearGradient id={id + 'AdHoodie'} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="45%" stopColor="#0F213D" />
        <stop offset="100%" stopColor="#060B16" />
      </linearGradient>

      {/* Customer cape gradient */}
      <linearGradient id={id + 'Cape'} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#C084FC" />
        <stop offset="55%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>

      <filter id={id + 'CyanGlow'} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={id + 'PurpleGlow'} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4.5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={id + 'Drop'} x="-20%" y="-15%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.22" />
      </filter>
    </defs>
  );
}

const GESTURE_MS: Partial<Record<MascotAnimation, number>> = {
  wave: 1700,
  nod: 1400,
  point: 1800,
  celebrate: 1900,
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
        .rig-root { animation: rig-float 5s cubic-bezier(.45,0,.55,1) infinite; transform-box: fill-box; transform-origin: bottom center; }
        .rig-eyes { animation: rig-blink 5.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .rig-antenna-ball { animation: rig-glow 2.2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        .rig-cape { animation: rig-cape 6s ease-in-out infinite; transform-box: fill-box; transform-origin: top center; }
        .rig-think { opacity: 0; transition: opacity .25s; }
        .rig-brows, .rig-head, .rig-arm-r, .rig-mouth, .rig-hp-logo { transform-box: fill-box; }
        .rig-head { transform-origin: bottom center; }
        .rig-brows { transform-origin: center; }
        .rig-arm-r { transform-origin: top center; }
        .rig-mouth { transform-origin: center; }
        .rig-hp-logo { transform-origin: center; }

        @keyframes rig-float { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-9px) rotate(.7deg)} }
        @keyframes rig-blink { 0%,92%,100%{transform:scaleY(1)} 96%{transform:scaleY(.08)} }
        @keyframes rig-glow { 0%,100%{opacity:.85; transform:scale(1)} 50%{opacity:1; transform:scale(1.14)} }
        @keyframes rig-cape { 0%,100%{transform:rotate(0) skewX(0)} 50%{transform:rotate(1.5deg) skewX(-2deg)} }
        @keyframes rig-wave { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-16deg)} 60%{transform:rotate(10deg)} }
        @keyframes rig-nod { 0%,100%{transform:rotate(0)} 30%{transform:rotate(6deg)} 65%{transform:rotate(-3deg)} }
        @keyframes rig-tilt { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
        @keyframes rig-talk { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.7)} }
        @keyframes rig-browraise { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes rig-celebrate { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-22px) scale(1.05)} 70%{transform:translateY(-6px) scale(1.02)} }
        @keyframes rig-hp { 0%,100%{opacity:.7; transform:scale(1)} 50%{opacity:1; transform:scale(1.15)} }
        @keyframes rig-dot { 0%,80%,100%{transform:scale(.4); opacity:.4} 40%{transform:scale(1); opacity:1} }

        svg[data-anim="talk"] .rig-mouth { animation: rig-talk .34s ease-in-out infinite; }
        svg[data-anim="think"] .rig-head { animation: rig-tilt 3s ease-in-out infinite; }
        svg[data-anim="think"] .rig-think { opacity: 1; }
        svg[data-anim="alert"] .rig-brows { animation: rig-browraise .5s ease-in-out infinite; }
        svg[data-anim="nod"] .rig-head { animation: rig-nod .7s ease-in-out 2; }
        svg[data-anim="celebrate"] .rig-root { animation: rig-celebrate .95s ease-in-out 2; }
        svg[data-anim="point"] .rig-arm-r { animation: rig-wave 1s ease-in-out 2; }
        svg[data-skin="customer"][data-anim="wave"] .rig-arm-r { animation: rig-wave .8s ease-in-out 2; }
        svg[data-skin="admin"][data-anim="wave"] .rig-head { animation: rig-nod .8s ease-in-out 2; }
        svg[data-skin="admin"] .rig-hp-logo { animation: rig-hp 2s ease-in-out infinite; }
        .rig-think circle:nth-child(1){ animation: rig-dot 1.3s infinite; }
        .rig-think circle:nth-child(2){ animation: rig-dot 1.3s .2s infinite; }
        .rig-think circle:nth-child(3){ animation: rig-dot 1.3s .4s infinite; }
      `}</style>

      <Defs id={id} skin={s} />

      <g className="rig-root">
        {/* Ground shadow */}
        <ellipse cx="250" cy="652" rx="132" ry="13" fill="#0F172A" opacity="0.16" />

        {/* Cape (customer only) — behind everything */}
        {s.hasCape && (
          <g className="rig-cape">
            <path
              d="M 172 280 C 96 292, 52 372, 70 588 C 128 578, 200 570, 250 570 C 300 570, 372 578, 430 588 C 448 372, 404 292, 328 280 Z"
              fill={`url(#${id}Cape)`}
              filter={`url(#${id}Drop)`}
            />
            <g transform="translate(250, 452)" opacity="0.85">
              <FamilyCrest scale={1.15} />
            </g>
          </g>
        )}

        {/* ---------- BODY ---------- */}
        <g className="rig-body">
          {/* Legs */}
          <g className="rig-leg-l">
            <rect x="196" y="470" width="34" height="98" rx="16" fill={skin === 'customer' ? '#5B21B6' : '#0B1424'} stroke="#1E1B4B" strokeWidth="2" />
            <path d="M 200 492 L 200 556" stroke={s.stripe} strokeWidth="4.5" strokeLinecap="round" />
          </g>
          <g className="rig-leg-r">
            <rect x="270" y="470" width="34" height="98" rx="16" fill={skin === 'customer' ? '#5B21B6' : '#0B1424'} stroke="#1E1B4B" strokeWidth="2" />
            <path d="M 300 492 L 300 556" stroke={s.stripe} strokeWidth="4.5" strokeLinecap="round" />
          </g>

          {/* Shoes */}
          <g className="rig-shoe-l">
            <path d="M 176 556 L 232 556 C 238 578, 236 604, 204 614 C 172 614, 156 600, 158 578 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
            <path d="M 160 592 L 230 592" stroke={s.shoeAccent} strokeWidth="8" strokeLinecap="round" />
          </g>
          <g className="rig-shoe-r">
            <path d="M 268 556 L 324 556 C 344 578, 344 604, 296 614 C 264 604, 262 578, 268 556 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
            <path d="M 270 592 L 340 592" stroke={s.shoeAccent} strokeWidth="8" strokeLinecap="round" />
          </g>

          {/* Left arm (down) */}
          <g className="rig-arm-l">
            <path d="M 150 300 Q 108 330, 112 432" stroke={`url(#${id}Helmet)`} strokeWidth="34" strokeLinecap="round" fill="none" filter={`url(#${id}Drop)`} />
            <circle className="rig-hand-l" cx="114" cy="432" r="17" fill={s.cuff} stroke={skin === 'admin' ? '#1E293B' : '#E2E8F0'} strokeWidth="2" />
          </g>

          {/* Torso / hoodie */}
          <g className="rig-torso">
            <path
              d="M 150 268 C 180 266, 320 266, 350 268 C 376 340, 376 416, 356 486 C 300 496, 200 496, 144 486 C 124 416, 124 340, 150 268 Z"
              fill={`url(#${id}${s.hoodieGrad})`}
              filter={`url(#${id}Drop)`}
            />
            {/* Hood collar */}
            <path d="M 176 270 Q 250 300, 324 270" fill="none" stroke="#00000030" strokeWidth="6" />
            {/* Drawstrings */}
            <path d="M 226 286 L 226 344" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
            <path d="M 274 286 L 274 330 L 284 344" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />

            {/* Chest emblem / badge */}
            {s.hasBadge ? (
              <g className="rig-badge">
                {/* Lanyard */}
                <path d="M 226 286 L 244 352" stroke={s.stripe} strokeWidth="6" />
                <path d="M 274 286 L 256 352" stroke={s.stripe} strokeWidth="6" />
                <g transform="translate(186, 350)" filter={`url(#${id}Drop)`}>
                  <rect x="0" y="0" width="128" height="92" rx="13" fill="#0A101E" stroke={s.stripe} strokeWidth="3" />
                  <text x="64" y="30" textAnchor="middle" fill={s.stripe} fontSize="22" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="1">AI</text>
                  <text x="64" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="0.5">INTERN</text>
                  <text x="64" y="71" textAnchor="middle" fill={s.brow} fontSize="10.5" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="0.5">ASSISTANT</text>
                  {/* sound-wave strip */}
                  <g transform="translate(64,84)">
                    <rect x="-24" y="-3" width="4" height="6" rx="2" fill={s.stripe} />
                    <rect x="-15" y="-6" width="4" height="12" rx="2" fill={s.stripe} />
                    <rect x="-6" y="-9" width="4" height="18" rx="2" fill={s.stripe} />
                    <rect x="3" y="-6" width="4" height="12" rx="2" fill={s.stripe} />
                    <rect x="12" y="-3" width="4" height="6" rx="2" fill={s.stripe} />
                  </g>
                </g>
              </g>
            ) : (
              <g className="rig-emblem" transform="translate(250, 384)">
                <FamilyCrest scale={1.15} />
              </g>
            )}
          </g>

          {/* Right arm — customer waves (raised), admin tucks hand in pocket */}
          {s.pose === 'wave' ? (
            <g className="rig-arm-r">
              <path d="M 350 300 Q 402 300, 420 208" stroke={`url(#${id}Helmet)`} strokeWidth="34" strokeLinecap="round" fill="none" filter={`url(#${id}Drop)`} />
              <circle cx="420" cy="208" r="17" fill={s.cuff} stroke="#E2E8F0" strokeWidth="2" />
              <g className="rig-hand-r">
                <circle cx="420" cy="196" r="23" fill="#5B21B6" />
                <g transform="translate(420,196)">
                  <HeartLogo color="#FFFFFF" scale={0.95} />
                </g>
              </g>
            </g>
          ) : (
            <g className="rig-arm-r">
              <path d="M 350 300 Q 392 330, 388 432" stroke={`url(#${id}Helmet)`} strokeWidth="34" strokeLinecap="round" fill="none" filter={`url(#${id}Drop)`} />
              {/* hand tucked into pocket */}
              <path d="M 348 402 Q 316 388, 300 440" stroke="#0B1424" strokeWidth="18" strokeLinecap="round" fill="none" />
              <path d="M 152 402 Q 184 388, 200 440" stroke="#0B1424" strokeWidth="18" strokeLinecap="round" fill="none" />
              <circle className="rig-hand-r" cx="388" cy="432" r="17" fill={s.cuff} stroke="#1E293B" strokeWidth="2" />
            </g>
          )}
        </g>

        {/* ---------- HEAD ---------- */}
        <g className="rig-head">
          {/* Antenna */}
          <g className="rig-antenna">
            <path d="M 250 82 Q 256 46, 276 26" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle className="rig-antenna-ball" cx="277" cy="22" r="15" fill={s.antenna} filter={glow} />
            <circle cx="273" cy="18" r="5" fill="#FFFFFF" opacity="0.6" />
          </g>

          {/* Headphone arch */}
          <path d="M 120 165 A 132 132 0 0 1 380 165" stroke={s.headphone} strokeWidth="16" fill="none" strokeLinecap="round" />

          {/* Helmet */}
          <rect className="rig-helmet" x="110" y="80" width="280" height="194" rx="72" fill={`url(#${id}Helmet)`} stroke="#94A3B8" strokeWidth="4" filter={`url(#${id}Drop)`} />

          {/* Headphone cups */}
          <g className="rig-hp-l">
            <rect x="92" y="132" width="34" height="88" rx="16" fill={s.headphone} stroke={s.headphoneRim} strokeWidth="3.5" />
            <g transform="translate(109,176)" className="rig-hp-logo">
              {s.logo === 'heart' ? <HeartLogo color="#FFFFFF" scale={0.7} /> : <WaveLogo color={s.headphoneRim} scale={0.9} />}
            </g>
          </g>
          <g className="rig-hp-r">
            <rect x="374" y="132" width="34" height="88" rx="16" fill={s.headphone} stroke={s.headphoneRim} strokeWidth="3.5" />
            <g transform="translate(391,176)" className="rig-hp-logo">
              {s.logo === 'heart' ? <HeartLogo color="#FFFFFF" scale={0.7} /> : <WaveLogo color={s.headphoneRim} scale={0.9} />}
            </g>
          </g>

          {/* Face screen (FIXED: was url(#admFace)) */}
          <rect className="rig-face" x="136" y="106" width="228" height="142" rx="48" fill={`url(#${id}Screen)`} />
          <path d="M 152 116 A 214 214 0 0 1 348 116" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity="0.14" />

          {/* Eyebrows */}
          <g className="rig-brows">
            <rect className="rig-brow-l" x="176" y="140" width="46" height="9" rx="4.5" fill={s.brow} transform="rotate(-8 199 144)" filter={glow} />
            <rect className="rig-brow-r" x="278" y="140" width="46" height="9" rx="4.5" fill={s.brow} transform="rotate(8 301 144)" filter={glow} />
          </g>

          {/* Eyes */}
          <g className="rig-eyes">
            <g className="rig-eye-l">
              <circle cx="199" cy="176" r="24" fill={s.eye} filter={glow} />
              <circle className="rig-pupil-l" cx="204" cy="174" r="10" fill="#0B1220" />
              <circle cx="196" cy="167" r="6" fill={s.eyeCore} />
            </g>
            <g className="rig-eye-r">
              <circle cx="301" cy="176" r="24" fill={s.eye} filter={glow} />
              <circle className="rig-pupil-r" cx="306" cy="174" r="10" fill="#0B1220" />
              <circle cx="298" cy="167" r="6" fill={s.eyeCore} />
            </g>
          </g>

          {/* Cheeks (customer) */}
          {skin === 'customer' && (
            <>
              <circle cx="168" cy="212" r="9" fill="#EC4899" opacity="0.6" filter={glow} />
              <circle cx="332" cy="212" r="9" fill="#EC4899" opacity="0.6" filter={glow} />
            </>
          )}

          {/* Mouth: smile with a red tongue */}
          <g className="rig-mouth">
            <path d="M 224 206 Q 250 236 276 206 Z" fill="#7F1D1D" />
            <path d="M 234 218 Q 250 230 266 218 Z" fill="#EF4444" />
            <path d="M 224 206 Q 250 232 276 206" stroke={s.mouth} strokeWidth="5" strokeLinecap="round" fill="none" filter={glow} />
          </g>

          {/* Admin headset mic boom */}
          {skin === 'admin' && (
            <>
              <path d="M 126 196 Q 142 232, 174 232" stroke="#64748B" strokeWidth="5" strokeLinecap="round" fill="none" />
              <circle cx="179" cy="232" r="6.5" fill={s.antenna} filter={glow} />
            </>
          )}

          {/* Thinking dots (shown only during 'think') */}
          <g className="rig-think" transform="translate(360, 96)">
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
