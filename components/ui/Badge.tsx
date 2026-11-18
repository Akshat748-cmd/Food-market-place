import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'caution' | 'danger' | 'golden' | 'olive';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs md:text-sm px-2.5 py-1 rounded-lg font-medium',
  };

  const variantStyles = {
    default: 'bg-[#F1E8D8] text-[#66523B] border border-[#E0D1B8]',
    success: 'bg-[#EAF3ED] text-[#315B42] border border-[#C5DEC9]',
    caution: 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]',
    danger: 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]',
    golden: 'bg-[#FEF6E4] text-[#8C5D08] border border-[#F8C45C]/50',
    olive: 'bg-[#263D2D] text-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 leading-none transition-colors select-none',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
