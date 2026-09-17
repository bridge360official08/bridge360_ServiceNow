import React from 'react';
import { ApplicationStatus, DocumentStatus } from '../../types';

export interface BadgeProps {
  status?: ApplicationStatus | DocumentStatus | string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ status, variant, children }) => {
  // Map application/document statuses to color themes
  const getTheme = () => {
    if (variant) return variant;

    switch (status) {
      case 'approved':
      case 'verified':
        return 'success';
      case 'needs_verification':
      case 'flagged':
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'processing':
      case 'extracted':
        return 'info';
      case 'draft':
      case 'uploaded':
      default:
        return 'neutral';
    }
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
      case 'info':
        return {
          backgroundColor: 'var(--color-info-bg)',
          color: 'var(--color-info-text)',
          border: '1px solid var(--color-info-border)',
        };
      case 'neutral':
      default:
        return {
          backgroundColor: 'var(--color-neutral-100)',
          color: 'var(--color-neutral-700)',
          border: '1px solid var(--color-neutral-200)',
        };
    }
  };

  const formatText = (txt: string) => {
    return txt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        fontSize: '11px',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        lineHeight: 1.2,
        letterSpacing: '0.02em',
        textTransform: 'capitalize',
        ...getStyles(),
      }}
    >
      <span 
        style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          backgroundColor: 'currentColor' 
        }} 
      />
      {children || (status ? formatText(status) : '')}
    </span>
  );
};
