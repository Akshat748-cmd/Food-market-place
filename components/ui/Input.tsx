import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-[#2C1E14]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#8A7662] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-[#E4D7C0] text-[#2C1E14] placeholder-[#A48E75]',
              'transition-all duration-150 focus:outline-none focus:border-[#F8C45C] focus:ring-2 focus:ring-[#F8C45C]/30',
              'disabled:bg-[#F8F3EA] disabled:text-[#A48E75] disabled:cursor-not-allowed text-base',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-[#C2410C] focus:border-[#C2410C] focus:ring-[#C2410C]/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#8A7662] flex items-center">{rightIcon}</div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[#C2410C] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#8A7662]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
