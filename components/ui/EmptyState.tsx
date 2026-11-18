import React from 'react';
import { ChefHatIllustration } from '@/components/illustrations';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  illustration?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  illustration,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white/70 border border-[#EBE1CF] rounded-[24px] shadow-warm-xs',
        className
      )}
    >
      <div className="mb-4">
        {illustration || <ChefHatIllustration size={72} />}
      </div>
      <h3 className="text-xl font-bold text-[#2C1E14] font-sans mb-1.5">{title}</h3>
      <p className="text-sm text-[#8A7662] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
