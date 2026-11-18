'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export function Toast({
  type = 'info',
  title,
  message,
  onClose,
  className,
}: ToastProps) {
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-[#315B42]" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#D97706]" />,
    error: <AlertCircle className="w-5 h-5 text-[#C2410C]" />,
    info: <Info className="w-5 h-5 text-[#66523B]" />,
  };

  const borderMap = {
    success: 'border-l-4 border-l-[#315B42]',
    warning: 'border-l-4 border-l-[#D97706]',
    error: 'border-l-4 border-l-[#C2410C]',
    info: 'border-l-4 border-l-[#F8C45C]',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 bg-white rounded-xl shadow-warm-lg border border-[#E4D7C0] max-w-sm w-full',
        borderMap[type],
        className
      )}
    >
      <div className="shrink-0 mt-0.5">{iconMap[type]}</div>
      <div className="flex-1 pr-1">
        <h5 className="text-sm font-semibold text-[#2C1E14]">{title}</h5>
        {message && <p className="text-xs text-[#8A7662] mt-0.5">{message}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-[#8A7662] hover:text-[#2C1E14] p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
