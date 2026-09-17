import React from 'react';

interface Bridge360LogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  badgeText?: string;
  badgeColor?: string;
  badgeBg?: string;
  className?: string;
}

export const Bridge360Logo: React.FC<Bridge360LogoProps> = ({
  size = 36,
  showText = false,
  textColor = '#0F172A',
  badgeText,
  badgeColor = '#16A34A',
  badgeBg = '#DCFCE7',
  className = '',
}) => {
  return (
    <div
      className={`bridge360-logo-wrapper notranslate ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        userSelect: 'none',
        direction: 'ltr',
      }}
    >
      {/* Official Bridge360 Emblem SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          borderRadius: Math.round(size * 0.25),
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
          flexShrink: 0,
        }}
      >
        <defs>
          <linearGradient id="b360-bg-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="b360-arch-grad" x1="8" y1="36" x2="40" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#A5F3FC" />
          </linearGradient>

          <linearGradient id="b360-ring-grad" x1="10" y1="12" x2="38" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Outer Background Squircle */}
        <rect width="48" height="48" rx="12" fill="url(#b360-bg-grad)" />

        {/* 360 Degree Orbital Dynamic Ring */}
        <ellipse
          cx="24"
          cy="24"
          rx="17"
          ry="7"
          transform="rotate(-28 24 24)"
          stroke="url(#b360-ring-grad)"
          strokeWidth="2.5"
          strokeDasharray="4 2"
          strokeLinecap="round"
        />

        {/* The Gateway / Bridge Arch */}
        <path
          d="M 12 35 C 12 21, 36 21, 36 35"
          stroke="url(#b360-arch-grad)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Bridge Roadway Cable Lines */}
        <line x1="18" y1="26" x2="18" y2="34" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" opacity="0.85" />
        <line x1="24" y1="23" x2="24" y2="34" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.95" />
        <line x1="30" y1="26" x2="30" y2="34" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" opacity="0.85" />

        {/* Base Pillar Nodes */}
        <circle cx="12" cy="35" r="2.5" fill="#67E8F9" />
        <circle cx="36" cy="35" r="2.5" fill="#A5F3FC" />

        {/* Apex Compass Beacon of Protection */}
        <circle cx="24" cy="13" r="3" fill="#FFFFFF" />
        <circle cx="24" cy="13" r="5" stroke="#67E8F9" strokeWidth="1" opacity="0.7" />
      </svg>

      {/* Brand Text + Badge if requested */}
      {showText && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: `${Math.max(18, Math.round(size * 0.65))}px`,
              color: textColor,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Bridge<span style={{ color: '#2563EB' }}>360</span>
          </span>

          {badgeText && (
            <span
              style={{
                fontSize: '0.72rem',
                color: badgeColor,
                fontWeight: 700,
                background: badgeBg,
                padding: '2px 8px',
                borderRadius: '12px',
                letterSpacing: '0.04em',
                lineHeight: 1.4,
              }}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
