import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepItem {
  id: string | number;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
  onStepClick?: (stepIndex: number) => void;
}

export function Stepper({ steps, currentStep, className, onStepClick }: StepperProps) {
  return (
    <div className={cn('w-full py-2', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step indicator circle and label */}
              <div
                onClick={() => onStepClick && onStepClick(idx)}
                className={cn(
                  'flex flex-col items-center gap-1.5 cursor-pointer group select-none',
                  !onStepClick && 'cursor-default'
                )}
              >
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200',
                    isCompleted && 'bg-[#315B42] text-white shadow-warm-xs',
                    isCurrent && 'bg-[#F8C45C] text-[#2C1E14] ring-4 ring-[#F8C45C]/30 shadow-warm-sm',
                    !isCompleted && !isCurrent && 'bg-[#F1E8D8] text-[#8A7662] border border-[#E0D1B8]'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold text-center whitespace-nowrap hidden sm:block',
                    isCurrent ? 'text-[#2C1E14]' : isCompleted ? 'text-[#315B42]' : 'text-[#8A7662]'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line between steps */}
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-3 h-0.5 relative -top-3 sm:-top-3.5 bg-[#E4D7C0] overflow-hidden">
                  <div
                    className={cn(
                      'h-full bg-[#315B42] transition-all duration-300',
                      idx < currentStep ? 'w-full' : 'w-0'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
