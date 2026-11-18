import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'golden' | 'olive' | 'flat';
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-card p-5 md:p-6 transition-all duration-200';

    const variantStyles = {
      default: 'bg-white border border-[#EBE1CF] shadow-warm text-[#2C1E14]',
      golden:
        'bg-white border-2 border-[#F8C45C]/70 shadow-warm relative overflow-hidden text-[#2C1E14]',
      olive: 'bg-[#263D2D] text-white shadow-warm',
      flat: 'bg-[#F8F3EA] border border-[#E6D9C5] text-[#2C1E14]',
    };

    const interactiveStyles = interactive
      ? 'hover:-translate-y-1 hover:shadow-warm-lg cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], interactiveStyles, className)}
        {...props}
      >
        {variant === 'golden' && (
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F8C45C]/10 rounded-bl-full pointer-events-none" />
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
