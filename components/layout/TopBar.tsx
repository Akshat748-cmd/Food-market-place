'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Building2, Bell, ChevronDown, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { CityId } from '@/types';
import { HeroAvatarIllustration } from '@/components/illustrations';

export function TopBar() {
  const isHydrated = useHydrated();
  const {
    cities,
    selectedCityId,
    setCity,
    restaurants,
    selectedRestaurantId,
    setRestaurant,
    selectedOutletId,
    setOutlet,
    alerts,
    markAlertRead,
  } = useAppStore();

  const [alertsOpen, setAlertsOpen] = useState(false);
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  const currentRestaurant =
    restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];
  const currentOutlet =
    currentRestaurant?.outlets.find((o) => o.id === selectedOutletId) ||
    currentRestaurant?.outlets[0];

  // Combined restaurant + outlet change handler
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val.includes(':::')) {
      const [restId, outId] = val.split(':::');
      setRestaurant(restId);
      setOutlet(outId);
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full h-16 bg-[#FFF9EF]/95 backdrop-blur-md border-b border-[#E4D7C0]/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* LEFT: ONE Combined Restaurant & Outlet Switcher Pill */}
      <div className="relative flex items-center bg-white border border-[#E4D7C0] rounded-xl px-3 py-1.5 shadow-warm-xs max-w-[260px] sm:max-w-md">
        <Building2 className="w-4 h-4 text-[#66523B] shrink-0 mr-2" />
        <div className="flex flex-col text-left min-w-0 flex-1">
          <span className="text-[10px] uppercase font-bold text-[#8A7662] tracking-wider leading-none truncate">
            {isHydrated ? currentRestaurant?.name : 'Delhi Haveli'}
          </span>
          <select
            aria-label="Select Restaurant and Outlet"
            value={isHydrated ? `${selectedRestaurantId}:::${selectedOutletId}` : undefined}
            onChange={handleSelectChange}
            className="bg-transparent text-xs sm:text-sm font-bold text-[#2C1E14] focus:outline-none cursor-pointer pr-3 appearance-none truncate"
          >
            {restaurants.map((rest) => (
              <optgroup key={rest.id} label={`${rest.name} (${rest.cuisine})`}>
                {rest.outlets.map((out) => (
                  <option key={out.id} value={`${rest.id}:::${out.id}`}>
                    {out.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#8A7662] pointer-events-none shrink-0 ml-1" />
      </div>

      {/* RIGHT: City Pill, Notification Bell, Small Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {/* City Switcher Pill */}
        <div className="relative flex items-center bg-white border border-[#E4D7C0] rounded-xl px-2.5 sm:px-3 py-1.5 shadow-warm-xs">
          <MapPin className="w-3.5 h-3.5 text-[#315B42] shrink-0 mr-1.5" />
          <select
            aria-label="Select Mandi City"
            value={isHydrated ? selectedCityId : 'delhi-ncr'}
            onChange={(e) => setCity(e.target.value as CityId)}
            className="bg-transparent text-xs sm:text-sm font-bold text-[#2C1E14] focus:outline-none cursor-pointer pr-3 appearance-none"
          >
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#8A7662] pointer-events-none shrink-0 -ml-1.5" />
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAlertsOpen(!alertsOpen)}
            className="relative w-9 h-9 rounded-xl bg-white border border-[#E4D7C0] flex items-center justify-center text-[#66523B] hover:text-[#2C1E14] hover:bg-[#F9F5EC] transition-colors shadow-warm-xs"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C2410C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Alerts Dropdown Modal */}
          {alertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E4D7C0] rounded-2xl shadow-warm-xl p-4 z-50 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1E8D8] mb-3">
                <span className="font-bold text-sm text-[#2C1E14]">Kitchen Mandi Alerts</span>
                <span className="text-[11px] text-[#8A7662]">{unreadAlerts} unread</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {alerts.slice(0, 5).map((a) => (
                  <div
                    key={a.id}
                    onClick={() => markAlertRead(a.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      a.read
                        ? 'bg-white border-[#F1E8D8] text-[#8A7662]'
                        : 'bg-[#FFF9EF] border-[#F8C45C]/60 text-[#2C1E14]'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{a.title}</span>
                      {!a.read && <span className="w-2 h-2 rounded-full bg-[#C2410C]" />}
                    </div>
                    <div className="text-[11px] mt-0.5">{a.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Small Avatar Pill */}
        <Link
          href="/app/settings"
          className="flex items-center gap-2 p-1 rounded-full border border-[#E4D7C0] bg-white hover:border-[#F8C45C] transition-all shadow-warm-xs"
          title="Account Settings"
        >
          <HeroAvatarIllustration size={28} showOnlineDot={false} />
        </Link>
      </div>
    </header>
  );
}
