'use client';

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useScrollLock } from '@/hooks/useScrollLock';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  useScrollLock(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overscroll-contain">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2C1E14]/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={cn(
              'relative z-10 w-full max-w-xl bg-white border border-[#E4D7C0]',
              'rounded-t-[28px] sm:rounded-3xl shadow-warm-xl',
              'max-h-[90dvh] flex flex-col overflow-hidden',
              className
            )}
          >
            {/* Sticky Header */}
            {(title || description) && (
              <div className="p-5 sm:p-6 border-b border-[#F1E8D8] bg-white flex items-start justify-between shrink-0">
                <div>
                  {title && (
                    <h3 className="text-xl font-bold text-[#2C1E14] font-sans">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs text-[#8A7662] mt-0.5">{description}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#F1E8D8] flex items-center justify-center text-[#66523B] hover:text-[#2C1E14] hover:bg-[#E4D7C0] transition-colors shrink-0 -mr-1 -mt-1"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Scrollable Body Only */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
              {children}
            </div>

            {/* Sticky Footer */}
            {footer && (
              <div className="p-4 sm:p-5 border-t border-[#F1E8D8] bg-[#FFFDF9] shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
