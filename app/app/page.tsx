'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { MascotFace } from '@/components/illustrations/MascotFace';
import {
  TrendingDown,
  Sparkles,
  ArrowRight,
  Bell,
  ShoppingCart,
  Store,
  Plus,
  X
} from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';

export default function AppHomePage() {
  const {
    getCurrentRestaurant,
    getCurrentCity,
    getTotalSavingsMonthly,
    alerts,
    addAlert,
    shoppingList,
    ingredients,
  } = useAppStore();

  const restaurant = getCurrentRestaurant();
  const currentCity = getCurrentCity();
  const totalSavings = getTotalSavingsMonthly();

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useScrollLock(showAlertModal);

  // Form state for creating alert
  const [alertIng, setAlertIng] = useState(ingredients[0]?.name || 'Paneer (Fresh Malai)');
  const [targetPrice, setTargetPrice] = useState('280');
  const [condition, setCondition] = useState<'below' | 'above'>('below');

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedIng = ingredients.find(i => i.name === alertIng) || ingredients[0];
    addAlert({
      type: condition === 'below' ? 'price_drop' : 'price_spike',
      title: `${alertIng} Price Alert`,
      message: `Watching when ${alertIng} goes ${condition} ₹${targetPrice} in ${currentCity.name}`,
      severity: condition === 'below' ? 'success' : 'warning',
      actionLabel: 'View Suppliers',
      actionHref: '/app/suppliers',
    });
    setShowAlertModal(false);
    setToastMessage(`Price alert active for ${alertIng} ${condition} ₹${targetPrice}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSimulateSurge = () => {
    setToastMessage(`Mandi Alert: Azadpur Tomato prices surged +18% due to morning monsoon delay.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#263D2D] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#F8C45C] animate-in fade-in slide-in-from-top-4">
          <Bell className="w-4 h-4 text-[#F8C45C] shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Warm Daily Briefing Header */}
      <div className="bg-[#FFFDF8] border border-[#263D2D]/10 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#F8C45C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FFF9EF] border-2 border-[#F8C45C] flex items-center justify-center shadow-inner shrink-0 overflow-hidden">
              <MascotFace emotion="happy" size={56} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#315B42] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#F8C45C]" />
                Daily Kitchen Intelligence
              </div>
              <h1 className="text-2xl sm:text-3xl font-fraunces font-bold text-[#263D2D] mt-0.5">
                Good morning, Chef Raghav!
              </h1>
              <p className="text-sm text-[#66523B] mt-1 max-w-xl">
                We discovered <strong className="text-[#315B42]">₹{totalSavings.toLocaleString('en-IN')}/month</strong> in direct mandi procurement savings across your {currentCity.name} menu.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            <Link
              href="/app/savings"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#263D2D] text-white text-xs font-semibold hover:bg-[#315B42] transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <TrendingDown className="w-4 h-4 text-[#F8C45C]" />
              View Savings Bill
            </Link>
            <Link
              href="/app/assistant"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#F8C45C] text-[#263D2D] text-xs font-bold hover:bg-[#f3b942] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Ask Chef Hub Copilot
            </Link>
          </div>
        </div>

        {/* 3 Action Metric Pill Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#263D2D]/10">
          <Link
            href="/app/menu?view=ingredients"
            className="p-3.5 rounded-2xl bg-[#FFF9EF] border border-[#263D2D]/10 hover:border-[#F8C45C] transition-all group flex items-center justify-between"
          >
            <div>
              <div className="text-[11px] text-[#66523B] font-medium">Mapped Ingredients</div>
              <div className="text-lg font-bold text-[#263D2D] font-mono">{ingredients.length} items</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#66523B] group-hover:text-[#263D2D] group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/app/suppliers"
            className="p-3.5 rounded-2xl bg-[#FFF9EF] border border-[#263D2D]/10 hover:border-[#F8C45C] transition-all group flex items-center justify-between"
          >
            <div>
              <div className="text-[11px] text-[#66523B] font-medium">Active Mandi Suppliers</div>
              <div className="text-lg font-bold text-[#263D2D] font-mono">12 verified vendors</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#66523B] group-hover:text-[#263D2D] group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/app/shopping-list"
            className="p-3.5 rounded-2xl bg-[#FFF9EF] border border-[#263D2D]/10 hover:border-[#F8C45C] transition-all group flex items-center justify-between"
          >
            <div>
              <div className="text-[11px] text-[#66523B] font-medium">Current Order Slip</div>
              <div className="text-lg font-bold text-[#263D2D] font-mono">{shoppingList.length} items ready</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#66523B] group-hover:text-[#263D2D] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Secondary Row: Active Alerts & Order Slip Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Price Watchers & Mandi Alerts */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#263D2D]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#263D2D] font-outfit flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#F8C45C]" />
                  Active Mandi Price Alerts
                </h3>
                <p className="text-xs text-[#66523B]">Automatic notifications when wholesale mandi prices cross thresholds</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateSurge}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#66523B] hover:text-[#263D2D] border border-[#263D2D]/15 rounded-xl hover:bg-[#FFF9EF] transition-colors"
                >
                  Simulate Surge
                </button>
                <button
                  onClick={() => setShowAlertModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#263D2D] text-white text-xs font-semibold hover:bg-[#315B42] flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Set Alert
                </button>
              </div>
            </div>

            {/* Price Alerts List */}
            <div className="space-y-2.5">
              {alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-2xl bg-[#FFF9EF]/80 border border-[#263D2D]/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                      alert.read ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {alert.type === 'price_drop' ? '↓' : '↑'}
                    </div>
                    <div>
                      <div className="font-semibold text-[#263D2D]">{alert.title}</div>
                      <div className="text-[11px] text-[#66523B]">
                        {alert.message}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    !alert.read ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {!alert.read ? 'Triggered Today' : 'Watching Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Outlets Overview */}
          <div className="bg-white rounded-3xl p-6 border border-[#263D2D]/10 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#315B42]/10 text-[#315B42] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#263D2D]">
                  {restaurant.name} ({restaurant.outlets?.length || 1} Outlets Configured)
                </div>
                <div className="text-xs text-[#66523B]">
                  Primary kitchen: {currentCity.name} • Serving ~12,500 portions/month
                </div>
              </div>
            </div>
            <Link
              href="/app/settings"
              className="text-xs font-semibold text-[#315B42] hover:underline"
            >
              Manage Outlets
            </Link>
          </div>
        </div>

        {/* Right Column: Shopping List Order Slip preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#263D2D]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#263D2D] font-outfit flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#315B42]" />
                  Active Grocery Slip
                </h3>
                <p className="text-xs text-[#66523B]">{shoppingList.length} procurement line items</p>
              </div>
              <Link
                href="/app/shopping-list"
                className="text-xs font-semibold text-[#315B42] hover:underline flex items-center gap-1"
              >
                Open Full Slip <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2 border-y border-[#263D2D]/10 py-3">
              {shoppingList.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1">
                  <div className="truncate pr-2">
                    <span className="font-semibold text-[#263D2D]">{item.ingredientName}</span>
                    <span className="text-[10px] text-[#66523B] ml-1">({item.quantity} {item.unit})</span>
                  </div>
                  <span className="font-mono font-bold text-[#263D2D] shrink-0">
                    ₹{Math.round(item.quantity * item.estPricePerUnit).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-[#66523B]">Projected Savings:</span>
              <span className="font-bold text-emerald-700 font-mono">
                ₹{Math.round(shoppingList.reduce((acc, it) => acc + (it.estPricePerUnit * 0.25) * it.quantity, 0)).toLocaleString('en-IN')} saved
              </span>
            </div>

            <Link
              href="/app/shopping-list"
              className="w-full py-2.5 rounded-2xl bg-[#263D2D] text-white font-semibold text-xs text-center block hover:bg-[#315B42] transition-colors"
            >
              Export Order Slip for Head Chef
            </Link>
          </div>
        </div>
      </div>

      {/* CREATE ALERT MODAL */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#263D2D]/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#263D2D]/10 pb-3">
              <h3 className="text-base font-bold text-[#263D2D] font-outfit">Create Mandi Price Alert</h3>
              <button onClick={() => setShowAlertModal(false)} className="text-[#66523B] hover:text-[#263D2D]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#263D2D] mb-1">Select Ingredient</label>
                <select
                  value={alertIng}
                  onChange={(e) => setAlertIng(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-[#263D2D] focus:outline-none focus:border-[#263D2D]"
                >
                  {ingredients.map(ing => (
                    <option key={ing.id} value={ing.name}>{ing.name} ({ing.standardUnit})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#263D2D] mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as 'below' | 'above')}
                    className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-[#263D2D] focus:outline-none focus:border-[#263D2D]"
                  >
                    <option value="below">Drops below (Buy signal)</option>
                    <option value="above">Surges above (Inflation)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#263D2D] mb-1">Target Price (₹)</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#263D2D]/20 bg-[#FFF9EF] text-[#263D2D] focus:outline-none focus:border-[#263D2D]"
                    placeholder="e.g. 280"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#263D2D]/15 text-[#66523B] hover:bg-[#FFF9EF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#263D2D] text-white font-semibold hover:bg-[#315B42]"
                >
                  Save Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
