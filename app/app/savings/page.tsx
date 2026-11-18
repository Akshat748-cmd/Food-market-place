'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Receipt,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ChefIllustration } from '@/components/illustrations';

const FoodCostDonutChart = dynamic(() => import('@/components/savings/SavingsCharts').then((m) => m.FoodCostDonutChart), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center bg-cream-50 rounded-xl text-xs text-[#8A7662]">Loading category breakdown...</div>,
});

const SixMonthSavingsChart = dynamic(() => import('@/components/savings/SavingsCharts').then((m) => m.SixMonthSavingsChart), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center bg-cream-50 rounded-xl text-xs text-[#8A7662]">Loading historical comparisons...</div>,
});

export default function SavingsPage() {
  const isHydrated = useHydrated();
  const {
    dishes,
    ingredients,
    wastageLogs,
    addWastageLog,
    applySubstitution,
    getCurrentRestaurant,
    getCurrentCity,
  } = useAppStore();

  const currentRestaurant = isHydrated ? getCurrentRestaurant() : null;
  const currentCity = isHydrated ? getCurrentCity() : null;

  // Count up animation for total savings
  const [savingsCount, setSavingsCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = 62500;
    const increment = end / 50;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setSavingsCount(end);
        clearInterval(timer);
      } else {
        setSavingsCount(Math.floor(start));
      }
    }, 25);
    return () => clearInterval(timer);
  }, []);

  // Wastage modal
  const [wastageModalOpen, setWastageModalOpen] = useState(false);
  const [wasteIngredient, setWasteIngredient] = useState('ing-tomato-16');
  const [wasteQty, setWasteQty] = useState('10');
  const [wasteReason, setWasteReason] = useState<'spoilage' | 'prep_loss' | 'over_portioning' | 'expired'>('spoilage');

  // Smart substitution state
  const [subAccepted, setSubAccepted] = useState(false);

  const handleLogWastage = (e: React.FormEvent) => {
    e.preventDefault();
    const ing = ingredients.find((i) => i.id === wasteIngredient);
    const qty = Number(wasteQty) || 1;
    const cost = (ing?.bestCityPrice || 30) * qty;

    addWastageLog({
      ingredientId: wasteIngredient,
      ingredientName: ing?.name || 'Produce Item',
      quantity: qty,
      unit: ing?.standardUnit || 'kg',
      reason: wasteReason,
      costLost: cost,
    });
    setWastageModalOpen(false);
  };

  const handleAcceptSubstitution = () => {
    applySubstitution('ing-cashew-tukda-21', 'ing-magaz-seeds', 'Watermelon Seed Emulsion', 320);
    setSubAccepted(true);
  };

  const totalWastageLoss = wastageLogs.reduce((acc, curr) => acc + curr.costLost, 0);

  return (
    <div className="space-y-8 pb-28">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#E4D7C0]">
        <SectionHeading
          badge="Executive Margin Optimization"
          title="Procurement Savings Ledger"
          serifAccent="& Food Cost Control"
          subtitle={`Verified bottom-line savings and ingredient profitability audit for ${currentRestaurant?.name || 'Dawat-e-Khaas'}.`}
        />
      </div>

      {/* HERO SECTION: Single Receipt Card (Monthly Savings Bill) */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#FFFDF9] border border-[#E0D1B8] rounded-[28px] p-6 sm:p-9 shadow-warm-lg relative font-mono text-xs text-[#2C1E14]">
          {/* Perforated Top Header */}
          <div className="text-center pb-5 border-b-2 border-dashed border-[#E4D7C0] space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EAF3ED] text-[#315B42] text-[10px] font-bold uppercase tracking-wider">
              <Receipt className="w-3.5 h-3.5" />
              <span>Official Monthly Audit</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-[#2C1E14] mt-1">
              FOOD MARKET HUB PROCUREMENT INVOICE
            </h2>
            <p className="text-[11px] text-[#8A7662]">
              Outpost: Connaught Place &bull; Mandi Zone: {currentCity?.name || 'Delhi NCR'}
            </p>
            <p className="text-[10px] text-[#A48E75]">Cycle: 30-Day Automated Mandi Sourcing</p>
          </div>

          {/* Dotted Leader Line Items */}
          <div className="py-6 space-y-3.5 text-xs sm:text-sm">
            <div className="flex justify-between items-baseline">
              <span className="font-sans font-medium text-[#2C1E14]">Verka Mandi Malai Paneer (240kg)</span>
              <span className="flex-1 border-b border-dotted border-[#D1BF9F] mx-2" />
              <span className="font-bold text-[#315B42] font-mono">-₹13,200</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="font-sans font-medium text-[#2C1E14]">Ghazipur Prime Boneless Breast (280kg)</span>
              <span className="flex-1 border-b border-dotted border-[#D1BF9F] mx-2" />
              <span className="font-bold text-[#315B42] font-mono">-₹12,600</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="font-sans font-medium text-[#2C1E14]">Khyber Agro Churned White Butter (90kg)</span>
              <span className="flex-1 border-b border-dotted border-[#D1BF9F] mx-2" />
              <span className="font-bold text-[#315B42] font-mono">-₹5,850</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="font-sans font-medium text-[#2C1E14]">Ghazipur Prime Curry Cut Chicken (220kg)</span>
              <span className="flex-1 border-b border-dotted border-[#D1BF9F] mx-2" />
              <span className="font-bold text-[#315B42] font-mono">-₹7,700</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="font-sans font-medium text-[#2C1E14]">Azadpur APMC Tomatoes & Onions (620kg)</span>
              <span className="flex-1 border-b border-dotted border-[#D1BF9F] mx-2" />
              <span className="font-bold text-[#315B42] font-mono">-₹6,520</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="font-sans font-medium text-[#2C1E14]">Naya Bazar Aged 1121 Basmati & Grains</span>
              <span className="flex-1 border-b border-dotted border-[#D1BF9F] mx-2" />
              <span className="font-bold text-[#315B42] font-mono">-₹6,210</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="font-sans font-medium text-[#2C1E14]">Khari Baoli Whole Spices & Packaging</span>
              <span className="flex-1 border-b border-dotted border-[#D1BF9F] mx-2" />
              <span className="font-bold text-[#315B42] font-mono">-₹10,420</span>
            </div>
          </div>

          {/* Dotted Total & Perforated Footer */}
          <div className="pt-4 border-t-2 border-dashed border-[#E4D7C0] space-y-3">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="font-serif uppercase text-[#66523B]">TOTAL MONTHLY SAVINGS</span>
              <span className="text-3xl font-black text-[#315B42] font-mono">
                ₹{savingsCount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 bg-[#EAF3ED] border border-[#C5DEC9] rounded-xl text-center text-xs font-sans font-semibold text-[#315B42]">
              Food cost reduced from 35.8% &rarr; 30.5% (+5.3% Net Operating Margin)
            </div>

            <div className="text-center pt-2 text-[10px] text-[#A48E75] font-serif italic">
              Thank you for sourcing smarter with Food Market Hub &bull; Certified Daily Mandi Index
            </div>
          </div>
        </div>
      </div>

      {/* EDITORIAL SECTION 1: Food Cost Breakdown Donut & 6-Month Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 bg-white border border-[#EBE1CF] rounded-[24px] p-6 shadow-warm space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#2C1E14]">Procurement Category Share</h3>
            <p className="text-xs text-[#8A7662]">Dairy & Poultry make up 62% of raw ingredient spend.</p>
          </div>
          <FoodCostDonutChart />
        </div>

        <div className="lg:col-span-7 bg-white border border-[#EBE1CF] rounded-[24px] p-6 shadow-warm space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#2C1E14]">6-Month Savings Trajectory</h3>
            <p className="text-xs text-[#8A7662]">Historical spend vs optimized mandi rates across Delhi NCR.</p>
          </div>
          <SixMonthSavingsChart />
        </div>
      </div>

      {/* EDITORIAL SECTION 2: Dish Profitability with 30% Target Line */}
      <div className="bg-white border border-[#EBE1CF] rounded-[28px] p-6 sm:p-8 shadow-warm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F1E8D8]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#315B42]">
              Recipe Margin Audit
            </span>
            <h3 className="text-xl font-bold text-[#2C1E14]">Dish Profitability vs 30% Food Cost Target</h3>
            <p className="text-xs text-[#8A7662]">
              Target food cost is 30.0%. Items above target are flagged for portion or supplier renegotiation.
            </p>
          </div>
          <span className="text-xs font-bold text-[#315B42] bg-[#EAF3ED] px-3 py-1 rounded-full border border-[#C5DEC9] self-start sm:self-auto">
            Target Line: 30.0%
          </span>
        </div>

        <div className="space-y-4">
          {dishes.slice(0, 6).map((dish, i) => {
            // Simulated realistic food cost percentages
            const foodCostPercents = [34.5, 27.2, 33.8, 28.5, 24.1, 36.2];
            const costPercent = foodCostPercents[i % foodCostPercents.length];
            const isAboveTarget = costPercent > 30.0;
            const portionRawCost = Math.round((dish.price * costPercent) / 100);

            return (
              <div key={dish.id} className="space-y-1.5 p-3.5 bg-cream-50/70 rounded-2xl border border-[#EBE1CF]">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-[#2C1E14]">{dish.name}</span>
                    <span className="text-[10px] text-[#8A7662]">({formatCurrency(dish.price)})</span>
                    {isAboveTarget && (
                      <span className="text-[10px] font-bold text-[#C2410C] bg-[#FEE2E2] px-2 py-0.5 rounded-full border border-[#FECACA]">
                        Above Target (+{(costPercent - 30).toFixed(1)}%)
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold ${isAboveTarget ? 'text-[#C2410C]' : 'text-[#315B42]'}`}>
                      {costPercent}% Food Cost (₹{portionRawCost})
                    </span>
                  </div>
                </div>

                {/* Progress bar with 30% target mark */}
                <div className="relative w-full bg-[#E4D7C0] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isAboveTarget ? 'bg-[#C2410C]' : 'bg-[#315B42]'
                    }`}
                    style={{ width: `${Math.min(100, (costPercent / 45) * 100)}%` }}
                  />
                  {/* 30% target marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#2C1E14] z-10"
                    style={{ left: `${(30 / 45) * 100}%` }}
                    title="30% Target"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EDITORIAL SECTION 3: Smart Substitution & Wastage Tracking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Smart Substitution Card */}
        <div className="lg:col-span-6 bg-white border border-[#EBE1CF] rounded-[24px] p-6 shadow-warm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#F8C45C]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#315B42]">
                AI Culinary Substitution
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#2C1E14]">Magaz Melon Seed Blend for Shahi Gravy</h3>
            <p className="text-xs text-[#66523B] leading-relaxed mt-1">
              Replace 50% broken cashew nuts (₹610/kg) with stone-ground melon seeds (₹180/kg). Retains creamy silkiness while saving 42% on nut base costs.
            </p>

            <div className="mt-4 p-3 bg-cream-50 rounded-xl border border-[#F1E8D8] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8A7662]">Current Cashew Spend</span>
                <strong className="text-[#C2410C]">₹15,250 / mo</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A7662]">With Magaz Blend</span>
                <strong className="text-[#315B42]">₹9,800 / mo</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E4D7C0] font-bold">
                <span className="text-[#2C1E14]">Net Monthly Increase in Savings</span>
                <span className="text-[#315B42]">+₹5,450 / mo</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            {subAccepted ? (
              <div className="p-3 bg-[#EAF3ED] border border-[#C5DEC9] rounded-xl text-center text-xs font-bold text-[#315B42] flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Substitution Applied to Shahi Paneer & Korma Recipes!</span>
              </div>
            ) : (
              <Button variant="primary" size="md" fullWidth onClick={handleAcceptSubstitution}>
                Accept Substitution & Update Sourcing &rarr;
              </Button>
            )}
          </div>
        </div>

        {/* Wastage Tracking Panel */}
        <div className="lg:col-span-6 bg-white border border-[#EBE1CF] rounded-[24px] p-6 shadow-warm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#C2410C]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2410C]">
                  Kitchen Wastage Log
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setWastageModalOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Log Spoilage
              </Button>
            </div>

            <h3 className="text-lg font-bold text-[#2C1E14]">Food Spoilage & Prep Loss</h3>
            <p className="text-xs text-[#8A7662] mt-0.5">
              Recorded waste directly erodes your gross margin. Total logged loss: <strong className="text-[#C2410C]">{formatCurrency(totalWastageLoss)}</strong>.
            </p>

            <div className="mt-4 space-y-2">
              {wastageLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-cream-50 rounded-xl border border-[#EBE1CF] flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-[#2C1E14]">{log.ingredientName}</h5>
                    <span className="text-[10px] text-[#8A7662]">
                      {log.quantity} {log.unit} &bull; Reason: {log.reason.replace('_', ' ')} &bull; {log.date}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#C2410C]">-{formatCurrency(log.costLost)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-xs text-[#B45309]">
            💡 <strong>Preventative Insight:</strong> Switching tomatoes to smaller 3-day APMC batch deliveries prevents 80% of current box spoilage.
          </div>
        </div>
      </div>

      {/* Log Spoilage Modal */}
      {wastageModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setWastageModalOpen(false)}
          title="Log Kitchen Food Waste"
          description="Record spoiled raw ingredients to improve ordering MOQ forecasts."
        >
          <form onSubmit={handleLogWastage} className="space-y-4 pt-2">
            <Select
              label="Spoiled Ingredient"
              value={wasteIngredient}
              onChange={(e) => setWasteIngredient(e.target.value)}
              options={ingredients.slice(0, 10).map((i) => ({ label: `${i.name} (${i.standardUnit})`, value: i.id }))}
            />

            <Input
              label="Quantity Lost"
              type="number"
              required
              placeholder="e.g. 8"
              value={wasteQty}
              onChange={(e) => setWasteQty(e.target.value)}
            />

            <Select
              label="Primary Reason"
              value={wasteReason}
              onChange={(e) => setWasteReason(e.target.value as any)}
              options={[
                { label: 'Storage Spoilage / Moisture', value: 'spoilage' },
                { label: 'Kitchen Prep Trimming Loss', value: 'prep_loss' },
                { label: 'Over-portioning on Plate', value: 'over_portioning' },
                { label: 'Expired Expiry Date', value: 'expired' },
              ]}
            />

            <div className="pt-2 flex gap-3">
              <Button variant="primary" size="md" fullWidth type="submit">
                Record Waste Entry
              </Button>
              <Button variant="ghost" size="md" fullWidth type="button" onClick={() => setWastageModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
