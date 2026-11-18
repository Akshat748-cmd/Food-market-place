import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  title: string;
  serifAccent?: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeading({
  title,
  serifAccent,
  subtitle,
  badge,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={cn('flex flex-col space-y-1.5', alignClasses[align], className)}>
      {badge && (
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#315B42] bg-[#EAF3ED] px-3 py-1 rounded-full border border-[#C5DEC9] mb-1">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2C1E14] font-sans">
        {title}{' '}
        {serifAccent && (
          <span className="font-serif italic font-normal text-[#66523B]">
            {serifAccent}
          </span>
        )}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-[#8A7662] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
