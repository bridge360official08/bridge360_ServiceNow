import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  label: string;
  description?: string;
}

export interface ProgressStepperProps {
  steps: StepItem[];
  currentStep: number; // 1-indexed
  onStepClick?: (step: number) => void;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 8px',
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-neutral-200)',
        marginBottom: '24px',
        overflowX: 'auto',
      }}
    >
      {steps.map((step, idx) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: onStepClick && isCompleted ? 'pointer' : 'default',
                opacity: !isCompleted && !isCurrent ? 0.6 : 1,
                minWidth: 'fit-content',
              }}
              onClick={() => onStepClick && isCompleted && onStepClick(step.id)}
            >
              {/* Circle Indicator */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all var(--transition-fast)',
                  backgroundColor: isCompleted
                    ? 'var(--color-success-solid)'
                    : isCurrent
                    ? 'var(--color-primary-600)'
                    : 'var(--color-neutral-100)',
                  color: isCompleted || isCurrent ? 'var(--color-white)' : 'var(--color-neutral-600)',
                  border: isCurrent
                    ? '2px solid var(--color-primary-100)'
                    : isCompleted
                    ? '2px solid var(--color-success-border)'
                    : '1px solid var(--color-neutral-300)',
                }}
              >
                {isCompleted ? <Check size={16} /> : step.id}
              </div>

              {/* Label */}
              <div>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: isCurrent ? 600 : 500,
                    color: isCurrent ? 'var(--color-navy-900)' : 'var(--color-navy-700)',
                    display: 'block',
                  }}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)', display: 'block' }}>
                    {step.description}
                  </span>
                )}
              </div>
            </div>

            {/* Connecting Line */}
            {idx < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  margin: '0 12px',
                  backgroundColor: isCompleted
                    ? 'var(--color-success-solid)'
                    : 'var(--color-neutral-200)',
                  minWidth: '24px',
                  transition: 'background-color var(--transition-fast)',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
