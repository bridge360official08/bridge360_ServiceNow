import React from 'react';
import { BRIDGE360_EMBLEM, BRIDGE360_LOGO_FULL } from '../../assets/bridge360LogoAsset';

export interface Bridge360LogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  badgeText?: string;
  badgeColor?: string;
  badgeBg?: string;
  className?: string;
  variant?: 'emblem' | 'full';
  style?: React.CSSProperties;
}

export const Bridge360Logo: React.FC<Bridge360LogoProps> = ({
  size = 36,
  showText = false,
  textColor = '#0F172A',
  badgeText,
  badgeColor = '#16A34A',
  badgeBg = '#DCFCE7',
  className = '',
  variant = 'emblem',
  style,
}) => {
  if (variant === 'full') {
    return (
      <div
        className={`bridge360-logo-wrapper notranslate ${className}`}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          userSelect: 'none',
          direction: 'ltr',
          ...style,
        }}
      >
        <img
          src={BRIDGE360_LOGO_FULL}
          alt="Bridge360 - People • Services • Brighter Futures"
          style={{
            width: `${size}px`,
            height: 'auto',
            maxHeight: `${Math.round(size * 1.1)}px`,
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`bridge360-logo-wrapper notranslate ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        userSelect: 'none',
        direction: 'ltr',
        ...style,
      }}
    >
      {/* Official Bridge360 Emblem */}
      <img
        src={BRIDGE360_EMBLEM}
        alt="Bridge360 Emblem"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          boxShadow: '0 2px 10px rgba(2, 132, 199, 0.25)',
          background: '#FFFFFF',
          flexShrink: 0,
        }}
      />

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
            Bridge<span style={{ color: '#0284C7' }}>360</span>
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
