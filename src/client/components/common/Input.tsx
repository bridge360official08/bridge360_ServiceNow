import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  style,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      {label && (
        <label 
          htmlFor={inputId}
          style={{ 
            fontSize: '13px', 
            fontWeight: 500, 
            color: 'var(--color-navy-800)', 
            display: 'block' 
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {leftIcon && (
          <span style={{ position: 'absolute', left: '12px', color: 'var(--color-neutral-400)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          style={{
            width: '100%',
            height: '38px',
            paddingLeft: leftIcon ? '36px' : '12px',
            paddingRight: rightIcon ? '36px' : '12px',
            fontSize: '13px',
            color: 'var(--color-navy-900)',
            backgroundColor: 'var(--color-white)',
            border: `1px solid ${errorText ? 'var(--color-error-solid)' : 'var(--color-neutral-300)'}`,
            borderRadius: 'var(--radius-sm)',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            outline: 'none',
          }}
          className={className}
          {...props}
        />

        {rightIcon && (
          <span style={{ position: 'absolute', right: '12px', color: 'var(--color-neutral-400)', display: 'flex', alignItems: 'center' }}>
            {rightIcon}
          </span>
        )}
      </div>

      {errorText ? (
        <span style={{ fontSize: '12px', color: 'var(--color-error-text)' }}>{errorText}</span>
      ) : helperText ? (
        <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>{helperText}</span>
      ) : null}
    </div>
  );
};
