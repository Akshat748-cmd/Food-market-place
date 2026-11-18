'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'flex border-b border-[#E4D7C0] gap-1 md:gap-4 overflow-x-auto no-scrollbar',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 py-3 px-3 text-sm md:text-base font-medium border-b-2 whitespace-nowrap transition-all duration-150 relative min-h-[44px]',
              isActive
                ? 'border-[#315B42] text-[#315B42] font-semibold'
                : 'border-transparent text-[#66523B] hover:text-[#2C1E14] hover:border-[#E0D1B8]'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-2 py-0.5 text-xs rounded-full font-bold',
                  isActive ? 'bg-[#315B42] text-white' : 'bg-[#F1E8D8] text-[#66523B]'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
