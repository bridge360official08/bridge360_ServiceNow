import React from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  footer,
  children,
  className = '',
  style,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-neutral-200)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-xs)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
      className={`b360-card ${className}`}
    >
      {(title || headerAction) && (
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-neutral-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ fontSize: '12px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div style={{ padding: '20px', flex: 1 }}>{children}</div>

      {footer && (
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--color-neutral-50)',
            borderTop: '1px solid var(--color-neutral-200)',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
