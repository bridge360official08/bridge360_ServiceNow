import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastNotification } from '../../types';

interface ToastContextType {
  showToast: (type: ToastNotification['type'], title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (type: ToastNotification['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastNotification = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="var(--color-success-solid)" />;
      case 'warning':
        return <AlertTriangle size={18} color="var(--color-warning-solid)" />;
      case 'error':
        return <AlertCircle size={18} color="var(--color-error-solid)" />;
      case 'info':
      default:
        return <Info size={18} color="var(--color-info-solid)" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '380px',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: 'var(--color-white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-neutral-200)',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <span style={{ marginTop: '2px', display: 'flex' }}>{getIcon(toast.type)}</span>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy-900)' }}>
                {toast.title}
              </h4>
              {toast.message && (
                <p style={{ fontSize: '12px', color: 'var(--color-neutral-600)', marginTop: '2px' }}>
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-neutral-400)',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
