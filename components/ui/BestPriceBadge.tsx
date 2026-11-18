import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BestPriceBadgeProps {
  savingsAmount?: number;
  savingsPercent?: number;
  className?: string;
  variant?: 'subtle' | 'solid';
}

export function BestPriceBadge({
  savingsAmount,
  savingsPercent,
  className,
  variant = 'subtle',
}: BestPriceBadgeProps) {
  if (variant === 'solid') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-[#315B42] text-white shadow-warm-xs',
          className
        )}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#F8C45C]" />
        <span>Best City Price</span>
        {savingsPercent && (
          <span className="bg-[#244532] text-[#F8C45C] px-1.5 py-0.5 rounded-full text-[11px] font-bold">
            {savingsPercent}% OFF
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EAF3ED] text-[#315B42] border border-[#BBDBC2]',
        className
      )}
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-[#315B42]" />
      <span>Best Price</span>
      {savingsAmount !== undefined && (
        <span className="text-[#254A34] font-bold">
          (Save ₹{savingsAmount})
        </span>
      )}
    </span>
  );
}
