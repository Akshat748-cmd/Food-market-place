import React from 'react';
import { formatCurrency, cn } from '@/lib/utils';

export interface PriceTagProps {
  amount: number;
  originalAmount?: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSavings?: boolean;
  className?: string;
}

export function PriceTag({
  amount,
  originalAmount,
  unit,
  size = 'md',
  showSavings = false,
  className,
}: PriceTagProps) {
  const sizeMap = {
    sm: 'text-sm font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl lg:text-4xl font-extrabold',
  };

  const hasSavings = originalAmount !== undefined && originalAmount > amount;
  const savings = hasSavings ? originalAmount - amount : 0;

  return (
    <div className={cn('inline-flex items-baseline gap-1.5 flex-wrap', className)}>
      <span className={cn('text-[#2C1E14] font-sans tracking-tight', sizeMap[size])}>
        {formatCurrency(amount)}
      </span>
      {unit && (
        <span className="text-xs text-[#8A7662] font-medium">/{unit}</span>
      )}
      {hasSavings && (
        <span className="text-xs text-[#A48E75] line-through font-normal">
          {formatCurrency(originalAmount)}
        </span>
      )}
      {showSavings && hasSavings && (
        <span className="text-xs font-bold text-[#315B42] bg-[#EAF3ED] px-1.5 py-0.5 rounded-md border border-[#BBDBC2]">
          Save {formatCurrency(savings)}
        </span>
      )}
    </div>
  );
}
