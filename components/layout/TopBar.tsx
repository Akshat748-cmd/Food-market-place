'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MapPin, Building2, Bell, ChevronDown, Check, LogOut, Settings, User, Sparkles, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { CityId } from '@/types';
import { HeroAvatarIllustration } from '@/components/illustrations';

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/app': { title: 'Kitchen Overview', subtitle: 'Live Mandi Ops' },
  '/app/menu': { title: 'My Menu & Ingredients', subtitle: 'Recipes & Commodities' },
  '/app/suppliers': { title: 'Find Suppliers', subtitle: 'Wholesale Mandis' },
  '/app/city-prices': { title: 'City Mandi Prices', subtitle: 'APMC Benchmarks' },
  '/app/savings': { title: 'Savings Overview', subtitle: 'Financial Statements' },
  '/app/profitability': { title: 'Menu Profitability', subtitle: 'Food Cost & Margins' },
  '/app/shopping-list': { title: 'Shopping List & Orders', subtitle: 'Wholesale PO Slip' },
  '/app/assistant': { title: 'AI Kitchen Advisor', subtitle: 'Live Copilot' },
  '/app/settings': { title: 'Kitchen & Account Settings', subtitle: 'Preferences & Outlets' },
  '/app/onboarding': { title: 'Restaurant Onboarding', subtitle: 'Kitchen Setup' },
  '/app/processing': { title: 'Menu Processing', subtitle: 'AI Extraction' },
};

