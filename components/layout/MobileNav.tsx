'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  LogOut,
  ChevronDown,
  ChevronRight,
  Flame,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeroAvatarIllustration } from '@/components/illustrations';
import { useAppStore } from '@/store/useAppStore';

const MENU_CATEGORIES = [
  'All',
  'Starters & Appetizers',
  'Main Course',
  'Rice, Biryani & Pulao',
  'Indian Breads',
  'Desserts & Sweets',
  'Beverages',
];

const INGREDIENT_COUNT_OPTIONS = [
  { label: '1 to 3 Ingredients', value: '<=3' as const },
  { label: '4 to 6 Ingredients', value: '4-6' as const },
  { label: '7+ Ingredients', value: '7+' as const },
];

const FOOD_COST_OPTIONS = [
  { label: 'Low Cost (< 25%)', value: 'low' as const },
  { label: 'Target (25% - 30%)', value: 'target' as const },
  { label: 'High Alert (> 30%)', value: 'high' as const },
];

const STATUS_OPTIONS = [
  { label: 'Active Menu', value: 'active' as const, count: 25 },
  { label: 'Archived / Seasonal', value: 'inactive' as const, count: 0 },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const [menuFiltersSheetOpen, setMenuFiltersSheetOpen] = useState(false);
  const [mobileSubFilter, setMobileSubFilter] = useState<
    'category' | 'ingredient_count' | 'food_cost' | 'status' | null
  >(null);

  const {
    dishes,
    resetDemoData,
    logout,
    menuFilter,
    setMenuFilter,
  } = useAppStore();

  const isMenuRoute = pathname.startsWith('/app/menu');
  const bestsellersCount = dishes.filter((d) => d.tags?.includes('bestseller')).length;

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

            if (tab.name === 'My Menu') {
              return (
                <button
                  key={tab.name}
                  type="button"
                  onClick={() => {
                    if (isMenuRoute) {
                      setMenuFiltersSheetOpen(true);
                    } else {
                      router.push('/app/menu');
                    }
                  }}
                  className={cn(
                    'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-semibold transition-all min-h-[44px]',
                    isActive
                      ? 'text-[#2C1E14] bg-[#F8C45C]'
                      : 'text-[#66523B] hover:text-[#2C1E14]'
                  )}
                >
                  <Icon className="w-5 h-5 mb-0.5" />
                  <span>{tab.name}</span>
                </button>
              );
            }

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

            <div className="pt-3 border-t border-[#E4D7C0] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  if (confirm('Log out from restaurant account?')) {
                    logout();
                    router.push('/login');
                  }
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-[#C2410C] py-2 px-3 rounded-lg bg-[#FEE2E2]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setMoreOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#66523B] py-2 px-3 rounded-lg bg-[#F1E8D8]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "My Menu Filters" Mobile Bottom Sheet Modal */}
      {menuFiltersSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div
            onClick={() => setMenuFiltersSheetOpen(false)}
            className="fixed inset-0 bg-[#2C1E14]/50 backdrop-blur-sm animate-in fade-in-50 duration-150"
          />

          {/* Bottom Sheet Card */}
          <div className="relative z-10 w-full bg-[#FFF9EF] border-t border-[#E4D7C0] rounded-t-[28px] p-6 shadow-warm-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-[#E4D7C0] rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-[#E4D7C0]">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#315B42]" />
                <h3 className="text-base font-bold text-[#2C1E14]">My Menu Filters</h3>
              </div>
              <button
                type="button"
                onClick={() => setMenuFiltersSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1E8D8] flex items-center justify-center text-[#66523B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2">
              {/* 1. All Dishes */}
              <button
                type="button"
                onClick={() => {
                  setMenuFilter({ activeKey: 'all', categoryValue: 'All' });
                  setMenuFiltersSheetOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                  menuFilter.activeKey === 'all'
                    ? 'bg-[#263D2D] text-white shadow-xs'
                    : 'bg-white border border-[#E4D7C0] text-[#66523B]'
                )}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>All Dishes</span>
                </div>
                <span className="font-mono text-[11px] opacity-80">{dishes.length}</span>
              </button>

              {/* 2. Bestsellers */}
              <button
                type="button"
                onClick={() => {
                  setMenuFilter({ activeKey: 'bestsellers' });
                  setMenuFiltersSheetOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                  menuFilter.activeKey === 'bestsellers'
                    ? 'bg-[#263D2D] text-white shadow-xs'
                    : 'bg-white border border-[#E4D7C0] text-[#66523B]'
                )}
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#C2410C]" />
                  <span>Bestsellers</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold text-[10px]">
                  {bestsellersCount}
                </span>
              </button>

              {/* 3. Categories */}
              <div className="bg-white border border-[#E4D7C0] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setMobileSubFilter(mobileSubFilter === 'category' ? null : 'category')
                  }
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-colors',
                    menuFilter.activeKey === 'category'
                      ? 'bg-[#EAF3ED] text-[#315B42]'
                      : 'text-[#66523B]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#315B42]" />
                    <span>Categories</span>
                    {menuFilter.activeKey === 'category' && menuFilter.categoryValue && (
                      <span className="text-[10px] text-[#315B42] font-normal">
                        ({menuFilter.categoryValue})
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform',
                      mobileSubFilter === 'category' && 'rotate-180'
                    )}
                  />
                </button>

                {mobileSubFilter === 'category' && (
                  <div className="p-2 border-t border-[#F1E8D8] grid grid-cols-2 gap-1.5">
                    {MENU_CATEGORIES.map((cat) => {
                      const isSel =
                        menuFilter.activeKey === 'category' && menuFilter.categoryValue === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setMenuFilter({ activeKey: 'category', categoryValue: cat });
                            setMenuFiltersSheetOpen(false);
                          }}
                          className={cn(
                            'px-2 py-1.5 rounded-lg text-[11px] font-medium text-left truncate transition-colors',
                            isSel
                              ? 'bg-[#263D2D] text-white font-bold'
                              : 'bg-[#FFF9EF] text-[#66523B] hover:bg-[#F1E8D8]'
                          )}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Ingredient Count */}
              <div className="bg-white border border-[#E4D7C0] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setMobileSubFilter(
                      mobileSubFilter === 'ingredient_count' ? null : 'ingredient_count'
                    )
                  }
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-colors',
                    menuFilter.activeKey === 'ingredient_count'
                      ? 'bg-[#EAF3ED] text-[#315B42]'
                      : 'text-[#66523B]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Carrot className="w-4 h-4 text-[#8A7662]" />
                    <span>Ingredient Count</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform',
                      mobileSubFilter === 'ingredient_count' && 'rotate-180'
                    )}
                  />
                </button>

                {mobileSubFilter === 'ingredient_count' && (
                  <div className="p-2 border-t border-[#F1E8D8] space-y-1">
                    {INGREDIENT_COUNT_OPTIONS.map((opt) => {
                      const isSel =
                        menuFilter.activeKey === 'ingredient_count' &&
                        menuFilter.ingredientCountValue === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setMenuFilter({
                              activeKey: 'ingredient_count',
                              ingredientCountValue: opt.value,
                            });
                            setMenuFiltersSheetOpen(false);
                          }}
                          className={cn(
                            'w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors',
                            isSel
                              ? 'bg-[#263D2D] text-white font-bold'
                              : 'bg-[#FFF9EF] text-[#66523B] hover:bg-[#F1E8D8]'
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 5. Food Cost */}
              <div className="bg-white border border-[#E4D7C0] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setMobileSubFilter(mobileSubFilter === 'food_cost' ? null : 'food_cost')
                  }
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-colors',
                    menuFilter.activeKey === 'food_cost'
                      ? 'bg-[#EAF3ED] text-[#315B42]'
                      : 'text-[#66523B]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-[#8A7662]" />
                    <span>Food Cost</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform',
                      mobileSubFilter === 'food_cost' && 'rotate-180'
                    )}
                  />
                </button>

                {mobileSubFilter === 'food_cost' && (
                  <div className="p-2 border-t border-[#F1E8D8] space-y-1">
                    {FOOD_COST_OPTIONS.map((opt) => {
                      const isSel =
                        menuFilter.activeKey === 'food_cost' &&
                        menuFilter.foodCostValue === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setMenuFilter({
                              activeKey: 'food_cost',
                              foodCostValue: opt.value,
                            });
                            setMenuFiltersSheetOpen(false);
                          }}
                          className={cn(
                            'w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors',
                            isSel
                              ? 'bg-[#263D2D] text-white font-bold'
                              : 'bg-[#FFF9EF] text-[#66523B] hover:bg-[#F1E8D8]'
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 6. Active / Inactive */}
              <div className="bg-white border border-[#E4D7C0] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setMobileSubFilter(mobileSubFilter === 'status' ? null : 'status')
                  }
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-colors',
                    menuFilter.activeKey === 'status'
                      ? 'bg-[#EAF3ED] text-[#315B42]'
                      : 'text-[#66523B]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8A7662]" />
                    <span>Active / Inactive</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform',
                      mobileSubFilter === 'status' && 'rotate-180'
                    )}
                  />
                </button>

                {mobileSubFilter === 'status' && (
                  <div className="p-2 border-t border-[#F1E8D8] space-y-1">
                    {STATUS_OPTIONS.map((opt) => {
                      const isSel =
                        menuFilter.activeKey === 'status' &&
                        menuFilter.statusValue === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setMenuFilter({
                              activeKey: 'status',
                              statusValue: opt.value,
                            });
                            setMenuFiltersSheetOpen(false);
                          }}
                          className={cn(
                            'w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors',
                            isSel
                              ? 'bg-[#263D2D] text-white font-bold'
                              : 'bg-[#FFF9EF] text-[#66523B] hover:bg-[#F1E8D8]'
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
