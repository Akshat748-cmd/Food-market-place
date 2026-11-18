'use client';

import React from 'react';
import { HeroAvatarIllustration, ChefIllustration, WaiterIllustration } from '@/components/illustrations';
import { cn } from '@/lib/utils';

export interface MascotProps {
  role?: 'assistant' | 'chef' | 'waiter';
  expression?: 'neutral' | 'happy' | 'thinking' | 'alert';
  size?: number;
  message?: string;
  onClick?: () => void;
  className?: string;
}

export function Mascot({
  role = 'assistant',
  expression = 'happy',
  size = 56,
  message,
  onClick,
  className,
}: MascotProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-3 select-none',
        onClick && 'cursor-pointer group',
        className
      )}
    >
      <div className="relative shrink-0 transition-transform duration-200 group-hover:scale-105">
        {role === 'assistant' && (
          <HeroAvatarIllustration
            size={size}
            showOnlineDot={true}
            expression={expression}
          />
        )}
        {role === 'chef' && <ChefIllustration size={size} />}
        {role === 'waiter' && <WaiterIllustration size={size} />}
      </div>

      {message && (
        <div className="relative bg-white border border-[#E4D7C0] rounded-2xl px-3.5 py-2 text-xs md:text-sm text-[#2C1E14] shadow-warm max-w-xs font-sans">
          {/* Speech bubble pointer notch */}
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-l border-b border-[#E4D7C0] rotate-45" />
          <span className="relative z-10 font-medium">{message}</span>
        </div>
      )}
    </div>
  );
}
