import React from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  errorText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  errorText,
  className = '',
  id,
  style,
  ...props
}) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      {label && (
        <label 
          htmlFor={selectId}
          style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-navy-800)' }}
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        style={{
          width: '100%',
          height: '38px',
          padding: '0 12px',
          fontSize: '13px',
          color: 'var(--color-navy-900)',
          backgroundColor: 'var(--color-white)',
          border: `1px solid ${errorText ? 'var(--color-error-solid)' : 'var(--color-neutral-300)'}`,
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          cursor: 'pointer',
        }}
        className={className}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {errorText && <span style={{ fontSize: '12px', color: 'var(--color-error-text)' }}>{errorText}</span>}
    </div>
  );
};
