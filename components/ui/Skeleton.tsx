import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle' | 'text';
}

export function Skeleton({
  variant = 'rect',
  className,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    text: 'h-4 rounded-md',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-[#EFE5D3] relative overflow-hidden',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
