'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MapPin, Building2, Bell, ChevronDown, Check, LogOut, Settings, User, Sparkles } from 'lucide-react';
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
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-[#E4D7C0] rounded-xl shadow-warm-xl p-3 z-50 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1E8D8] mb-2">
                <span className="font-bold text-xs text-[#2C1E14]">Kitchen Mandi Alerts</span>
                <span className="text-[10px] text-[#8A7662]">{unreadAlerts} unread</span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {alerts.slice(0, 5).map((a) => (
                  <div
                    key={a.id}
                    onClick={() => markAlertRead(a.id)}
                    className={`p-2 rounded-lg border text-[11px] cursor-pointer transition-colors ${
                      a.read
                        ? 'bg-white border-[#F1E8D8] text-[#8A7662]'
                        : 'bg-[#FFF9EF] border-[#F8C45C]/60 text-[#2C1E14]'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{a.title}</span>
                      {!a.read && <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />}
                    </div>
                    <div className="text-[10px] text-[#66523B] mt-0.5">{a.message}</div>
                  </div>
                ))}
              </div>
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
