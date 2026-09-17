import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Inbox size={40} color="var(--color-neutral-400)" />,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-md)',
        border: '1px border-dashed var(--color-neutral-300)',
      }}
    >
      <div style={{ marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy-900)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--color-neutral-500)', maxWidth: '400px', margin: '6px 0 16px 0' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
