import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Styles map for clean CSS-in-JS style objects
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-primary-600)',
          color: 'var(--color-white)',
          border: '1px solid var(--color-primary-600)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--color-neutral-100)',
          color: 'var(--color-navy-800)',
          border: '1px solid var(--color-neutral-200)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-navy-800)',
          border: '1px solid var(--color-neutral-300)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-neutral-600)',
          border: '1px solid transparent',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-error-solid)',
          color: 'var(--color-white)',
          border: '1px solid var(--color-error-solid)',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '12px', height: '32px' };
      case 'lg':
        return { padding: '12px 24px', fontSize: '15px', height: '44px' };
      case 'md':
      default:
        return { padding: '8px 16px', fontSize: '13px', height: '36px' };
    }
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 500,
    borderRadius: 'var(--radius-sm)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.6 : 1,
    transition: 'all var(--transition-fast)',
    outline: 'none',
    boxShadow: variant === 'primary' ? 'var(--shadow-xs)' : 'none',
    ...getSizeStyles(),
    ...getVariantStyles(),
  };

  return (
    <button
      style={baseStyles}
      disabled={disabled || isLoading}
      className={`b360-btn ${className}`}
      {...props}
    >
      {isLoading ? (
        <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
