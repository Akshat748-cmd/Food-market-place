'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Percent,
  Sparkles,
  ArrowRight,
  Search,
  X,
  Plus,
  Trash2,
  ChefHat,
  ChevronRight,
  DollarSign,
  Layers,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Dish, FoodType } from '@/types';
import { getIngredientIllustration } from '@/lib/ingredientVisuals';
import { useScrollLock } from '@/hooks/useScrollLock';

const TARGET_FOOD_COST_PERCENT = 28.0;

export default function MenuProfitabilityPage() {
  const isHydrated = useHydrated();
  const { dishes, ingredients, updateDish, getCurrentRestaurant } = useAppStore();

  const currentRestaurant = isHydrated ? getCurrentRestaurant() : null;

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'profitable' | 'attention'>('all');

  // Selected dish for Detailed Recipe Costing Drawer
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useScrollLock(Boolean(selectedDish));

  // Calculate COGS and Food Cost % for each dish using current mandi ingredient rates
  const dishesWithCosting = useMemo(() => {
    return dishes.map((dish) => {
      // Calculate total ingredient cost per portion
      let recipeCostPerPortion = 0;
      const ingredientBreakdown = dish.ingredients.map((di) => {
        const matched = ingredients.find(
          (ing) =>
            ing.id === di.ingredientId ||
            ing.name.toLowerCase().includes(di.ingredientName.toLowerCase())
        );

        // Price per unit (default to best mandi price)
        const unitPrice = matched ? matched.bestCityPrice : 280;
        const lineCost = Math.round(di.quantityPerPortion * unitPrice * 10) / 10;
        recipeCostPerPortion += lineCost;

        return {
          ingredientId: di.ingredientId,
          name: di.ingredientName,
          quantity: di.quantityPerPortion,
          unit: di.unit,
          unitPrice,
          lineCost,
        };
      });

      // Default baseline fallback if recipe ingredients are empty
      if (recipeCostPerPortion === 0) {
        recipeCostPerPortion = Math.round(dish.price * 0.29);
      }

      const foodCostPercentage = Math.round((recipeCostPerPortion / Math.max(1, dish.price)) * 1000) / 10;
      const contributionMargin = Math.max(0, dish.price - recipeCostPerPortion);
      const marginPercent = Math.round((contributionMargin / Math.max(1, dish.price)) * 100);
      const isProfitable = foodCostPercentage <= TARGET_FOOD_COST_PERCENT;
      const monthlyTotalProfit = Math.round(contributionMargin * (dish.portionsSoldPerMonth || 150));

      return {
        ...dish,
        recipeCostPerPortion,
        foodCostPercentage,
        contributionMargin,
        marginPercent,
        isProfitable,
        monthlyTotalProfit,
        ingredientBreakdown,
      };
    });
  }, [dishes, ingredients]);

  // High-level summary metrics
  const summaryMetrics = useMemo(() => {
    if (dishesWithCosting.length === 0) {
      return { avgFoodCost: 28.5, profitableCount: 0, attentionCount: 0 };
    }

    const totalFoodCostSum = dishesWithCosting.reduce((acc, d) => acc + d.foodCostPercentage, 0);
    const avgFoodCost = Math.round((totalFoodCostSum / dishesWithCosting.length) * 10) / 10;
    const profitableCount = dishesWithCosting.filter((d) => d.isProfitable).length;
    const attentionCount = dishesWithCosting.length - profitableCount;

    return {
      avgFoodCost,
      profitableCount,
      attentionCount,
    };
  }, [dishesWithCosting]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return dishesWithCosting.filter((d) => {
      if (statusFilter === 'profitable' && !d.isProfitable) return false;
      if (statusFilter === 'attention' && d.isProfitable) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [dishesWithCosting, statusFilter, searchQuery]);

  // Selected Drawer Dish live object
  const activeDrawerDish = useMemo(() => {
    if (!selectedDish) return null;
    return dishesWithCosting.find((d) => d.id === selectedDish.id) || null;
  }, [selectedDish, dishesWithCosting]);

  // 1-Click Apply Recommendation (optimizes portion or price)
  const handleApplyRecommendation = (type: 'price' | 'substitute') => {
    if (!activeDrawerDish) return;

    if (type === 'price') {
      const newPrice = Math.round(activeDrawerDish.price * 1.08); // +8% price adjustment
      updateDish({
        ...activeDrawerDish,
        price: newPrice,
      });
      setToastMessage(`Updated ${activeDrawerDish.name} menu price to ₹${newPrice}. Food cost normalized!`);
    } else {
      // Ingredient portion trim
      const updatedIngredients = activeDrawerDish.ingredients.map((i) => ({
        ...i,
        quantityPerPortion: Math.round(i.quantityPerPortion * 0.92 * 100) / 100, // 8% efficiency in prep
      }));
      updateDish({
        ...activeDrawerDish,
        ingredients: updatedIngredients,
      });
      setToastMessage(`Optimized recipe portions for ${activeDrawerDish.name}. Kitchen margin protected!`);
    }

    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-28">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#263D2D] text-white px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2.5 border border-[#F8C45C] text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F8C45C] shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white ml-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 1. HEADER (Heading & Subtitle) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E4D7C0]/70 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-fraunces text-[#2C1E14] tracking-tight">
              Menu Profitability
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#FEF6E4] border border-[#F8C45C]/50 text-[#8C5D08] text-[11px] font-semibold">
              Target Food Cost: {TARGET_FOOD_COST_PERCENT}%
            </span>
          </div>
          <p className="text-xs text-[#66523B] mt-0.5 font-normal">
            Dish-level recipe costing, contribution margins and food cost variance optimization.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="bg-[#F1E8D8] p-0.5 rounded-lg inline-flex items-center text-xs font-bold border border-[#E0D1B8]">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-[#2C1E14] shadow-xs'
                : 'text-[#66523B] hover:text-[#2C1E14]'
            }`}
          >
            All Dishes ({dishes.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('profitable')}
            className={`px-3 py-1 rounded-md transition-all ${
              statusFilter === 'profitable'
                ? 'bg-white text-[#2C1E14] shadow-xs'
                : 'text-[#66523B] hover:text-[#2C1E14]'
            }`}
          >
            Profitable ({summaryMetrics.profitableCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('attention')}
            className={`px-3 py-1 rounded-md transition-all ${
              statusFilter === 'attention'
                ? 'bg-white text-[#C2410C] shadow-xs'
                : 'text-[#66523B] hover:text-[#2C1E14]'
            }`}
          >
            Needs Attention ({summaryMetrics.attentionCount})
          </button>
        </div>
      </div>

      {/* 2. TOP KPI SUMMARY (Target vs Actual Food Cost) */}
      <div className="bg-[#FFFDF8] border border-[#263D2D]/15 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 bg-white border border-[#E4D7C0] rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[#8A7662] block">
              Average Restaurant Food Cost
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold font-mono text-[#2C1E14]">
                {summaryMetrics.avgFoodCost}%
              </span>
              <span className="text-[11px] text-[#8A7662]">of sales</span>
            </div>
            <span className="text-[10px] text-[#8A7662]">Weighted across all active recipes</span>
          </div>

          <div className="p-3 bg-[#EAF3ED] border border-[#315B42]/20 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[#315B42] block">
              Target Food Cost Benchmark
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold font-mono text-[#315B42]">
                {TARGET_FOOD_COST_PERCENT}%
              </span>
              <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-1.5 py-0.2 rounded">
                Optimal
              </span>
            </div>
            <span className="text-[10px] text-[#315B42]/80">Industry standard for casual dining</span>
          </div>

          <div className="p-3 bg-[#FEF6E4] border border-[#F8C45C]/60 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[#8C5D08] block">
              Profitable Menu Items
            </span>
            <span className="text-lg font-bold font-mono text-[#8C5D08] mt-0.5 block">
              {summaryMetrics.profitableCount} dishes
            </span>
            <span className="text-[10px] text-[#8C5D08]/80">Operating within target food cost</span>
          </div>

          <div className="p-3 bg-[#FFF1F2] border border-[#FECDD3] rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[#9F1239] block">
              Dishes Needing Attention
            </span>
            <span className="text-lg font-bold font-mono text-[#E11D48] mt-0.5 block">
              {summaryMetrics.attentionCount} dishes
            </span>
            <span className="text-[10px] text-[#9F1239]/80">Food cost exceeds {TARGET_FOOD_COST_PERCENT}%</span>
          </div>
        </div>
      </div>

      {/* 3. DISH PROFITABILITY LIST & PROGRESS BARS */}
      <div className="bg-white border border-[#E0D1B8] rounded-2xl p-4 sm:p-5 shadow-warm-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1E8D8] pb-3">
          <div>
            <h2 className="text-base font-bold font-fraunces text-[#2C1E14]">
              Dish Recipe Costing & Margin Table
            </h2>
            <p className="text-xs text-[#66523B]">
              Real-time variance between selling price, raw wholesale ingredients and gross margin.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative sm:w-56 shrink-0">
            <Search className="w-3.5 h-3.5 text-[#8A7662] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 rounded-lg border border-[#E4D7C0] bg-white text-xs text-[#2C1E14] focus:outline-none h-7.5"
            />
          </div>
        </div>

        {/* Dish List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E4D7C0] text-[#8A7662] uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Recipe Name</th>
                <th className="py-2.5 px-3 text-right">Selling Price</th>
                <th className="py-2.5 px-3 text-right">Ingredient Cost</th>
                <th className="py-2.5 px-3 text-right">Food Cost %</th>
                <th className="py-2.5 px-3">Variance vs Target</th>
                <th className="py-2.5 px-3 text-right">Gross Margin</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1E8D8]">
              {filteredDishes.map((dish) => {
                const isOverTarget = dish.foodCostPercentage > TARGET_FOOD_COST_PERCENT;

                return (
                  <tr
                    key={dish.id}
                    onClick={() => setSelectedDish(dish)}
                    className="hover:bg-[#FFF9EF]/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 border border-[#E4D7C0]">
                          <Image src={dish.image} alt={dish.name} fill sizes="32px" className="object-cover" />
                        </div>
                        <div>
                          <span className="font-semibold text-[#2C1E14] group-hover:text-[#315B42] block">
                            {dish.name}
                          </span>
                          <span className="text-[10px] text-[#8A7662]">{dish.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-[#2C1E14]">
                      {formatCurrency(dish.price)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#66523B]">
                      {formatCurrency(dish.recipeCostPerPortion)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[11px] ${
                          isOverTarget
                            ? 'bg-[#FEE2E2] text-[#C2410C]'
                            : 'bg-[#DCFCE7] text-[#166534]'
                        }`}
                      >
                        {dish.foodCostPercentage}%
                      </span>
                    </td>

                    {/* Visual Progress Bar vs Target */}
                    <td className="py-3 px-3 w-40">
                      <div className="space-y-1">
                        <div className="w-full bg-[#F1E8D8] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              dish.foodCostPercentage > 33
                                ? 'bg-[#DC2626]'
                                : isOverTarget
                                ? 'bg-[#F59E0B]'
                                : 'bg-[#166534]'
                            }`}
                            style={{ width: `${Math.min(100, (dish.foodCostPercentage / 45) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-[#8A7662] block">
                          Target: {TARGET_FOOD_COST_PERCENT}% ({isOverTarget ? `+${(dish.foodCostPercentage - TARGET_FOOD_COST_PERCENT).toFixed(1)}% variance` : 'Within budget ✓'})
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-[#1D432B]">
                      {formatCurrency(dish.contributionMargin)}
                      <span className="text-[10px] font-normal text-[#8A7662] block">
                        {dish.marginPercent}% margin
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDish(dish);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#263D2D] hover:bg-[#315B42] text-white text-xs font-semibold whitespace-nowrap shadow-xs transition-all active:scale-95"
                      >
                        <span>View Costing</span>
                        <span className="text-[#F8C45C] font-bold">&rarr;</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. RECIPE COSTING DRAWER (Detailed Dish Cost Breakdown & 1-Click Optimizer) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeDrawerDish && (
          <div className="fixed inset-0 z-50 flex justify-end p-2 sm:p-3 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDish(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 w-full sm:w-[390px] bg-white max-h-[calc(100vh-24px)] my-auto rounded-2xl shadow-2xl flex flex-col border border-[#E4D7C0] overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="p-3 px-3.5 border-b border-[#F1E8D8] bg-[#FFF9EF] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden relative shrink-0 border border-[#E4D7C0]">
                    <Image src={activeDrawerDish.image} alt={activeDrawerDish.name} fill sizes="36px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-fraunces font-bold text-xs sm:text-sm text-[#2C1E14] truncate">
                      {activeDrawerDish.name} Costing
                    </h3>
                    <span className="text-[10px] text-[#8A7662]">
                      Selling: {formatCurrency(activeDrawerDish.price)} &bull; {activeDrawerDish.foodCostPercentage}% Food Cost
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDish(null)}
                  className="w-7 h-7 rounded-full bg-[#F1E8D8] hover:bg-[#E2D5BF] flex items-center justify-center text-[#66523B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-3 overflow-y-auto flex-1 space-y-3 text-xs">
                {/* Cost KPI Snapshot */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#FFF9EF] border border-[#E4D7C0]">
                    <span className="text-[10px] text-[#8A7662] block">Recipe Cost (COGS)</span>
                    <span className="font-mono font-bold text-sm text-[#2C1E14]">
                      {formatCurrency(activeDrawerDish.recipeCostPerPortion)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#EAF3ED] border border-[#315B42]/20">
                    <span className="text-[10px] text-[#315B42] block">Gross Margin / Dish</span>
                    <span className="font-mono font-bold text-sm text-[#315B42]">
                      {formatCurrency(activeDrawerDish.contributionMargin)} ({activeDrawerDish.marginPercent}%)
                    </span>
                  </div>
                </div>

                {/* Recipe Ingredient Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-[#2C1E14]">
                      Recipe Commodity Breakdown
                    </span>
                    <span className="text-[10px] text-[#8A7662]">Mandi Wholesale Spot Rates</span>
                  </div>

                  <div className="divide-y divide-[#F1E8D8] border border-[#E4D7C0] rounded-xl overflow-hidden bg-[#FFFDF9]">
                    {activeDrawerDish.ingredientBreakdown.map((item, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded bg-white border border-[#E4D7C0] flex items-center justify-center shrink-0">
                            {getIngredientIllustration(item.name, '', 16)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-[#2C1E14] block truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-[#8A7662]">
                              {item.quantity} {item.unit} @ ₹{item.unitPrice}/{item.unit}
                            </span>
                          </div>
                        </div>

                        <span className="font-mono font-bold text-xs text-[#2C1E14] shrink-0">
                          ₹{item.lineCost}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optimization Recommendations Section */}
                <div className="p-3.5 bg-[#FEF6E4] border border-[#F8C45C] rounded-xl space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[#8C5D08]">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span className="font-bold text-xs">AI Profitability Optimization</span>
                  </div>

                  {activeDrawerDish.foodCostPercentage > TARGET_FOOD_COST_PERCENT ? (
                    <div className="space-y-2 text-[11px] text-[#66523B]">
                      <p>
                        This dish operates at <strong>{activeDrawerDish.foodCostPercentage}%</strong> food cost, which is{' '}
                        <strong>{(activeDrawerDish.foodCostPercentage - TARGET_FOOD_COST_PERCENT).toFixed(1)}% above</strong> your kitchen target.
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleApplyRecommendation('price')}
                          className="w-full py-1.5 px-2.5 bg-white border border-[#F8C45C] rounded-lg text-left font-semibold text-[#2C1E14] hover:bg-[#FFFDF9] flex items-center justify-between"
                        >
                          <span>Adjust menu price by +₹{Math.round(activeDrawerDish.price * 0.08)}</span>
                          <span className="text-[10px] font-bold text-[#166534]">Apply &rarr;</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplyRecommendation('substitute')}
                          className="w-full py-1.5 px-2.5 bg-white border border-[#F8C45C] rounded-lg text-left font-semibold text-[#2C1E14] hover:bg-[#FFFDF9] flex items-center justify-between"
                        >
                          <span>Trim portion prep margin by 8%</span>
                          <span className="text-[10px] font-bold text-[#166534]">Apply &rarr;</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#166534] font-medium">
                      ✓ Excellent profitability! This recipe delivers a solid {activeDrawerDish.marginPercent}% contribution margin.
                    </p>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-2.5 px-3 border-t border-[#F1E8D8] bg-[#FFF9EF] flex items-center justify-between shrink-0">
                <span className="text-[10px] text-[#8A7662]">
                  Recalculates with mandi prices
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDish(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#263D2D] text-white text-xs font-bold hover:bg-[#315B42]"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
