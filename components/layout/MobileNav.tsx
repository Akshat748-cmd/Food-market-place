'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Store,
  PiggyBank,
  MoreHorizontal,
  Carrot,
  TrendingDown,
  ShoppingBag,
  Sparkles,
  Settings,
  X,
  RefreshCw,
  Percent,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeroAvatarIllustration } from '@/components/illustrations';
import { useAppStore } from '@/store/useAppStore';

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const { resetDemoData } = useAppStore();

  const primaryTabs = [
    { name: 'Home', href: '/app', icon: LayoutDashboard, exact: true },
    { name: 'My Menu', href: '/app/menu', icon: UtensilsCrossed },
    { name: 'Suppliers', href: '/app/suppliers', icon: Store },
    { name: 'Savings', href: '/app/savings', icon: PiggyBank },
  ];

  const secondaryItems = [
    { name: 'Profitability', href: '/app/profitability', icon: Percent },
    { name: 'City Prices', href: '/app/city-prices', icon: TrendingDown },
    { name: 'Shopping List', href: '/app/shopping-list', icon: ShoppingBag },
    { name: 'AI Assistant', href: '/app/assistant', icon: Sparkles },
    { name: 'Settings', href: '/app/settings', icon: Settings },
  ];

  const isMoreActive = secondaryItems.some((item) => pathname.startsWith(item.href));

  return (
    <>
      {/* Bottom Tab Bar (Sticky Mobile 5 Items) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#FFF9EF]/95 backdrop-blur-md border-t border-[#E4D7C0] px-2 py-2 safe-area-pb">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {primaryTabs.map((tab) => {
            const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-semibold transition-all min-h-[44px]',
                  isActive
                    ? 'text-[#2C1E14] bg-[#F8C45C]'
                    : 'text-[#66523B] hover:text-[#2C1E14]'
                )}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span>{tab.name}</span>
              </Link>
            );
          })}

          {/* "More" Sheet Trigger */}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-semibold transition-all min-h-[44px]',
              isMoreActive
                ? 'text-[#2C1E14] bg-[#F8C45C]'
                : 'text-[#66523B] hover:text-[#2C1E14]'
            )}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* "More" Bottom Sheet Modal */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            onClick={() => setMoreOpen(false)}
            className="fixed inset-0 bg-[#2C1E14]/50 backdrop-blur-sm animate-in fade-in-50 duration-150"
          />

          {/* Bottom Sheet Card */}
          <div className="relative z-10 w-full bg-[#FFF9EF] border-t border-[#E4D7C0] rounded-t-[28px] p-6 shadow-warm-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-[#E4D7C0] rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-4 border-b border-[#E4D7C0]">
              <h3 className="text-lg font-bold text-[#2C1E14]">All Hub Features</h3>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1E8D8] flex items-center justify-center text-[#66523B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-1.5">
              {secondaryItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                      isActive
                        ? 'bg-[#F8C45C] text-[#2C1E14]'
                        : 'text-[#66523B] bg-white border border-[#EBE1CF] hover:bg-[#F1E8D8]'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#E4D7C0] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setMoreOpen(false);
                }}
                className="flex items-center gap-2 text-xs font-semibold text-[#66523B] py-2 px-3 rounded-lg bg-[#F1E8D8]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>

              <Link
                href="/styleguide"
                onClick={() => setMoreOpen(false)}
                className="text-xs font-semibold text-[#315B42] hover:underline"
              >
                View Styleguide &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