export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHydrated = useHydrated();
  const {
    cities,
    selectedCityId,
    setCity,
    restaurants,
    selectedRestaurantId,
    alerts,
    markAlertRead,
    dismissAlert,
    clearAllAlerts,
    currentUser,
    isAuthenticated,
    logout,
  } = useAppStore();

  const [alertsOpen, setAlertsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  const currentRestaurant =
    restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];

  const currentPageInfo = PAGE_TITLES[pathname] || {
    title: pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Kitchen Portal',
  };

  return (
    <header className="sticky top-0 z-20 w-full h-12 bg-[#FFF9EF]/95 backdrop-blur-md border-b border-[#E4D7C0]/80 px-3 sm:px-5 lg:px-6 flex items-center justify-between">
      {/* LEFT: Current Page Heading (Clean, Compact Header Title) */}
      <div className="flex items-center gap-2.5 min-w-0 py-1">
        <h2 className="text-xs sm:text-sm font-bold font-fraunces text-[#2C1E14] tracking-tight truncate">
          {currentPageInfo.title}
        </h2>
        {currentPageInfo.subtitle && (
          <span className="hidden sm:inline-flex items-center text-[10px] text-[#8A7662] font-semibold bg-white px-2 py-0.5 rounded-md border border-[#E4D7C0] shadow-2xs shrink-0">
            {currentPageInfo.subtitle}
          </span>
        )}
      </div>

      {/* RIGHT: Analyse with AI Button, Notification Bell, Small Avatar */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Analyse with AI Button */}
        <button
          type="button"
          onClick={() => {
            if (pathname.startsWith('/app/menu')) {
              router.push('/app/processing');
            } else {
              router.push('/app/assistant');
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#F8C45C] bg-[#FFF8E7] hover:bg-[#FDECC2] text-[#8C5D08] text-xs font-bold transition-all shadow-xs h-8"
          title="Run AI Kitchen Copilot & Procurement Analysis"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F8C45C]" />
          <span className="hidden sm:inline">Analyse with AI</span>
          <span className="sm:hidden">AI</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAlertsOpen(!alertsOpen)}
            className="relative w-8 h-8 rounded-lg bg-white border border-[#E4D7C0] flex items-center justify-center text-[#66523B] hover:text-[#2C1E14] hover:bg-[#F9F5EC] transition-colors shadow-warm-xs"
            aria-label="View notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#C2410C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Alerts Dropdown Modal */}
          {alertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E4D7C0] rounded-2xl shadow-warm-xl p-3.5 z-50 text-left animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#F1E8D8] mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-[#2C1E14]">Kitchen Mandi Alerts</span>
                  {unreadAlerts > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold text-[10px]">
                      {unreadAlerts} new
                    </span>
                  )}
                </div>
                {alerts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearAllAlerts()}
                    className="text-[11px] font-semibold text-[#8A7662] hover:text-[#C2410C] transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {alerts.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#8A7662]">
                  <p className="font-semibold text-[#2C1E14]">All caught up!</p>
                  <p className="text-[11px] mt-0.5">No pending kitchen mandi alerts right now.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                  {alerts.map((a) => {
                    const targetHref =
                      a.actionHref ||
                      (a.title.toLowerCase().includes('paneer')
                        ? '/app/suppliers?search=Paneer'
                        : a.title.toLowerCase().includes('tomato')
                        ? '/app/city-prices'
                        : '/app/suppliers');

                    return (
                      <div
                        key={a.id}
                        onClick={() => {
                          markAlertRead(a.id);
                          setAlertsOpen(false);
                          router.push(targetHref);
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-xs group relative ${
                          a.read
                            ? 'bg-white border-[#F1E8D8] text-[#8A7662]'
                            : 'bg-[#FFF9EF] border-[#F8C45C]/70 text-[#2C1E14] hover:border-[#315B42]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                            {!a.read && (
                              <span className="w-2 h-2 rounded-full bg-[#C2410C] shrink-0 animate-pulse" />
                            )}
                            <span className="font-bold text-[12px] text-[#2C1E14] group-hover:text-[#315B42] transition-colors">
                              {a.title}
                            </span>
                          </div>

                          {/* Cancel / Dismiss Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAlert(a.id);
                            }}
                            className="w-5 h-5 rounded-full hover:bg-[#FEE2E2] text-[#8A7662] hover:text-[#C2410C] flex items-center justify-center shrink-0 transition-colors"
                            title="Dismiss notification"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        <p className="text-[11px] text-[#66523B] mt-1 leading-relaxed">
                          {a.message}
                        </p>

                        <div className="mt-2 flex items-center justify-between text-[10px]">
                          <span className="text-[#8A7662] font-mono">{a.date}</span>
                          <span className="inline-flex items-center gap-1 font-bold text-[#315B42] group-hover:underline">
                            {a.actionLabel || 'View Details'} &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile & Logout Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-1.5 p-0.5 rounded-full border border-[#E4D7C0] bg-white hover:border-[#F8C45C] transition-all shadow-warm-xs"
            title="Restaurant Account"
          >
            <HeroAvatarIllustration size={26} showOnlineDot={isHydrated && isAuthenticated} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E4D7C0] rounded-2xl shadow-warm-xl p-3 z-50 text-left space-y-2">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#F1E8D8]">
                <HeroAvatarIllustration size={32} showOnlineDot={true} />
                <div className="min-w-0 flex-1 leading-tight">
                  <span className="font-bold text-xs text-[#2C1E14] block truncate">
                    {currentUser?.name || 'Chef Owner'}
                  </span>
                  <span className="text-[10px] text-[#315B42] font-semibold block truncate">
                    {currentRestaurant?.name || 'Delhi Haveli'}
                  </span>
                  <span className="text-[9px] text-[#8A7662] block truncate">
                    {currentUser?.email || 'owner@restaurant.in'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <Link
                  href="/app/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#66523B] hover:text-[#2C1E14] hover:bg-[#F9F5EC] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Restaurant Settings</span>
                </Link>

                <Link
                  href="/login"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#66523B] hover:text-[#2C1E14] hover:bg-[#F9F5EC] transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Switch Restaurant Profile</span>
                </Link>
              </div>

              <div className="pt-1.5 border-t border-[#F1E8D8]">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen(false);
                    if (confirm('Log out from restaurant account?')) {
                      logout();
                      router.push('/login');
                    }
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#C2410C] hover:bg-[#FEE2E2] font-semibold text-xs transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out Restaurant</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
