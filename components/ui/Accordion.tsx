'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AccordionItemProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  subtitle,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#E4D7C0] rounded-2xl bg-white overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left bg-white hover:bg-cream-50 transition-colors focus:outline-none min-h-[52px]"
      >
        <div className="pr-4">
          <h4 className="text-base font-semibold text-[#2C1E14]">{title}</h4>
          {subtitle && <p className="text-xs text-[#8A7662] mt-0.5">{subtitle}</p>}
        </div>
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center bg-[#F1E8D8] text-[#66523B] shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 bg-[#F8C45C] text-[#2C1E14]'
          )}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="p-4 md:p-5 pt-0 border-t border-[#F1E8D8] text-sm text-[#66523B]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Accordion({
  items,
  className,
}: {
  items: AccordionItemProps[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => (
        <AccordionItem key={item.id} {...item} />
      ))}
    </div>
  );
}
