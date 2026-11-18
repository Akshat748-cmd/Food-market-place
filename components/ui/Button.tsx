'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-golden-dark disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] min-h-[44px]';

    const sizeStyles = {
      sm: 'text-sm px-3.5 py-1.5 rounded-lg gap-1.5',
      md: 'text-base px-5 py-2.5 rounded-xl gap-2 font-medium',
      lg: 'text-base md:text-lg px-7 py-3.5 rounded-2xl gap-2.5 font-semibold',
    };

    const variantStyles = {
      // Primary golden: exact color from approved hero
      primary:
        'bg-[#F8C45C] text-[#2C1E14] hover:bg-[#F5B93E] shadow-warm-sm hover:shadow-warm active:bg-[#EAA925]',
      // Secondary olive: deep restaurant green
      secondary:
        'bg-[#263D2D] text-white hover:bg-[#1E3023] shadow-warm-sm hover:shadow-warm active:bg-[#16241B]',
      // Ghost: transparent with warm hover
      ghost:
        'bg-transparent text-[#66523B] hover:bg-[#F1E8D8]/60 hover:text-[#2C1E14]',
      // Outline: subtle warm border
      outline:
        'bg-white/80 border border-[#E4D7C0] text-[#2C1E14] hover:bg-cream-200 hover:border-[#D1BF9F]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
