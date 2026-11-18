'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CITIES } from '@/data/mockData';
import { CityId } from '@/types';
import {
  Store,
  Bell,
  MapPin,
  Globe,
  RotateCcw,
  Plus,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  X
} from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';

export default function SettingsPage() {
  const {
    getCurrentRestaurant,
    getCurrentCity,
    selectedCityId,
    setCity,
    language,
    setLanguage,
    resetDemoData,
    addOutlet
  } = useAppStore();

  const restaurant = getCurrentRestaurant();
  const currentCity = getCurrentCity();

  const [restForm, setRestForm] = useState({
    name: restaurant.name,
    ownerName: 'Chef Raghav Veer',
    email: 'contact@delhihaveli.in',
    phone: '+91 98110 54201',
    monthlyPortions: 12500,
    cuisine: 'North Indian, Mughlai, Tandoor'
  });

  const [profileSaved, setProfileSaved] = useState(false);
  const [showAddOutlet, setShowAddOutlet] = useState(false);

  useScrollLock(showAddOutlet);
  const [resetDone, setResetDone] = useState(false);

  // New Outlet form
  const [outletName, setOutletName] = useState('');
  const [outletCityId, setOutletCityId] = useState<CityId>(selectedCityId);
  const [outletAddress, setOutletAddress] = useState('');

  // Notification toggles
  const [alertsEmail, setAlertsEmail] = useState(true);
  const [alertsWhatsapp, setAlertsWhatsapp] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleAddOutlet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outletName) return;
    addOutlet({
      name: outletName,
      address: outletAddress || `${outletName}, Market Complex`,
      cityId: outletCityId,
      phone: restForm.phone,
      managerName: 'Branch In-charge',
    });
    setShowAddOutlet(false);
    setOutletName('');
    setOutletAddress('');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default Delhi Haveli flagship store?')) {
      resetDemoData();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="border-b border-[#263D2D]/10 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#263D2D] font-outfit">
          Kitchen & Account <span className="font-fraunces italic font-normal text-[#315B42]">Settings</span>
        </h1>
        <p className="text-sm text-[#66523B] mt-1">
          Manage your restaurant profile, procurement locations, language, and mandi alerts.
        </p>
      </div>

      {resetDone && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Demo data successfully restored to factory defaults!
        </div>
      )}

      {/* 1. Restaurant Profile */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#263D2D]/10 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-[#263D2D]/10 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#F8C45C]/20 flex items-center justify-center text-[#263D2D]">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#263D2D] font-outfit">Restaurant Profile</h2>
            <p className="text-xs text-[#66523B]">Core business identity and primary branch contact</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#263D2D] mb-1.5">Restaurant Name</label>
              <input
                type="text"
                value={restForm.name}
                onChange={(e) => setRestForm({ ...restForm, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-[#263D2D] focus:outline-none focus:border-[#263D2D]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#263D2D] mb-1.5">Head Chef / Owner Name</label>
              <input
                type="text"
                value={restForm.ownerName}
                onChange={(e) => setRestForm({ ...restForm, ownerName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-[#263D2D] focus:outline-none focus:border-[#263D2D]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#263D2D] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#66523B]" /> Primary Contact Email
              </label>
              <input
                type="email"
                value={restForm.email}
                onChange={(e) => setRestForm({ ...restForm, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-[#263D2D] focus:outline-none focus:border-[#263D2D]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#263D2D] mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#66523B]" /> Phone / WhatsApp
              </label>
              <input
                type="text"
                value={restForm.phone}
                onChange={(e) => setRestForm({ ...restForm, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-[#263D2D] focus:outline-none focus:border-[#263D2D]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#263D2D] mb-1.5">Monthly Portions Estimate</label>
              <input
                type="number"
                value={restForm.monthlyPortions}
                onChange={(e) => setRestForm({ ...restForm, monthlyPortions: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-[#263D2D] focus:outline-none focus:border-[#263D2D]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#263D2D] mb-1.5">Primary Cuisine</label>
              <input
                type="text"
                value={restForm.cuisine}
                onChange={(e) => setRestForm({ ...restForm, cuisine: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-[#263D2D] focus:outline-none focus:border-[#263D2D]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {profileSaved ? (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Changes saved
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#263D2D] text-white text-xs font-semibold hover:bg-[#315B42] transition-colors shadow-sm"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 2. Multiple Outlets Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#263D2D]/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#263D2D]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#315B42]/10 flex items-center justify-center text-[#315B42]">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#263D2D] font-outfit">Kitchen Outlets & Branches</h2>
              <p className="text-xs text-[#66523B]">Configure city pricing per branch location</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddOutlet(true)}
            className="px-3.5 py-2 rounded-xl bg-[#FFF9EF] border border-[#263D2D]/15 text-[#263D2D] hover:bg-[#F8C45C]/20 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Outlet
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(restaurant.outlets || []).map((outlet) => (
            <div
              key={outlet.id}
              className="p-4 rounded-2xl bg-[#FFF9EF] border border-[#263D2D]/10 space-y-2 relative group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-[#263D2D]">{outlet.name}</div>
                  <div className="text-[11px] text-[#66523B] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#315B42]" /> {outlet.address}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                  Active Kitchen
                </span>
              </div>

              <div className="text-[11px] text-[#66523B] border-t border-[#263D2D]/5 pt-2 flex items-center justify-between">
                <span>Manager: {outlet.managerName}</span>
                <span className="font-semibold text-[#263D2D]">Phone: {outlet.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. City & Language Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mandi City Switcher */}
        <div className="bg-white rounded-3xl p-6 border border-[#263D2D]/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#315B42]" />
            <h3 className="text-sm font-bold text-[#263D2D]">Default Mandi City</h3>
          </div>
          <p className="text-xs text-[#66523B]">
            All wholesale quotes and supplier discovery defaults to this agricultural hub.
          </p>

          <select
            value={selectedCityId}
            onChange={(e) => setCity(e.target.value as CityId)}
            className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-xs font-semibold text-[#263D2D] focus:outline-none"
          >
            {CITIES.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.state})</option>
            ))}
          </select>
        </div>

        {/* UI Language */}
        <div className="bg-white rounded-3xl p-6 border border-[#263D2D]/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-[#315B42]" />
            <h3 className="text-sm font-bold text-[#263D2D]">UI & Assistant Language</h3>
          </div>
          <p className="text-xs text-[#66523B]">
            Toggle between English navigation and Hindi/Hinglish procurement terminology.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`p-2.5 rounded-xl border text-center transition-colors ${
                language === 'en'
                  ? 'bg-[#263D2D] text-white border-[#263D2D]'
                  : 'bg-[#FFF9EF] text-[#66523B] border-[#263D2D]/10 hover:border-[#263D2D]/30'
              }`}
            >
              English (EN)
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`p-2.5 rounded-xl border text-center transition-colors ${
                language === 'hi'
                  ? 'bg-[#263D2D] text-white border-[#263D2D]'
                  : 'bg-[#FFF9EF] text-[#66523B] border-[#263D2D]/10 hover:border-[#263D2D]/30'
              }`}
            >
              हिन्दी / Hinglish (HI)
            </button>
          </div>
        </div>
      </div>

      {/* 4. Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#263D2D]/10 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-[#263D2D]/10 pb-3">
          <Bell className="w-5 h-5 text-[#315B42]" />
          <div>
            <h3 className="text-base font-bold text-[#263D2D]">Procurement Notification Channels</h3>
            <p className="text-xs text-[#66523B]">Manage alerts for wholesale commodity shifts and vendor order confirmations</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#FFF9EF] border border-[#263D2D]/5 cursor-pointer">
            <div>
              <div className="font-semibold text-[#263D2D]">Instant WhatsApp Mandi Surge Alerts</div>
              <div className="text-[11px] text-[#66523B]">Ping head chef when prices drop &gt;10% in Azadpur/local APMC</div>
            </div>
            <input
              type="checkbox"
              checked={alertsWhatsapp}
              onChange={(e) => setAlertsWhatsapp(e.target.checked)}
              className="w-4 h-4 accent-[#263D2D]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#FFF9EF] border border-[#263D2D]/5 cursor-pointer">
            <div>
              <div className="font-semibold text-[#263D2D]">Email Order Slip Backups</div>
              <div className="text-[11px] text-[#66523B]">Send PDF copies to accounting upon weekly export</div>
            </div>
            <input
              type="checkbox"
              checked={alertsEmail}
              onChange={(e) => setAlertsEmail(e.target.checked)}
              className="w-4 h-4 accent-[#263D2D]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#FFF9EF] border border-[#263D2D]/5 cursor-pointer">
            <div>
              <div className="font-semibold text-[#263D2D]">Weekly Kitchen Savings Summary</div>
              <div className="text-[11px] text-[#66523B]">Monday morning digest comparing actual vs target 30% food cost</div>
            </div>
            <input
              type="checkbox"
              checked={dailyDigest}
              onChange={(e) => setDailyDigest(e.target.checked)}
              className="w-4 h-4 accent-[#263D2D]"
            />
          </label>
        </div>
      </div>

      {/* 5. Danger Zone / Reset Demo Data */}
      <div className="bg-rose-50/50 rounded-3xl p-6 sm:p-8 border border-rose-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-rose-900 font-outfit flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            Reset Demo Data
          </h3>
          <p className="text-xs text-rose-700/80 mt-1 max-w-lg">
            Restore the pre-configured Delhi flagship restaurant (Delhi Haveli), 10 menu items, verified Azadpur suppliers, and fresh price charts.
          </p>
        </div>
        <button
          onClick={handleResetData}
          className="px-4 py-2.5 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 text-xs font-semibold whitespace-nowrap shadow-sm self-start sm:self-auto transition-colors"
        >
          Reset All Data
        </button>
      </div>

      {/* ADD OUTLET MODAL */}
      {showAddOutlet && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#263D2D]/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#263D2D]/10 pb-3">
              <h3 className="text-base font-bold text-[#263D2D] font-outfit">Add Kitchen Outlet</h3>
              <button onClick={() => setShowAddOutlet(false)} className="text-[#66523B] hover:text-[#263D2D]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddOutlet} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#263D2D] mb-1">Outlet / Branch Name</label>
                <input
                  type="text"
                  value={outletName}
                  onChange={(e) => setOutletName(e.target.value)}
                  placeholder="e.g. South Extension Branch"
                  className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-[#263D2D] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#263D2D] mb-1">City</label>
                <select
                  value={outletCityId}
                  onChange={(e) => setOutletCityId(e.target.value as CityId)}
                  className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-[#263D2D] focus:outline-none"
                >
                  {CITIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.state})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#263D2D] mb-1">Local Address / Area</label>
                <input
                  type="text"
                  value={outletAddress}
                  onChange={(e) => setOutletAddress(e.target.value)}
                  placeholder="e.g. Market-2, South Extension"
                  className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-[#263D2D] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddOutlet(false)}
                  className="px-4 py-2 rounded-xl border border-[#263D2D]/15 text-[#66523B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#263D2D] text-white font-semibold hover:bg-[#315B42]"
                >
                  Add Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
