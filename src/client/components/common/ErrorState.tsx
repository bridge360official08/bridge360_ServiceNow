import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'System Error',
  message,
  onRetry,
}) => {
  return (
    <div
      style={{
        padding: '32px 24px',
        backgroundColor: 'var(--color-error-bg)',
        border: '1px solid var(--color-error-border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '8px',
      }}
    >
      <AlertCircle size={32} color="var(--color-error-solid)" />
      <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-error-text)' }}>
        {title}
      </h4>
      <p style={{ fontSize: '13px', color: 'var(--color-error-text)', opacity: 0.9, maxWidth: '450px' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} style={{ marginTop: '8px' }}>
          Retry Request
        </Button>
      )}
    </div>
  );
};
