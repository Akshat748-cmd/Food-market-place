import React from 'react';
import { cn } from '@/lib/utils';

export interface ConfidenceDotsProps {
  score: number; // 0 to 100
  showLabel?: boolean;
  className?: string;
}

export function ConfidenceDots({ score, showLabel = true, className }: ConfidenceDotsProps) {
  // 3 dots:
  // >= 85: 3 dots (High Confidence)
  // 60-84: 2 dots (Medium Confidence)
  // < 60: 1 dot (Verify)
  const activeCount = score >= 85 ? 3 : score >= 60 ? 2 : 1;
  const label = score >= 85 ? 'High match' : score >= 60 ? 'Medium' : 'Needs review';
  const dotColor = score >= 85 ? 'bg-[#315B42]' : score >= 60 ? 'bg-[#D97706]' : 'bg-[#C2410C]';

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((dot) => (
          <span
            key={dot}
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              dot <= activeCount ? dotColor : 'bg-[#E4D7C0]'
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold text-[#8A7662]">
          {label} ({score}%)
        </span>
      )}
    </div>
  );
}
