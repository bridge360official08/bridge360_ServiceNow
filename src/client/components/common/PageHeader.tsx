import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: string[];
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = ['Bridge360'],
  action,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '24px',
      }}
    >
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
          <ol style={{ display: 'flex', alignItems: 'center', gap: '6px', listStyle: 'none' }}>
            {breadcrumbs.map((crumb, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {idx > 0 && <span>/</span>}
                <span
                  style={{
                    color: idx === breadcrumbs.length - 1 ? 'var(--color-navy-900)' : 'inherit',
                    fontWeight: idx === breadcrumbs.length - 1 ? 500 : 400,
                  }}
                >
                  {crumb}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Main Title Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-navy-900)' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '13px', color: 'var(--color-neutral-500)', marginTop: '2px' }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};
