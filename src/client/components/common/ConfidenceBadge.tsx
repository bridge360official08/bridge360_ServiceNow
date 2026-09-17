import React from 'react';

export interface ConfidenceBadgeProps {
  score: number; // 0 to 100
  showLabel?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score, showLabel = true }) => {
  const getTheme = () => {
    if (score >= 85) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const theme = getTheme();

  const getStyles = (): React.CSSProperties => {
    switch (theme) {
      case 'success':
        return {
          backgroundColor: 'var(--color-success-bg)',
          color: 'var(--color-success-text)',
          border: '1px solid var(--color-success-border)',
        };
      case 'warning':
        return {
          backgroundColor: 'var(--color-warning-bg)',
          color: 'var(--color-warning-text)',
          border: '1px solid var(--color-warning-border)',
        };
      case 'error':
        return {
          backgroundColor: 'var(--color-error-bg)',
          color: 'var(--color-error-text)',
          border: '1px solid var(--color-error-border)',
        };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '2px 8px',
        fontSize: '11px',
        fontWeight: 600,
        borderRadius: 'var(--radius-xs)',
        fontVariantNumeric: 'tabular-nums',
        ...getStyles(),
      }}
      title={`AI Confidence Score: ${score}%`}
    >
      <span style={{ fontSize: '11px', fontWeight: 700 }}>{score}%</span>
      {showLabel && <span style={{ opacity: 0.85, fontWeight: 500 }}>conf.</span>}
    </span>
  );
};
