'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Carrot,
  Store,
  TrendingDown,
  PiggyBank,
  ShoppingBag,
  Sparkles,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeroAvatarIllustration } from '@/components/illustrations';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'Home', href: '/app', icon: LayoutDashboard, exact: true },
  { name: 'My Menu', href: '/app/menu', icon: UtensilsCrossed },
  { name: 'Find Suppliers', href: '/app/suppliers', icon: Store },
  { name: 'City Prices', href: '/app/city-prices', icon: TrendingDown },
  { name: 'Savings', href: '/app/savings', icon: PiggyBank },
  { name: 'Shopping List', href: '/app/shopping-list', icon: ShoppingBag },
  { name: 'AI Assistant', href: '/app/assistant', icon: Sparkles },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const isHydrated = useHydrated();
  const { getCurrentRestaurant } = useAppStore();
  const currentRestaurant = isHydrated ? getCurrentRestaurant() : null;

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-[100dvh] w-[264px] flex-col overflow-hidden bg-[#FFF9EF] border-r border-[#E4D7C0] select-none z-30 justify-between">
      {/* 1. Logo block (~72px compact) */}
      <div className="h-[72px] px-5 flex items-center border-b border-[#E4D7C0]/80 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full border border-[#66523B]/30 flex items-center justify-center p-1.5 bg-white transition-transform group-hover:scale-105 shadow-warm-xs">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full stroke-[#66523B]"
            >
              <path
                d="M10 16C8.5 15 8 13 8 11C8 8.5 10 6.5 13 6.5C13.5 6.5 14 6.7 14.5 7C15.2 5.5 16.8 4.5 18.5 4.5C20.8 4.5 22.5 6.2 22.5 8.5C22.5 8.8 22.4 9.1 22.3 9.4C23.9 10 25 11.5 25 13.5C25 15.5 23.5 17 21 17"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <rect x="9.5" y="17" width="13" height="6" rx="1.5" strokeWidth="1.8" />
              <path d="M13 17V23M16 17V23M19 17V23" strokeWidth="1.2" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-black tracking-widest text-[#2C1E14] uppercase font-sans">
              FOOD
            </span>
            <span className="text-[11px] font-bold tracking-wider text-[#66523B] uppercase font-sans">
              MARKET HUB
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Nav list: compact 44px items, 4px gap, 12px radius, icon 20px, label 15px */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 rounded-xl text-[15px] font-semibold transition-all duration-150 h-[44px] max-h-[760px]:h-[40px]',
                isActive
                  ? 'bg-[#F8C45C] text-[#263D2D] shadow-warm-xs font-bold'
                  : 'text-[#66523B] hover:bg-[#F1E8D8]/70 hover:text-[#2C1E14]'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-colors',
                  isActive ? 'text-[#263D2D]' : 'text-[#66523B]'
                )}
              />
              <span className="truncate">{item.name}</span>
              {item.name === 'AI Assistant' && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wide rounded bg-[#315B42] text-white shrink-0">
                  Live
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. Pinned Profile / Restaurant Card (Always fully visible, mt-auto) */}
      <div className="mt-auto px-3 pb-4 pt-2 border-t border-[#E4D7C0]/80 shrink-0">
        <Link
          href="/app/settings"
          className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E4D7C0] hover:border-[#F8C45C] hover:bg-[#FFFDF9] transition-all shadow-warm-xs group"
        >
          <div className="shrink-0">
            <HeroAvatarIllustration size={36} showOnlineDot={true} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-[#2C1E14] truncate group-hover:text-[#315B42]">
              {currentRestaurant?.name || 'Delhi Haveli'}
            </span>
            <span className="text-[11px] text-[#8A7662] truncate max-h-[760px]:hidden">
              {currentRestaurant?.cuisine || 'North Indian'} • Active
            </span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
