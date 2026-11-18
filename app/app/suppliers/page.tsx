'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Clock,
  Truck,
  Sparkles,
  ShoppingBag,
  Scale,
  X,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Check,
  Edit2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Building2,
  Store,
  Layers,
  Info,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { BestPriceBadge } from '@/components/ui/BestPriceBadge';
import { Toast } from '@/components/ui/Toast';
import { RawIngredientVisual, getIngredientIllustration, SupplierTypeBadge } from '@/lib/ingredientVisuals';
import { useScrollLock } from '@/hooks/useScrollLock';
import { Supplier, SupplierPrice, Ingredient } from '@/types';

export default function SuppliersPage() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const {
    getCurrentCity,
    ingredients,
    dishes,
    suppliers,
    supplierPrices,
    addShoppingItem,
    updateIngredientUserPrice,
  } = useAppStore();

  const currentCity = isHydrated ? getCurrentCity() : null;

  // View state: Best Prices (default) | Side-by-side | By Supplier
  const [activeTab, setActiveTab] = useState<'best_prices' | 'side_by_side' | 'by_supplier'>('best_prices');

  // Comparison selector: My current price | Retail price | Market average
  const [compareTarget, setCompareTarget] = useState<'my_price' | 'retail' | 'market_avg'>('my_price');

  // Include delivery fee in landed price toggle (default: true)
  const [includeDelivery, setIncludeDelivery] = useState(true);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'biggest_saving' | 'monthly_spend' | 'alphabetical'>('biggest_saving');
  const [filterRating4Plus, setFilterRating4Plus] = useState(false);
  const [filterSameDay, setFilterSameDay] = useState(false);
  const [filterMoqFits, setFilterMoqFits] = useState(false);

  // Accordion state (only one ingredient ranking expanded at a time)
  const [expandedIngId, setExpandedIngId] = useState<string | null>(null);

  // Inline price edit state
  const [editingIngPriceId, setEditingIngPriceId] = useState<string | null>(null);
  const [tempPriceVal, setTempPriceVal] = useState<string>('');

  // Compare & Rate modal state
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);
  const [highlightedSupplierId, setHighlightedSupplierId] = useState<string | null>(null);
  const [ratingSupplier, setRatingSupplier] = useState<Supplier | null>(null);
  const [userStars, setUserStars] = useState(5);
  const [userReviewNote, setUserReviewNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useScrollLock(compareDrawerOpen || ratingSupplier !== null);

  // Calculate dynamic monthly quantities from active dishes
  const ingredientMonthlyDemands = useMemo(() => {
    const map: Record<string, number> = {};
    dishes.forEach((d) => {
      d.ingredients.forEach((di) => {
        const key = di.ingredientId;
        const need = di.quantityPerPortion * (d.portionsSoldPerMonth || 100);
        map[key] = (map[key] || 0) + need;
      });
    });
    return map;
  }, [dishes]);

  // Compute Landed Price for a supplier price item
  const getLandedPrice = (sp: SupplierPrice, ingDemand: number) => {
    const sup = suppliers.find((s) => s.id === sp.supplierId);
    if (!includeDelivery || !sup || !sup.deliveryFee || ingDemand <= 0) {
      return sp.price;
    }
    // Landed price per unit = rate + (deliveryFee * 4 orders / monthly qty)
    const extraPerUnit = (sup.deliveryFee * 4) / Math.max(10, ingDemand);
    return Math.round(sp.price + extraPerUnit);
  };

  // Ingredient calculations table
  const enrichedIngredients = useMemo(() => {
    return ingredients.map((ing) => {
      const demand = Math.round((ingredientMonthlyDemands[ing.id] || ing.monthlyUsageQuantity || 150) * 10) / 10;
      const pricesForIng = supplierPrices.filter((sp) => sp.ingredientId === ing.id);

      // Filter prices by active supplier filters if any
      const eligiblePrices = pricesForIng.filter((sp) => {
        const sup = suppliers.find((s) => s.id === sp.supplierId);
        if (!sup) return false;
        if (filterRating4Plus && sup.rating < 4.0) return false;
        if (filterSameDay && !sup.deliveryTime?.toLowerCase().includes('same-day')) return false;
        if (filterMoqFits && (sup.minOrderQty || 0) > demand) return false;
        return true;
      });

      // Find best (lowest) landed price
      let bestPriceItem = eligiblePrices[0];
      let lowestLanded = bestPriceItem ? getLandedPrice(bestPriceItem, demand) : ing.bestCityPrice;

      eligiblePrices.forEach((sp) => {
        const landed = getLandedPrice(sp, demand);
        if (landed < lowestLanded) {
          lowestLanded = landed;
          bestPriceItem = sp;
        }
      });

      const bestSupplier = suppliers.find((s) => s.id === bestPriceItem?.supplierId) || suppliers[0];

      // Comparison benchmark
      const userPrice = ing.userCurrentPrice || ing.currentAvgPrice;
      const retailPrice = ing.currentAvgPrice * 1.05;
      const avgPrice = ing.currentAvgPrice;

      let benchmarkPrice = userPrice;
      if (compareTarget === 'retail') benchmarkPrice = retailPrice;
      if (compareTarget === 'market_avg') benchmarkPrice = avgPrice;

      const unitSavings = Math.max(0, benchmarkPrice - lowestLanded);
      const monthlySavings = Math.round(unitSavings * demand);
      const savingsPercent = benchmarkPrice > 0 ? Math.round((unitSavings / benchmarkPrice) * 100) : 0;
      const totalSpendAtBest = Math.round(lowestLanded * demand);
      const totalSpendAtBenchmark = Math.round(benchmarkPrice * demand);

      return {
        ...ing,
        demand,
        lowestLanded,
        bestRateOnly: bestPriceItem?.price || lowestLanded,
        bestSupplier,
        bestPriceItem,
        benchmarkPrice,
        unitSavings,
        monthlySavings,
        savingsPercent,
        totalSpendAtBest,
        totalSpendAtBenchmark,
        eligiblePrices,
      };
    });
  }, [
    ingredients,
    supplierPrices,
    suppliers,
    ingredientMonthlyDemands,
    includeDelivery,
    compareTarget,
    filterRating4Plus,
    filterSameDay,
    filterMoqFits,
  ]);

  // Global totals for the top summary sentence
  const summaryTotals = useMemo(() => {
    let benchmarkSpend = 0;
    let bestSpend = 0;

    enrichedIngredients.forEach((item) => {
      benchmarkSpend += item.totalSpendAtBenchmark;
      bestSpend += item.totalSpendAtBest;
    });

    const netSavings = Math.max(0, benchmarkSpend - bestSpend);
    return {
      benchmarkSpend: Math.round(benchmarkSpend),
      bestSpend: Math.round(bestSpend),
      netSavings: Math.round(netSavings),
    };
  }, [enrichedIngredients]);

  // Categories list with counts
  const categoriesWithCounts = useMemo(() => {
    const cats = ['All', 'Dairy & Paneer', 'Poultry & Meat', 'Vegetables & Fresh Produce', 'Grains, Flours & Pulses', 'Oils & Ghee', 'Spices & Seasonings', 'Sauces & Condiments'];
    return cats.map((cat) => {
      const count =
        cat === 'All'
          ? enrichedIngredients.length
          : enrichedIngredients.filter((i) => i.category.toLowerCase().includes(cat.toLowerCase())).length;
      return { name: cat, count };
    });
  }, [enrichedIngredients]);

  // Filter & Sort enriched ingredients
  const displayedIngredients = useMemo(() => {
    return enrichedIngredients
      .filter((ing) => {
        if (selectedCategory !== 'All' && !ing.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = ing.name.toLowerCase().includes(q);
          const matchSupp = ing.bestSupplier.name.toLowerCase().includes(q);
          if (!matchName && !matchSupp) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'monthly_spend') return b.totalSpendAtBest - a.totalSpendAtBest;
        if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
        return b.monthlySavings - a.monthlySavings; // default: biggest saving
      });
  }, [enrichedIngredients, selectedCategory, searchQuery, sortBy]);

  // Group displayed ingredients by category for View 1 and View 2
  const ingredientsByCategory = useMemo(() => {
    const map = new Map<string, typeof displayedIngredients>();
    displayedIngredients.forEach((item) => {
      const cat = item.category;
      const list = map.get(cat) || [];
      list.push(item);
      map.set(cat, list);
    });
    return map;
  }, [displayedIngredients]);

  // Active suppliers that sell at least one displayed ingredient (for View 2)
  const activeSuppliersForMatrix = useMemo(() => {
    const usedSupplierIds = new Set<string>();
    displayedIngredients.forEach((item) => {
      item.eligiblePrices.forEach((p) => usedSupplierIds.add(p.supplierId));
    });
    return suppliers.filter((s) => usedSupplierIds.has(s.id));
  }, [displayedIngredients, suppliers]);

  // Suppliers view calculations (View 3: Smart Mix & By Supplier)
  const supplierStats = useMemo(() => {
    return suppliers.map((sup) => {
      const itemsCheapestFor: typeof enrichedIngredients = [];
      let totalSavingsWhenUsed = 0;
      let totalSpendWithSupplier = 0;

      enrichedIngredients.forEach((ing) => {
        const sp = supplierPrices.find((p) => p.supplierId === sup.id && p.ingredientId === ing.id);
        if (!sp) return;

        const landed = getLandedPrice(sp, ing.demand);
        if (landed <= ing.lowestLanded) {
          itemsCheapestFor.push(ing);
          totalSavingsWhenUsed += ing.monthlySavings;
        }
        totalSpendWithSupplier += landed * ing.demand;
      });

      return {
        ...sup,
        itemsCheapestFor,
        cheapestCount: itemsCheapestFor.length,
        totalSavingsWhenUsed: Math.round(totalSavingsWhenUsed),
        totalSpendWithSupplier: Math.round(totalSpendWithSupplier),
      };
    }).sort((a, b) => b.cheapestCount - a.cheapestCount);
  }, [suppliers, enrichedIngredients, supplierPrices, includeDelivery]);

  // Handle Save User Current Price Inline
  const handleSaveUserPrice = (ingId: string) => {
    const val = parseFloat(tempPriceVal);
    if (!isNaN(val) && val > 0) {
      updateIngredientUserPrice(ingId, val);
    }
    setEditingIngPriceId(null);
    setTempPriceVal('');
  };

  // Add all cheapest items to shopping list
  const handleAddAllCheapest = () => {
    let addedCount = 0;
    enrichedIngredients.forEach((item) => {
      addShoppingItem({
        ingredientId: item.id,
        ingredientName: item.name,
        quantity: Math.round(item.demand / 4), // 1-week procurement default
        unit: item.standardUnit,
        targetSupplierId: item.bestSupplier.id,
        targetSupplierName: item.bestSupplier.name,
        estPricePerUnit: item.lowestLanded,
        totalCost: item.lowestLanded * Math.round(item.demand / 4),
        isCompleted: false,
        category: item.category,
      });
      addedCount++;
    });

    setToastMessage(`Added all ${addedCount} cheapest mandi commodities to your Shopping List!`);
  };

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) {
        setToastMessage('You can compare up to 3 suppliers side-by-side.');
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <div className="space-y-6 pb-28">
      {toastMessage && (
        <Toast
          id="sup-toast"
          title="Procurement Updated"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* 1. TOP SUMMARY HEADLINE (Clear plain-language savings in Fraunces) */}
      <div className="bg-[#FFFDF8] border-2 border-[#E0D1B8] rounded-3xl p-5 sm:p-7 shadow-warm-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-3xl">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#315B42] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F8C45C]" />
            Live Wholesale Mandi Benchmark &bull; {currentCity?.name || 'Delhi NCR'}
          </span>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-fraunces font-bold text-[#2C1E14] leading-snug">
            You spend <span className="font-sans font-bold text-[#66523B]">₹{summaryTotals.benchmarkSpend.toLocaleString('en-IN')}</span> a month on raw ingredients. With the cheapest suppliers you can pay{' '}
            <span className="font-sans font-bold text-[#315B42]">₹{summaryTotals.bestSpend.toLocaleString('en-IN')}</span>.{' '}
            <span className="text-[#315B42] underline decoration-[#F8C45C] decoration-2 underline-offset-4">
              Save ₹{summaryTotals.netSavings.toLocaleString('en-IN')}.
            </span>
          </h1>
        </div>

        {/* Controls Beside Headline */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 self-start lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-[#F1E8D8]">
          {/* Compare Against Selector */}
          <div className="flex flex-col text-xs">
            <span className="text-[10px] text-[#8A7662] font-semibold uppercase tracking-wider mb-1">
              Compare Against
            </span>
            <select
              value={compareTarget}
              onChange={(e) => setCompareTarget(e.target.value as any)}
              className="bg-white border border-[#E4D7C0] rounded-xl px-3 py-1.5 font-bold text-[#2C1E14] focus:outline-none cursor-pointer shadow-xs"
            >
              <option value="my_price">My Current Price</option>
              <option value="retail">Retail Supermarket</option>
              <option value="market_avg">City Market Average</option>
            </select>
          </div>

          {/* Include Delivery Switch */}
          <div className="flex flex-col text-xs">
            <span className="text-[10px] text-[#8A7662] font-semibold uppercase tracking-wider mb-1">
              Landed Rates
            </span>
            <label className="flex items-center gap-2 bg-white border border-[#E4D7C0] rounded-xl px-3 py-1.5 cursor-pointer shadow-xs select-none">
              <input
                type="checkbox"
                checked={includeDelivery}
                onChange={(e) => setIncludeDelivery(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#263D2D]"
              />
              <span className="font-bold text-[#2C1E14]">Include Delivery</span>
            </label>
          </div>
        </div>
      </div>

      {/* 2. STICKY CONTROL BAR (Under top bar) */}
      <div className="sticky top-16 z-20 bg-[#FFF9EF]/95 backdrop-blur-md py-2.5 border-b border-[#E4D7C0]/80 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 space-y-2.5">
        {/* Row 1: Segmented View + Search + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* View SegmentedControl */}
          <div className="bg-[#F1E8D8] p-1 rounded-xl flex items-center text-xs font-bold border border-[#E0D1B8] shrink-0">
            <button
              onClick={() => setActiveTab('best_prices')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'best_prices' ? 'bg-white text-[#263D2D] shadow-warm-xs' : 'text-[#66523B]'
              }`}
            >
              Best Prices ({enrichedIngredients.length})
            </button>
            <button
              onClick={() => setActiveTab('side_by_side')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'side_by_side' ? 'bg-white text-[#263D2D] shadow-warm-xs' : 'text-[#66523B]'
              }`}
            >
              Side-by-side Matrix
            </button>
            <button
              onClick={() => setActiveTab('by_supplier')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'by_supplier' ? 'bg-white text-[#263D2D] shadow-warm-xs' : 'text-[#66523B]'
              }`}
            >
              By Supplier ({suppliers.length})
            </button>
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-[#8A7662] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search raw ingredient or vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E4D7C0] bg-white text-xs text-[#2C1E14] focus:outline-none"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#E4D7C0] text-xs font-semibold text-[#2C1E14] py-1.5 px-2.5 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="biggest_saving">Sort: Biggest Saving</option>
              <option value="monthly_spend">Sort: Highest Spend</option>
              <option value="alphabetical">Sort: A to Z</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category Chips (Horizontal scroll) + Quick Filter Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-[#E4D7C0]/60">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <Filter className="w-3.5 h-3.5 text-[#8A7662] shrink-0" />
            {categoriesWithCounts.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#263D2D] text-white shadow-warm-xs'
                      : 'bg-white border border-[#EBE1CF] text-[#66523B] hover:bg-[#F1E8D8]/60 hover:text-[#2C1E14]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#F1E8D8] text-[#66523B]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterRating4Plus(!filterRating4Plus)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                filterRating4Plus
                  ? 'bg-[#263D2D] text-white border-[#263D2D]'
                  : 'bg-white text-[#66523B] border-[#E4D7C0]'
              }`}
            >
              ★ 4.8+ Rating
            </button>
            <button
              onClick={() => setFilterSameDay(!filterSameDay)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                filterSameDay
                  ? 'bg-[#263D2D] text-white border-[#263D2D]'
                  : 'bg-white text-[#66523B] border-[#E4D7C0]'
              }`}
            >
              Same-day Dispatch
            </button>
            <button
              onClick={() => setFilterMoqFits(!filterMoqFits)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                filterMoqFits
                  ? 'bg-[#263D2D] text-white border-[#263D2D]'
                  : 'bg-white text-[#66523B] border-[#E4D7C0]'
              }`}
            >
              MOQ Fits Demand
            </button>
          </div>
        </div>
      </div>

      {/* 3. VIEW 1: BEST PRICES (Default: Table-like rows on desktop, cards on mobile) */}
      {activeTab === 'best_prices' && (
        <div className="space-y-6">
          {Array.from(ingredientsByCategory.entries()).map(([category, items]) => (
            <div key={category} className="bg-[#FFFDF9] border border-[#E0D1B8] rounded-3xl p-5 sm:p-7 shadow-warm-xs space-y-3">
              {/* Category Heading & Count */}
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#E4D7C0]">
                <h3 className="font-fraunces text-xl font-bold text-[#2C1E14]">
                  {category}
                </h3>
                <span className="text-xs font-semibold text-[#8A7662]">
                  {items.length} {items.length === 1 ? 'commodity' : 'commodities'}
                </span>
              </div>

              {/* Rows List */}
              <div className="divide-y divide-[#F1E8D8]">
                {items.map((ing) => {
                  const isExpanded = expandedIngId === ing.id;
                  const isEditingPrice = editingIngPriceId === ing.id;
                  const isBigSaving = ing.monthlySavings >= 10000;

                  return (
                    <div key={ing.id} className="py-3.5 transition-colors rounded-2xl hover:bg-[#F9F5EC]/60 px-2 sm:px-3">
                      {/* Main Desktop Row / Mobile Card */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Left: Thumbnail & Name & Demand */}
                        <div
                          onClick={() => setExpandedIngId(isExpanded ? null : ing.id)}
                          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer select-none"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white border border-[#E4D7C0] flex items-center justify-center shrink-0 shadow-xs">
                            {getIngredientIllustration(ing.name, ing.category, 30)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm sm:text-base text-[#2C1E14] tracking-tight">
                                {ing.name}
                              </span>
                              {isBigSaving && (
                                <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                                  Big Saving
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#8A7662] block mt-0.5">
                              Kitchen need: <strong className="text-[#2C1E14]">{ing.demand} {ing.standardUnit}/mo</strong> &bull; Best: {ing.bestSupplier.name}
                            </span>
                          </div>
                        </div>

                        {/* Middle & Right: Prices, Current Price Input, Savings */}
                        <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F1E8D8]">
                          {/* Cheapest Supplier & Rate */}
                          <div className="text-left md:text-right">
                            <div className="flex items-center md:justify-end gap-1.5">
                              <span className="text-lg sm:text-2xl font-bold font-mono text-[#315B42]">
                                ₹{ing.lowestLanded}
                              </span>
                              <span className="text-xs text-[#8A7662] font-semibold">/{ing.standardUnit}</span>
                            </div>
                            <span className="text-[10px] text-[#315B42] font-semibold block">
                              Cheapest Landed
                            </span>
                          </div>

                          {/* Editable "My Current Price" */}
                          <div className="text-left md:text-right">
                            {isEditingPrice ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  autoFocus
                                  value={tempPriceVal}
                                  onChange={(e) => setTempPriceVal(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSaveUserPrice(ing.id)}
                                  className="w-16 p-1 border border-[#F8C45C] rounded text-xs font-mono font-bold"
                                />
                                <button
                                  onClick={() => handleSaveUserPrice(ing.id)}
                                  className="p-1 rounded bg-[#315B42] text-white"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setEditingIngPriceId(ing.id);
                                  setTempPriceVal(ing.benchmarkPrice.toString());
                                }}
                                className="group/edit flex items-center md:justify-end gap-1 cursor-pointer"
                                title="Click to edit what you pay today"
                              >
                                <span className="text-xs font-mono font-bold text-[#66523B] line-through">
                                  ₹{ing.benchmarkPrice}
                                </span>
                                <Edit2 className="w-3 h-3 text-[#8A7662] opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                              </div>
                            )}
                            <span className="text-[10px] text-[#8A7662] block">Current Paid</span>
                          </div>

                          {/* Savings Pill & Monthly Savings */}
                          <div className="text-right min-w-[110px]">
                            <span className="text-sm sm:text-base font-bold font-mono text-[#315B42] block">
                              ₹{ing.monthlySavings.toLocaleString('en-IN')}/mo
                            </span>
                            <span className="text-[10px] font-bold text-[#315B42] bg-[#EAF3ED] px-1.5 py-0.5 rounded inline-block mt-0.5">
                              {ing.savingsPercent}% cheaper
                            </span>
                          </div>

                          {/* Chevron */}
                          <button
                            onClick={() => setExpandedIngId(isExpanded ? null : ing.id)}
                            className="p-1.5 rounded-lg hover:bg-white text-[#8A7662] transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* INLINE ACCORDION: RANKING OF ALL SUPPLIERS FOR THIS INGREDIENT */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-3 pt-3 border-t border-[#E4D7C0] bg-[#FFF9EF]/80 rounded-2xl p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#2C1E14]">
                                Vendor Price Ranking for {ing.name}
                              </span>
                              <span className="text-[11px] text-[#8A7662]">
                                Sorted by landed rate (includes delivery)
                              </span>
                            </div>

                            {/* Ranking rows (#1 to #n) */}
                            <div className="space-y-2">
                              {ing.eligiblePrices
                                .map((sp) => {
                                  const sup = suppliers.find((s) => s.id === sp.supplierId);
                                  const landed = getLandedPrice(sp, ing.demand);
                                  return { sp, sup, landed };
                                })
                                .sort((a, b) => a.landed - b.landed)
                                .map(({ sp, sup, landed }, rankIdx) => {
                                  if (!sup) return null;
                                  const isRank1 = rankIdx === 0;
                                  const diffFromLowest = landed - ing.lowestLanded;
                                  const diffPercent = Math.round((diffFromLowest / ing.lowestLanded) * 100);
                                  const supplierMonthlyCost = Math.round(landed * ing.demand);
                                  const moqExceeds = (sup.minOrderQty || 0) > ing.demand;
                                  const maxPriceInRange = ing.eligiblePrices.reduce((max, cur) => Math.max(max, getLandedPrice(cur, ing.demand)), ing.lowestLanded * 1.3);
                                  const barPercent = Math.min(100, Math.max(30, (landed / maxPriceInRange) * 100));

                                  return (
                                    <div
                                      key={sp.id}
                                      className={`p-3 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                                        isRank1
                                          ? 'bg-white border-[#F8C45C] shadow-sm'
                                          : 'bg-white/80 border-[#E4D7C0]/60'
                                      }`}
                                    >
                                      {/* Rank & Supplier Info */}
                                      <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                          isRank1 ? 'bg-[#315B42] text-white' : 'bg-[#E4D7C0] text-[#66523B]'
                                        }`}>
                                          #{rankIdx + 1}
                                        </span>

                                        <div className="min-w-0 flex-1 space-y-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-sm text-[#2C1E14]">{sup.name}</span>
                                            <SupplierTypeBadge type={sup.type} />
                                            {isRank1 && (
                                              <span className="text-[10px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded">
                                                Best Price
                                              </span>
                                            )}
                                          </div>

                                          <div className="flex items-center gap-2 text-[11px] text-[#8A7662] flex-wrap">
                                            <span>★ {sup.rating}</span>
                                            <span>&bull;</span>
                                            <span>{sup.deliveryTime}</span>
                                            <span>&bull;</span>
                                            <span>MOQ: {sup.minOrderQty || 5} {ing.standardUnit}</span>
                                            {includeDelivery && sup.deliveryFee ? (
                                              <span>(₹{sp.price} rate + ₹{sup.deliveryFee} delivery)</span>
                                            ) : null}
                                          </div>

                                          {/* Horizontal Price Bar */}
                                          <div className="w-full max-w-xs bg-[#F1E8D8] h-1.5 rounded-full overflow-hidden mt-1">
                                            <div
                                              className={`h-full rounded-full ${isRank1 ? 'bg-[#315B42]' : 'bg-[#F8C45C]'}`}
                                              style={{ width: `${barPercent}%` }}
                                            />
                                          </div>

                                          {moqExceeds && (
                                            <div className="flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1">
                                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                                              <span>Minimum order {sup.minOrderQty} {ing.standardUnit} is above monthly need ({ing.demand} {ing.standardUnit})</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Price, Comparison & Add to List */}
                                      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F1E8D8]">
                                        <div className="text-left md:text-right">
                                          <span className="text-base sm:text-lg font-bold font-mono text-[#2C1E14]">
                                            ₹{landed}/{ing.standardUnit}
                                          </span>
                                          <div className="text-[10px] text-[#8A7662]">
                                            {isRank1 ? (
                                              <span className="text-[#315B42] font-semibold">Lowest rate</span>
                                            ) : (
                                              <span className="text-rose-700 font-semibold">
                                                +₹{diffFromLowest} ({diffPercent}% more)
                                              </span>
                                            )}
                                          </div>
                                          <span className="text-[10px] text-[#8A7662] block">
                                            Monthly cost: ₹{supplierMonthlyCost.toLocaleString('en-IN')}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                          <button
                                            onClick={() => setRatingSupplier(sup)}
                                            className="p-1.5 rounded-lg border border-[#E4D7C0] text-[#66523B] hover:bg-[#F9F5EC]"
                                            title="Rate supplier"
                                          >
                                            <Star className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            onClick={() => handleToggleCompare(sup.id)}
                                            className="p-1.5 rounded-lg border border-[#E4D7C0] text-[#66523B] hover:bg-[#F9F5EC]"
                                            title="Add to compare"
                                          >
                                            <Scale className="w-3.5 h-3.5" />
                                          </button>
                                          <Button
                                            variant={isRank1 ? 'primary' : 'outline'}
                                            size="sm"
                                            onClick={() => {
                                              addShoppingItem({
                                                ingredientId: ing.id,
                                                ingredientName: ing.name,
                                                quantity: Math.round(ing.demand / 4),
                                                unit: ing.standardUnit,
                                                targetSupplierId: sup.id,
                                                targetSupplierName: sup.name,
                                                estPricePerUnit: landed,
                                                totalCost: landed * Math.round(ing.demand / 4),
                                                isCompleted: false,
                                                category: ing.category,
                                              });
                                              setToastMessage(`Added ${ing.name} from ${sup.name} to list!`);
                                            }}
                                          >
                                            Add to list
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. VIEW 2: SIDE-BY-SIDE MATRIX */}
      {activeTab === 'side_by_side' && (
        <div className="bg-[#FFFDF9] border border-[#E0D1B8] rounded-3xl p-5 sm:p-7 shadow-warm-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4D7C0]">
            <div>
              <h3 className="font-fraunces text-xl font-bold text-[#2C1E14]">
                Side-by-Side Commodity Matrix
              </h3>
              <p className="text-xs text-[#8A7662]">
                Horizontal comparison of landed prices across all verified vendors. Lowest rate per row highlighted in green.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#8A7662]">
              {activeSuppliersForMatrix.length} Suppliers Active
            </span>
          </div>

          {/* Matrix Table with Sticky First Column & Header (Scrolls horizontally inside container only) */}
          <div className="overflow-x-auto border border-[#E4D7C0] rounded-2xl bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FFF9EF] border-b border-[#E4D7C0]">
                  <th className="p-3 sticky left-0 z-10 bg-[#FFF9EF] font-bold text-[#2C1E14] min-w-[200px] border-r border-[#E4D7C0]">
                    Raw Ingredient & Demand
                  </th>
                  {activeSuppliersForMatrix.map((sup) => {
                    const isHighlighted = highlightedSupplierId === sup.id;
                    return (
                      <th
                        key={sup.id}
                        onClick={() => setHighlightedSupplierId(isHighlighted ? null : sup.id)}
                        className={`p-3 min-w-[140px] text-center border-r border-[#E4D7C0] cursor-pointer transition-colors ${
                          isHighlighted ? 'bg-[#F8C45C]/30' : 'hover:bg-[#F9F5EC]'
                        }`}
                      >
                        <div className="font-bold text-[#2C1E14] line-clamp-1">{sup.name}</div>
                        <div className="flex justify-center mt-1">
                          <SupplierTypeBadge type={sup.type} />
                        </div>
                        <div className="text-[10px] text-[#8A7662] mt-0.5">★ {sup.rating}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F1E8D8]">
                {displayedIngredients.map((ing) => (
                  <tr key={ing.id} className="hover:bg-[#FFFDF9]">
                    {/* Sticky Commodity Column */}
                    <td className="p-3 sticky left-0 z-10 bg-white font-semibold text-[#2C1E14] border-r border-[#E4D7C0] shadow-xs">
                      <div className="font-bold text-xs">{ing.name}</div>
                      <div className="text-[10px] text-[#8A7662]">
                        {ing.demand} {ing.standardUnit}/mo &bull; Paid: ₹{ing.benchmarkPrice}
                      </div>
                    </td>

                    {/* Landed rate cells per supplier */}
                    {activeSuppliersForMatrix.map((sup) => {
                      const sp = supplierPrices.find((p) => p.supplierId === sup.id && p.ingredientId === ing.id);
                      if (!sp) {
                        return (
                          <td key={sup.id} className="p-3 text-center text-[#8A7662]/50 border-r border-[#F1E8D8]">
                            &mdash;
                          </td>
                        );
                      }

                      const landed = getLandedPrice(sp, ing.demand);
                      const isCheapestInRow = landed <= ing.lowestLanded;
                      const isHighlighted = highlightedSupplierId === sup.id;

                      return (
                        <td
                          key={sup.id}
                          className={`p-3 text-center border-r border-[#F1E8D8] ${
                            isHighlighted ? 'bg-amber-50/50' : ''
                          } ${isCheapestInRow ? 'bg-[#EAF3ED]' : ''}`}
                        >
                          <div className={`font-mono text-xs font-bold ${isCheapestInRow ? 'text-[#315B42]' : 'text-[#66523B]'}`}>
                            ₹{landed}
                          </div>
                          {isCheapestInRow ? (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#166534]">
                              <Check className="w-2.5 h-2.5" /> Best
                            </span>
                          ) : (
                            <span className="text-[9px] text-[#8A7662]">
                              +₹{landed - ing.lowestLanded}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>

              {/* Table Footer: Cheapest Count & Basket Totals */}
              <tfoot>
                <tr className="bg-[#FFF9EF] font-bold border-t-2 border-[#E4D7C0]">
                  <td className="p-3 sticky left-0 z-10 bg-[#FFF9EF] border-r border-[#E4D7C0] text-[#2C1E14]">
                    Cheapest in N Items
                  </td>
                  {activeSuppliersForMatrix.map((sup) => {
                    const stats = supplierStats.find((s) => s.id === sup.id);
                    return (
                      <td key={sup.id} className="p-3 text-center border-r border-[#E4D7C0] text-[#315B42]">
                        {stats?.cheapestCount || 0} items
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 5. VIEW 3: BY SUPPLIER */}
      {activeTab === 'by_supplier' && (
        <div className="space-y-6">
          {/* Smart Mix Comparison Card */}
          <div className="bg-[#FFFDF9] border-2 border-[#F8C45C] rounded-3xl p-6 shadow-warm-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#315B42]">
              <Sparkles className="w-4 h-4 text-[#F8C45C]" />
              Smart Multi-Vendor Procurement Mix
            </div>

            <h3 className="font-fraunces text-2xl font-bold text-[#2C1E14]">
              Multi-Supplier Optimization Strategy
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#EAF3ED] border border-[#BBF7D0]">
                <div className="text-xs text-[#166534] font-semibold">1. Optimized Multi-Mandi Mix</div>
                <div className="text-2xl font-fraunces font-bold text-[#166534] mt-1">
                  ₹{summaryTotals.bestSpend.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#166534]/80 mt-1">Buying each commodity from its cheapest vendor</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E4D7C0]">
                <div className="text-xs text-[#66523B] font-semibold">2. Best Single Supplier ({supplierStats[0]?.name})</div>
                <div className="text-2xl font-fraunces font-bold text-[#66523B] mt-1">
                  ₹{Math.round(summaryTotals.bestSpend * 1.09).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#8A7662] mt-1">Convenience cost (+9% spend)</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E4D7C0]">
                <div className="text-xs text-[#8A7662] font-semibold">3. Standard Retail Supermarket</div>
                <div className="text-2xl font-fraunces font-bold text-rose-900 mt-1">
                  ₹{summaryTotals.benchmarkSpend.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#8A7662] mt-1">Full retail price baseline</div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Using our multi-supplier mix saves you <strong>₹{Math.round(summaryTotals.bestSpend * 0.09).toLocaleString('en-IN')} more</strong> each month than bundling everything with a single vendor.
              </span>
            </div>
          </div>

          {/* Supplier Cards sorted by total items won */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {supplierStats.map((sup) => (
              <div
                key={sup.id}
                className="bg-[#FFFDF9] border border-[#E0D1B8] rounded-3xl p-5 sm:p-6 shadow-warm-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-lg text-[#2C1E14]">{sup.name}</h4>
                      <p className="text-xs text-[#8A7662] mt-0.5">{sup.address}</p>
                    </div>
                    <SupplierTypeBadge type={sup.type} />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#66523B] pt-1">
                    <span className="font-bold text-[#8C5D08]">★ {sup.rating}</span>
                    <span>&bull;</span>
                    <span>{sup.deliveryTime}</span>
                    <span>&bull;</span>
                    <span>Min: ₹{sup.minOrderValue.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Savings & Winning Count Highlights */}
                  <div className="p-3 rounded-2xl bg-[#FFF9EF] border border-[#E4D7C0] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#8A7662] block text-[11px]">Lowest rate in city for:</span>
                      <strong className="text-[#315B42] text-sm font-bold">
                        {sup.cheapestCount} of {enrichedIngredients.length} commodities
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[#8A7662] block text-[11px]">Monthly Savings Delivered:</span>
                      <strong className="text-[#315B42] text-sm font-bold font-mono">
                        ₹{sup.totalSavingsWhenUsed.toLocaleString('en-IN')}/mo
                      </strong>
                    </div>
                  </div>

                  {/* Chips of ingredients it is cheapest for */}
                  {sup.itemsCheapestFor.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#8A7662]">Cheapest Items:</span>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                        {sup.itemsCheapestFor.map((item) => (
                          <span
                            key={item.id}
                            className="px-2 py-0.5 rounded-lg bg-white border border-[#E4D7C0] text-[11px] text-[#2C1E14] font-medium"
                          >
                            {item.name} (₹{item.lowestLanded}/{item.standardUnit})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Button to add all won items to list */}
                {sup.itemsCheapestFor.length > 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      sup.itemsCheapestFor.forEach((item) => {
                        addShoppingItem({
                          ingredientId: item.id,
                          ingredientName: item.name,
                          quantity: Math.round(item.demand / 4),
                          unit: item.standardUnit,
                          targetSupplierId: sup.id,
                          targetSupplierName: sup.name,
                          estPricePerUnit: item.lowestLanded,
                          totalCost: item.lowestLanded * Math.round(item.demand / 4),
                          isCompleted: false,
                          category: item.category,
                        });
                      });
                      setToastMessage(`Added all ${sup.cheapestCount} winning items from ${sup.name} to shopping list!`);
                    }}
                  >
                    Add these {sup.cheapestCount} items to list &rarr;
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. BOTTOM FLOATING PILL (Above mobile tab bar: "Add all cheapest items to Shopping List") */}
      <div className="fixed bottom-20 lg:bottom-4 left-0 lg:left-[264px] right-0 z-30 pointer-events-none flex justify-center px-4">
        <div className="pointer-events-auto max-w-[760px] w-full bg-[#FFFDF9]/95 backdrop-blur-md border border-[#F8C45C] rounded-full shadow-warm-lg p-2.5 sm:p-3 pr-4 sm:pr-24 lg:pr-28 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#315B42] text-white flex items-center justify-center text-xs font-black shrink-0">
              {enrichedIngredients.length}
            </div>
            <div className="truncate">
              <span className="text-xs sm:text-sm font-bold text-[#2C1E14] block leading-tight truncate">
                Add all cheapest items to Shopping List
              </span>
              <span className="text-[11px] text-[#315B42] font-semibold hidden sm:block">
                {enrichedIngredients.length} items &bull; ₹{summaryTotals.bestSpend.toLocaleString('en-IN')}/mo total
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddAllCheapest}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="shrink-0 font-bold"
          >
            Add All Cheapest
          </Button>
        </div>
      </div>

      {/* Compare Side-by-Side Modal */}
      {compareDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setCompareDrawerOpen(false)} className="fixed inset-0 bg-[#2C1E14]/50 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-3xl bg-white border border-[#E4D7C0] rounded-3xl shadow-warm-xl flex flex-col max-h-[90dvh] overflow-hidden">
            <div className="p-4 border-b border-[#F1E8D8] flex items-center justify-between bg-white shrink-0">
              <h3 className="font-bold text-base text-[#2C1E14]">Compare Selected Vendors</h3>
              <button onClick={() => setCompareDrawerOpen(false)} className="p-1.5 rounded-full hover:bg-cream-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {compareIds.map((id) => {
                const sup = suppliers.find((s) => s.id === id);
                if (!sup) return null;
                return (
                  <div key={sup.id} className="p-4 rounded-2xl bg-[#FFF9EF] border border-[#E4D7C0] space-y-2">
                    <h4 className="font-bold text-sm text-[#2C1E14]">{sup.name}</h4>
                    <SupplierTypeBadge type={sup.type} />
                    <div className="space-y-1 text-[#66523B] pt-2 border-t border-[#E4D7C0]">
                      <div>Rating: <strong>★ {sup.rating}</strong></div>
                      <div>Delivery: <strong>{sup.deliveryTime}</strong></div>
                      <div>Min Order: <strong>₹{sup.minOrderValue}</strong></div>
                      <div>Fee: <strong>₹{sup.deliveryFee || 0}</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-[#F1E8D8] bg-[#FFFDF9] flex justify-end shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setCompareDrawerOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rate Supplier Modal */}
      {ratingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setRatingSupplier(null)} className="fixed inset-0 bg-[#2C1E14]/50 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-md bg-white border border-[#E4D7C0] rounded-3xl shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden">
            <div className="p-4 border-b border-[#F1E8D8] flex items-center justify-between bg-white shrink-0">
              <div>
                <h3 className="font-bold text-base text-[#2C1E14]">Rate Supplier</h3>
                <p className="text-xs text-[#8A7662]">{ratingSupplier.name}</p>
              </div>
              <button onClick={() => setRatingSupplier(null)} className="p-1 rounded-full hover:bg-cream-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              <div>
                <label className="block text-[#66523B] font-semibold mb-1">Star Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setUserStars(star)} className="p-1">
                      <Star className={`w-6 h-6 ${star <= userStars ? 'text-[#F8C45C] fill-[#F8C45C]' : 'text-[#E4D7C0]'}`} />
                    </button>
                  ))}
                  <span className="font-bold ml-2">{userStars}.0</span>
                </div>
              </div>
              <div>
                <label className="block text-[#66523B] font-semibold mb-1">Feedback Note</label>
                <textarea
                  value={userReviewNote}
                  onChange={(e) => setUserReviewNote(e.target.value)}
                  placeholder="e.g. Always on-time delivery with cold pack."
                  className="w-full p-2.5 rounded-xl border border-[#E4D7C0] bg-[#FFF9EF] text-xs focus:outline-none min-h-[70px]"
                />
              </div>
            </div>
            <div className="p-4 border-t border-[#F1E8D8] bg-[#FFFDF9] flex justify-end gap-2 shrink-0">
              <button onClick={() => setRatingSupplier(null)} className="px-3 py-1.5 rounded-xl border border-[#E4D7C0] text-xs">
                Cancel
              </button>
              <button
                onClick={() => {
                  setToastMessage(`Feedback recorded for ${ratingSupplier.name}!`);
                  setRatingSupplier(null);
                  setUserReviewNote('');
                }}
                className="px-4 py-1.5 rounded-xl bg-[#263D2D] text-white text-xs font-semibold hover:bg-[#315B42]"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
