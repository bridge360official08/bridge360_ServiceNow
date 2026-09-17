import React from 'react';

export interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  statusDot?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', statusDot = false }) => {
  const getInitials = (n: string) => {
    const parts = n.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (n.substring(0, 2) || 'US').toUpperCase();
  };

  const getSizePx = () => {
    switch (size) {
      case 'sm': return 28;
      case 'lg': return 40;
      case 'md':
      default: return 34;
    }
  };

  const px = getSizePx();

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <div
        style={{
          width: `${px}px`,
          height: `${px}px`,
          borderRadius: '50%',
          backgroundColor: 'var(--color-navy-800)',
          color: 'var(--color-white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${Math.round(px * 0.4)}px`,
          fontWeight: 600,
          border: '1px solid var(--color-neutral-300)',
          userSelect: 'none',
        }}
      >
        {getInitials(name)}
      </div>

      {statusDot && (
        <span
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success-solid)',
            border: '2px solid var(--color-white)',
          }}
        />
      )}
    </div>
  );
};
