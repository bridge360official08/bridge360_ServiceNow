import React from 'react';

export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading system data...' }) => {
  return (
    <div
      style={{
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: 'var(--color-neutral-600)',
      }}
    >
      <span
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--color-neutral-200)',
          borderTopColor: 'var(--color-primary-600)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ fontSize: '13px', fontWeight: 500 }}>{message}</p>
    </div>
  );
};
