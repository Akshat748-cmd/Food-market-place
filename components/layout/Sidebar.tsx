'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  { name: 'Menu Profitability', href: '/app/profitability', icon: Percent },
  { name: 'Shopping List', href: '/app/shopping-list', icon: ShoppingBag },
  { name: 'AI Assistant', href: '/app/assistant', icon: Sparkles },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

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

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHydrated = useHydrated();
  const {
    getCurrentRestaurant,
    currentUser,
    isAuthenticated,
    logout,
    dishes,
    menuFilter,
    setMenuFilter,
    isMenuExpanded,
    toggleMenuExpanded,
  } = useAppStore();

  const [expandedSubFilter, setExpandedSubFilter] = useState<
    'category' | 'ingredient_count' | 'food_cost' | 'status' | null
  >(null);

  const currentRestaurant = isHydrated ? getCurrentRestaurant() : null;
  const bestsellersCount = dishes.filter((d) => d.tags?.includes('bestseller')).length;

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-[100dvh] w-[216px] flex-col overflow-hidden bg-[#FFF9EF] border-r border-[#E4D7C0] select-none z-30 justify-between">
      {/* 1. Logo block (~52px compact) */}
      <div className="h-[52px] px-4 flex items-center border-b border-[#E4D7C0]/80 shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-full border border-[#66523B]/30 flex items-center justify-center p-1 bg-white transition-transform group-hover:scale-105 shadow-warm-xs">
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
            <span className="text-[11px] font-black tracking-widest text-[#2C1E14] uppercase font-sans">
              FOOD
            </span>
            <span className="text-[10px] font-bold tracking-wider text-[#66523B] uppercase font-sans">
              MARKET HUB
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Nav list: compact items, expandable Menu dropdown, overflow-y-auto */}
      <nav className="flex-1 px-2.5 py-2.5 space-y-0.5 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.name === 'My Menu') {
            const isMenuRoute = pathname.startsWith('/app/menu');
            return (
              <div key={item.name} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    toggleMenuExpanded();
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 h-[34px] group text-left select-none',
                    isMenuRoute
                      ? 'bg-[#F8C45C] text-[#263D2D] shadow-warm-xs font-bold'
                      : 'text-[#66523B] hover:bg-[#F1E8D8]/70 hover:text-[#2C1E14]'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <UtensilsCrossed
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isMenuRoute ? 'text-[#263D2D]' : 'text-[#66523B]'
                      )}
                    />
                    <span className="truncate">My Menu</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/80 text-[#2C1E14] font-bold border border-[#E4D7C0]/60">
                      {dishes.length}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 transition-transform duration-200 text-[#2C1E14]/70',
                        isMenuExpanded && 'rotate-180'
                      )}
                    />
                  </div>
                </button>

                {/* EXPANDED DROPDOWN DIRECTLY BELOW MENU */}
                {isMenuExpanded && (
                  <div className="ml-2 pl-2 border-l-2 border-[#F8C45C]/60 py-1 space-y-1">
                    {/* 1. All Dishes */}
                    <button
                      type="button"
                      onClick={() => {
                        setMenuFilter({ activeKey: 'all', categoryValue: 'All' });
                        if (!isMenuRoute) router.push('/app/menu');
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors',
                        menuFilter.activeKey === 'all'
                          ? 'bg-[#263D2D] text-white font-bold shadow-2xs'
                          : 'text-[#66523B] hover:bg-[#F1E8D8] hover:text-[#2C1E14]'
                      )}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">All Dishes</span>
                      </div>
                      <span className="text-[10px] opacity-80 font-mono">{dishes.length}</span>
                    </button>

                    {/* 2. Bestsellers */}
                    <button
                      type="button"
                      onClick={() => {
                        setMenuFilter({ activeKey: 'bestsellers' });
                        if (!isMenuRoute) router.push('/app/menu');
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors',
                        menuFilter.activeKey === 'bestsellers'
                          ? 'bg-[#263D2D] text-white font-bold shadow-2xs'
                          : 'text-[#66523B] hover:bg-[#F1E8D8] hover:text-[#2C1E14]'
                      )}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Flame className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />
                        <span className="truncate">Bestsellers</span>
                      </div>
                      <span className="text-[10px] px-1 rounded bg-[#FEF3C7] text-[#92400E] font-bold">
                        {bestsellersCount}
                      </span>
                    </button>

                    {/* 3. Categories (Nested Accordion) */}
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSubFilter(
                            expandedSubFilter === 'category' ? null : 'category'
                          )
                        }
                        className={cn(
                          'w-full flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors',
                          menuFilter.activeKey === 'category'
                            ? 'bg-[#EAF3ED] text-[#315B42] font-bold'
                            : 'text-[#66523B] hover:bg-[#F1E8D8] hover:text-[#2C1E14]'
                        )}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#315B42] shrink-0" />
                          <span className="truncate">Categories</span>
                        </div>
                        <ChevronRight
                          className={cn(
                            'w-3 h-3 transition-transform duration-150',
                            expandedSubFilter === 'category' && 'rotate-90'
                          )}
                        />
                      </button>

                      {expandedSubFilter === 'category' && (
                        <div className="ml-3 pl-1.5 border-l border-[#E4D7C0] py-0.5 space-y-0.5">
                          {MENU_CATEGORIES.map((cat) => {
                            const isSelected =
                              menuFilter.activeKey === 'category' &&
                              menuFilter.categoryValue === cat;
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => {
                                  setMenuFilter({ activeKey: 'category', categoryValue: cat });
                                  if (!isMenuRoute) router.push('/app/menu');
                                }}
                                className={cn(
                                  'w-full text-left px-2 py-0.5 rounded text-[11px] truncate transition-colors block',
                                  isSelected
                                    ? 'bg-[#263D2D] text-white font-bold'
                                    : 'text-[#8A7662] hover:text-[#2C1E14] hover:bg-[#F9F5EC]'
                                )}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* 4. Ingredient Count (Nested Accordion) */}
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSubFilter(
                            expandedSubFilter === 'ingredient_count'
                              ? null
                              : 'ingredient_count'
                          )
                        }
                        className={cn(
                          'w-full flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors',
                          menuFilter.activeKey === 'ingredient_count'
                            ? 'bg-[#EAF3ED] text-[#315B42] font-bold'
                            : 'text-[#66523B] hover:bg-[#F1E8D8] hover:text-[#2C1E14]'
                        )}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <Carrot className="w-3.5 h-3.5 text-[#8A7662] shrink-0" />
                          <span className="truncate">Ingredient Count</span>
                        </div>
                        <ChevronRight
                          className={cn(
                            'w-3 h-3 transition-transform duration-150',
                            expandedSubFilter === 'ingredient_count' && 'rotate-90'
                          )}
                        />
                      </button>

                      {expandedSubFilter === 'ingredient_count' && (
                        <div className="ml-3 pl-1.5 border-l border-[#E4D7C0] py-0.5 space-y-0.5">
                          {INGREDIENT_COUNT_OPTIONS.map((opt) => {
                            const isSelected =
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
                                  if (!isMenuRoute) router.push('/app/menu');
                                }}
                                className={cn(
                                  'w-full text-left px-2 py-0.5 rounded text-[11px] truncate transition-colors block',
                                  isSelected
                                    ? 'bg-[#263D2D] text-white font-bold'
                                    : 'text-[#8A7662] hover:text-[#2C1E14] hover:bg-[#F9F5EC]'
                                )}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* 5. Food Cost % (Nested Accordion) */}
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSubFilter(
                            expandedSubFilter === 'food_cost' ? null : 'food_cost'
                          )
                        }
                        className={cn(
                          'w-full flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors',
                          menuFilter.activeKey === 'food_cost'
                            ? 'bg-[#EAF3ED] text-[#315B42] font-bold'
                            : 'text-[#66523B] hover:bg-[#F1E8D8] hover:text-[#2C1E14]'
                        )}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <Percent className="w-3.5 h-3.5 text-[#8A7662] shrink-0" />
                          <span className="truncate">Food Cost</span>
                        </div>
                        <ChevronRight
                          className={cn(
                            'w-3 h-3 transition-transform duration-150',
                            expandedSubFilter === 'food_cost' && 'rotate-90'
                          )}
                        />
                      </button>

                      {expandedSubFilter === 'food_cost' && (
                        <div className="ml-3 pl-1.5 border-l border-[#E4D7C0] py-0.5 space-y-0.5">
                          {FOOD_COST_OPTIONS.map((opt) => {
                            const isSelected =
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
                                  if (!isMenuRoute) router.push('/app/menu');
                                }}
                                className={cn(
                                  'w-full text-left px-2 py-0.5 rounded text-[11px] truncate transition-colors block',
                                  isSelected
                                    ? 'bg-[#263D2D] text-white font-bold'
                                    : 'text-[#8A7662] hover:text-[#2C1E14] hover:bg-[#F9F5EC]'
                                )}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* 6. Active / Inactive (Nested Accordion) */}
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSubFilter(
                            expandedSubFilter === 'status' ? null : 'status'
                          )
                        }
                        className={cn(
                          'w-full flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors',
                          menuFilter.activeKey === 'status'
                            ? 'bg-[#EAF3ED] text-[#315B42] font-bold'
                            : 'text-[#66523B] hover:bg-[#F1E8D8] hover:text-[#2C1E14]'
                        )}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8A7662] shrink-0" />
                          <span className="truncate">Active / Inactive</span>
                        </div>
                        <ChevronRight
                          className={cn(
                            'w-3 h-3 transition-transform duration-150',
                            expandedSubFilter === 'status' && 'rotate-90'
                          )}
                        />
                      </button>

                      {expandedSubFilter === 'status' && (
                        <div className="ml-3 pl-1.5 border-l border-[#E4D7C0] py-0.5 space-y-0.5">
                          {STATUS_OPTIONS.map((opt) => {
                            const isSelected =
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
                                  if (!isMenuRoute) router.push('/app/menu');
                                }}
                                className={cn(
                                  'w-full text-left px-2 py-0.5 rounded text-[11px] truncate transition-colors block',
                                  isSelected
                                    ? 'bg-[#263D2D] text-white font-bold'
                                    : 'text-[#8A7662] hover:text-[#2C1E14] hover:bg-[#F9F5EC]'
                                )}
                              >
                                {opt.label} ({opt.count})
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 h-[34px]',
                isActive
                  ? 'bg-[#F8C45C] text-[#263D2D] shadow-warm-xs font-bold'
                  : 'text-[#66523B] hover:bg-[#F1E8D8]/70 hover:text-[#2C1E14]'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive ? 'text-[#263D2D]' : 'text-[#66523B]'
                )}
              />
              <span className="truncate">{item.name}</span>
              {item.name === 'AI Assistant' && (
                <span className="ml-auto px-1 py-0.2 text-[9px] uppercase font-bold tracking-wide rounded bg-[#315B42] text-white shrink-0">
                  Live
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. Pinned Profile / Restaurant Card (Compact, mt-auto with Quick Logout) */}
      <div className="mt-auto px-2.5 pb-3 pt-2 border-t border-[#E4D7C0]/80 shrink-0">
        <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-lg bg-white border border-[#E4D7C0] hover:border-[#F8C45C] transition-all shadow-warm-xs group">
          <Link
            href="/app/settings"
            className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-90"
            title="Restaurant Settings"
          >
            <div className="shrink-0">
              <HeroAvatarIllustration size={28} showOnlineDot={isHydrated && isAuthenticated} />
            </div>
            <div className="flex flex-col min-w-0 flex-1 leading-tight">
              <span className="text-[11px] font-bold text-[#2C1E14] truncate group-hover:text-[#315B42]">
                {currentRestaurant?.name || 'Delhi Haveli'}
              </span>
              <span className="text-[9px] text-[#8A7662] truncate">
                {currentUser?.name || currentRestaurant?.cuisine || 'Restaurant Owner'}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => {
              if (confirm('Log out from restaurant account?')) {
                logout();
                router.push('/login');
              }
            }}
            title="Log Out Restaurant"
            className="w-7 h-7 rounded-md hover:bg-[#FEE2E2] text-[#8A7662] hover:text-[#C2410C] flex items-center justify-center transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
