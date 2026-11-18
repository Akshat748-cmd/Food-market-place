'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function Chip({
  label,
  selected = false,
  onClick,
  onRemove,
  icon,
  className,
}: ChipProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-150 select-none min-h-[36px]',
        onClick && 'cursor-pointer hover:border-[#D1BF9F]',
        selected
          ? 'bg-[#263D2D] text-white border border-[#263D2D] shadow-warm-xs'
          : 'bg-[#F1E8D8] text-[#66523B] border border-[#E0D1B8] hover:bg-[#E8DCB8]',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-black/10 text-inherit focus:outline-none"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
}
