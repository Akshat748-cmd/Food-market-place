import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-semibold text-[#2C1E14]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full min-h-[44px] px-4 py-2.5 pr-10 rounded-xl bg-white border border-[#E4D7C0] text-[#2C1E14]',
              'transition-all duration-150 appearance-none focus:outline-none focus:border-[#F8C45C] focus:ring-2 focus:ring-[#F8C45C]/30',
              'disabled:bg-[#F8F3EA] disabled:text-[#A48E75] cursor-pointer text-base',
              error && 'border-[#C2410C] focus:border-[#C2410C] focus:ring-[#C2410C]/20',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A7662]">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select';
