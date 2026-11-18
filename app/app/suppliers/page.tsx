'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Clock,
  Truck,
  Sparkles,
  ShoppingBag,
  Search,
  Check,
  ArrowRight,
  TrendingDown,
  X,
  Phone,
  ShieldCheck,
  Store,
  Layers,
  MapPin,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { BestPriceBadge } from '@/components/ui/BestPriceBadge';
import { getIngredientIllustration } from '@/lib/ingredientVisuals';
import { useScrollLock } from '@/hooks/useScrollLock';
import { Supplier, SupplierPrice, Ingredient, IngredientCategory, CityId } from '@/types';

const SUPPLIER_CATEGORIES = [
  'All',
  'Dairy & Paneer',
  'Vegetables',
  'Poultry & Meat',
  'Grains',
  'Oils & Ghee',
  'Spices',
] as const;

export default function SuppliersPage() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const {
    getCurrentCity,
    selectedCityId,
    setCity,
    cities,
    ingredients,
    dishes,
    suppliers,
    supplierPrices,
    addShoppingItem,
    updateIngredientUserPrice,
  } = useAppStore();

  const currentCity = isHydrated ? getCurrentCity() : null;

  // Category filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected ingredient for detail drawer (avoid cluttering page with all supplier details)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  // Selected supplier for dedicated Mandi Profile Drawer
  const [selectedSupplierForModal, setSelectedSupplierForModal] = useState<Supplier | null>(null);
  const [highlightSupplierId, setHighlightSupplierId] = useState<string | null>(null);

  // Delivery toggle for landed rates
  const [includeDelivery, setIncludeDelivery] = useState(true);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useScrollLock(Boolean(selectedIngredient || selectedSupplierForModal));

  // Auto-detect supplierId or ingredientId from URL query on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const supId = params.get('supplierId');
    const ingId = params.get('ingredientId');
    const searchParam = params.get('search');

    if (searchParam) {
      setSearchQuery(searchParam);
    }

    if (supId) {
      setHighlightSupplierId(supId);
      const matchedSup = suppliers.find(
        (s) => s.id === supId || s.name.toLowerCase().includes(supId.toLowerCase())
      );
      if (matchedSup) {
        setSelectedSupplierForModal(matchedSup);
      }
    }

    if (ingId || searchParam) {
      const term = (searchParam || ingId || '').toLowerCase();
      const matchedIng = ingredients.find(
        (i) =>
          i.id === ingId ||
          i.name.toLowerCase() === term ||
          i.name.toLowerCase().includes(term) ||
          term.includes(i.name.toLowerCase())
      );
      if (matchedIng) {
        setSelectedIngredient(matchedIng);
      }
    }
  }, [suppliers, ingredients]);

  // Calculate monthly requirements dynamically from dishes
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
    const extraPerUnit = (sup.deliveryFee * 4) / Math.max(10, ingDemand);
    return Math.round(sp.price + extraPerUnit);
  };

  // Enriched ingredient list with market prices & potential savings
  const enrichedIngredients = useMemo(() => {
    return ingredients.map((ing) => {
      const demand = Math.round(
        (ingredientMonthlyDemands[ing.id] || ing.monthlyUsageQuantity || 150) * 10
      ) / 10;
      const pricesForIng = supplierPrices.filter((sp) => sp.ingredientId === ing.id);

      // Best supplier price
      const sortedPrices = [...pricesForIng].sort((a, b) => {
        return getLandedPrice(a, demand) - getLandedPrice(b, demand);
      });

      const bestSP = sortedPrices[0] || null;
      const bestPrice = bestSP ? getLandedPrice(bestSP, demand) : ing.bestCityPrice;
      const currentPrice = ing.userCurrentPrice || ing.currentAvgPrice || Math.round(bestPrice * 1.25);

      const currentMonthlySpend = Math.round(currentPrice * demand);
      const bestMonthlySpend = Math.round(bestPrice * demand);
      const monthlySavings = Math.max(0, currentMonthlySpend - bestMonthlySpend);
      const savingsPercent = currentPrice > 0 ? Math.round(((currentPrice - bestPrice) / currentPrice) * 100) : 0;

      const bestSupplier = bestSP ? suppliers.find((s) => s.id === bestSP.supplierId) : null;

      return {
        ...ing,
        demand,
        bestPrice,
        currentPrice,
        currentMonthlySpend,
        bestMonthlySpend,
        monthlySavings,
        savingsPercent,
        bestSupplier,
        availableVendorsCount: pricesForIng.length,
      };
    });
  }, [ingredients, supplierPrices, suppliers, ingredientMonthlyDemands, includeDelivery]);

  // Global totals for the compact top summary
  const summaryTotals = useMemo(() => {
    const currentSpend = enrichedIngredients.reduce((acc, it) => acc + it.currentMonthlySpend, 0);
    const bestSpend = enrichedIngredients.reduce((acc, it) => acc + it.bestMonthlySpend, 0);
    const totalSavings = Math.max(0, currentSpend - bestSpend);
    const savingsPercent = currentSpend > 0 ? Math.round((totalSavings / currentSpend) * 100) : 0;

    return {
      currentSpend,
      bestSpend,
      totalSavings,
      savingsPercent,
    };
  }, [enrichedIngredients]);

  // Filtered ingredients by category & search
  const filteredIngredients = useMemo(() => {
    return enrichedIngredients.filter((ing) => {
      if (selectedCategory !== 'All') {
        const cat = ing.category.toLowerCase();
        const target = selectedCategory.toLowerCase();
        const match =
          cat.includes(target) ||
          (target === 'vegetables' && cat.includes('vegetable')) ||
          (target === 'grains' && (cat.includes('grain') || cat.includes('flour') || cat.includes('pulse'))) ||
          (target === 'oils & ghee' && (cat.includes('oil') || cat.includes('ghee'))) ||
          (target === 'dairy & paneer' && (cat.includes('dairy') || cat.includes('paneer'))) ||
          (target === 'poultry & meat' && (cat.includes('poultry') || cat.includes('meat'))) ||
          (target === 'spices' && cat.includes('spice'));
        if (!match) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = ing.name.toLowerCase().includes(q);
        const matchCat = ing.category.toLowerCase().includes(q);
        const matchSup = ing.bestSupplier?.name.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchSup) return false;
      }

      return true;
    });
  }, [enrichedIngredients, selectedCategory, searchQuery]);

  // Suppliers competing for the selected drawer ingredient
  const drawerSuppliersList = useMemo(() => {
    if (!selectedIngredient) return [];
    const ingDemand =
      ingredientMonthlyDemands[selectedIngredient.id] || selectedIngredient.monthlyUsageQuantity || 150;
    const pricesForIng = supplierPrices.filter((sp) => sp.ingredientId === selectedIngredient.id);

    return pricesForIng
      .map((sp) => {
        const sup = suppliers.find((s) => s.id === sp.supplierId);
        const landedCost = getLandedPrice(sp, ingDemand);
        return {
          priceItem: sp,
          supplier: sup,
          landedCost,
          unit: sp.unit,
          moq: sp.moq,
          deliveryDays: sp.deliveryDays,
          rating: sup?.rating || 4.7,
          verified: sup?.verified ?? true,
          phone: sup?.phone || '+91 98110 24891',
        };
      })
      .sort((a, b) => a.landedCost - b.landedCost);
  }, [selectedIngredient, supplierPrices, suppliers, ingredientMonthlyDemands, includeDelivery]);

  // Commodities supplied by selectedSupplierForModal
  const supplierCommodities = useMemo(() => {
    if (!selectedSupplierForModal) return [];
    return supplierPrices
      .filter((sp) => sp.supplierId === selectedSupplierForModal.id)
      .map((sp) => {
        const ing = ingredients.find((i) => i.id === sp.ingredientId);
        return {
          ...sp,
          ingredientName: ing?.name || 'Raw Commodity',
          category: (ing?.category || 'Dairy & Paneer') as IngredientCategory,
          unit: sp.unit || ing?.standardUnit || 'kg',
        };
      });
  }, [selectedSupplierForModal, supplierPrices, ingredients]);

  const handleSelectSupplierForIngredient = (ingName: string, supName: string, price: number, unit: string) => {
    addShoppingItem({
      ingredientId: selectedIngredient?.id || 'ing-custom',
      ingredientName: ingName,
      quantity: 50,
      unit: unit as any,
      targetSupplierId: 'sup-selected',
      targetSupplierName: supName,
      estPricePerUnit: price,
      totalCost: price * 50,
      isCompleted: false,
      category: (selectedIngredient?.category as any) || 'Dairy & Paneer',
    });

    setToastMessage(`Selected ${supName} for ${ingName} and added to Shopping List!`);
    setTimeout(() => setToastMessage(null), 3500);
    setSelectedIngredient(null);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#263D2D] text-white px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2.5 border border-[#F8C45C] text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F8C45C] shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white ml-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 1. HEADER (Heading & Subtitle + Mandi City Switcher) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E4D7C0]/70 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-fraunces text-[#2C1E14] tracking-tight">
            Find the Best Suppliers
          </h1>
          <p className="text-xs text-[#66523B] mt-0.5 font-normal">
            Discover wholesale rates across {currentCity?.name || 'wholesale mandis'}. Sourcing from inter-city mandis available.
          </p>
        </div>

        {/* Mandi City Selector & Landed Cost Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Mandi City Switcher for Inter-city procurement (e.g. Chandigarh restaurant ordering from Jaipur) */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E4D7C0] rounded-lg px-2.5 py-1 text-xs shadow-xs h-8">
            <MapPin className="w-3.5 h-3.5 text-[#315B42] shrink-0" />
            <span className="text-[11px] font-semibold text-[#8A7662]">Mandi:</span>
            <select
              value={isHydrated ? selectedCityId : 'delhi-ncr'}
              onChange={(e) => setCity(e.target.value as CityId)}
              className="bg-transparent font-bold text-[#2C1E14] focus:outline-none cursor-pointer pr-1 text-xs"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} Mandi
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 bg-white border border-[#E4D7C0] rounded-lg px-2.5 py-1 text-xs text-[#2C1E14] cursor-pointer shadow-xs select-none h-8">
            <input
              type="checkbox"
              checked={includeDelivery}
              onChange={(e) => setIncludeDelivery(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#263D2D]"
            />
            <span className="font-semibold text-xs">Include Delivery in Landed Rate</span>
          </label>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/app/shopping-list')}
            leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
            className="text-xs h-8"
          >
            Order Slip
          </Button>
        </div>
      </div>

      {/* 2. TOP SECTION: ONE COMPACT SAVINGS SUMMARY */}
      <div className="bg-[#FFFDF8] border border-[#263D2D]/15 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="p-3 bg-white border border-[#E4D7C0] rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[#8A7662] block">
              Current Monthly Spend
            </span>
            <span className="text-lg font-bold font-mono text-[#2C1E14] mt-0.5 block">
              ₹{summaryTotals.currentSpend.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#8A7662]">Based on existing restaurant purchase rates</span>
          </div>

          <div className="p-3 bg-[#EAF3ED] border border-[#315B42]/20 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[#315B42] block">
              Optimized Procurement Spend
            </span>
            <span className="text-lg font-bold font-mono text-[#315B42] mt-0.5 block">
              ₹{summaryTotals.bestSpend.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#315B42]/80">With cheapest mandi verified suppliers</span>
          </div>

          <div className="p-3 bg-[#FEF6E4] border border-[#F8C45C]/60 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[#8C5D08] block">
              Potential Monthly Savings
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold font-mono text-[#8C5D08]">
                ₹{summaryTotals.totalSavings.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-1.5 py-0.2 rounded">
                +{summaryTotals.savingsPercent}% margin
              </span>
            </div>
            <span className="text-[10px] text-[#8C5D08]/80">
              Annual impact: ₹{(summaryTotals.totalSavings * 12).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 3. INGREDIENT NAVIGATION (Clean Category Chips + Search Bar) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {SUPPLIER_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#263D2D] text-white shadow-xs'
                    : 'bg-white border border-[#EBE1CF] text-[#66523B] hover:bg-[#F1E8D8]/60 hover:text-[#2C1E14]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative sm:w-56 shrink-0">
          <Search className="w-3.5 h-3.5 text-[#8A7662] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search commodities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 rounded-lg border border-[#E4D7C0] bg-white text-xs text-[#2C1E14] focus:outline-none focus:border-[#315B42] h-7.5"
          />
        </div>
      </div>

      {/* 4. INGREDIENT CARDS (Wholesale Marketplace Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIngredients.map((ing) => (
          <div
            key={ing.id}
            onClick={() => setSelectedIngredient(ing)}
            className="bg-white border border-[#E4D7C0] hover:border-[#F8C45C] rounded-xl p-4 shadow-warm-xs hover:shadow-warm-sm transition-all cursor-pointer flex flex-col justify-between group space-y-3"
          >
            {/* Top Row: Visual + Name & Monthly Need */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF9EF] border border-[#E4D7C0] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getIngredientIllustration(ing.name, ing.category, 30)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-fraunces font-bold text-sm text-[#2C1E14] group-hover:text-[#315B42] transition-colors truncate">
                    {ing.name}
                  </h3>
                  <span className="text-[10px] text-[#8A7662] shrink-0 font-medium">
                    {ing.availableVendorsCount} vendors
                  </span>
                </div>
                <span className="text-[11px] text-[#8A7662] block mt-0.5">
                  Monthly Need:{' '}
                  <strong className="text-[#2C1E14] font-mono">
                    {ing.demand} {ing.standardUnit}
                  </strong>
                </span>
              </div>
            </div>

            {/* Price Comparison Row */}
            <div className="p-2.5 rounded-lg bg-[#FFF9EF] border border-[#E4D7C0]/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8A7662]">Current Price:</span>
                <span className="font-mono text-[#8A7662] line-through">
                  ₹{ing.currentPrice}/{ing.standardUnit}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#1D432B] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Best Mandi Price:
                </span>
                <span className="font-mono font-bold text-sm text-[#315B42]">
                  ₹{ing.bestPrice}/{ing.standardUnit}
                </span>
              </div>

              {ing.monthlySavings > 0 && (
                <div className="flex items-center justify-between pt-1 border-t border-[#E4D7C0]/40 text-[11px]">
                  <span className="text-[#8C5D08] font-semibold">Monthly Savings:</span>
                  <span className="font-mono font-bold text-[#8C5D08] bg-[#FEF6E4] px-1.5 py-0.2 rounded">
                    Save ₹{ing.monthlySavings.toLocaleString('en-IN')}/mo
                  </span>
                </div>
              )}
            </div>

            {/* Action Row */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIngredient(ing);
              }}
              className="w-full py-1.5 rounded-lg bg-[#263D2D] hover:bg-[#315B42] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>View Suppliers ({ing.availableVendorsCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 5. SUPPLIER DETAIL DRAWER (Clean Progressive Disclosure) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedIngredient && (
          <div className="fixed inset-0 z-50 flex justify-end p-2 sm:p-3 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIngredient(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
            />

            {/* Slide-in Drawer */}
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
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#E4D7C0] flex items-center justify-center shrink-0">
                    {getIngredientIllustration(selectedIngredient.name, selectedIngredient.category, 20)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-fraunces font-bold text-xs sm:text-sm text-[#2C1E14] truncate">
                      {selectedIngredient.name}
                    </h3>
                    <span className="text-[10px] text-[#8A7662]">
                      Monthly need: {selectedIngredient.monthlyUsageQuantity} {selectedIngredient.standardUnit} in {currentCity?.name}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedIngredient(null)}
                  className="w-7 h-7 rounded-full bg-[#F1E8D8] hover:bg-[#E2D5BF] flex items-center justify-center text-[#66523B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body: Competing Suppliers List */}
              <div className="p-3 overflow-y-auto flex-1 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2C1E14] uppercase text-[10px] tracking-wider">
                    Competing Mandi Suppliers ({drawerSuppliersList.length})
                  </span>
                  <span className="text-[10px] text-[#8A7662]">
                    Sorted by landed price
                  </span>
                </div>

                <div className="space-y-3">
                  {drawerSuppliersList.map((item, idx) => {
                    const isBest = idx === 0;
                    const isAiRecommended =
                      highlightSupplierId &&
                      (item.supplier?.id === highlightSupplierId ||
                        item.priceItem.supplierId === highlightSupplierId ||
                        item.supplier?.name.toLowerCase().includes(highlightSupplierId.toLowerCase()));

                    return (
                      <div
                        key={item.priceItem.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isAiRecommended
                            ? 'bg-[#FFFDF9] border-2 border-[#F8C45C] shadow-sm'
                            : isBest
                            ? 'bg-[#FFFDF9] border-[#315B42] shadow-xs'
                            : 'bg-white border-[#E4D7C0]'
                        }`}
                      >
                        {/* Supplier Name & Rating */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-xs text-[#2C1E14]">
                                {item.supplier?.name || item.priceItem.supplierName}
                              </h4>
                              {item.verified && (
                                <span title="Verified Mandi Supplier" className="inline-flex">
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#315B42]" />
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#8A7662] block">
                              {item.supplier?.address || 'Azadpur Mandi Stall #42'}
                            </span>
                            {item.supplier && (
                              <button
                                type="button"
                                onClick={() => setSelectedSupplierForModal(item.supplier!)}
                                className="text-[10px] text-[#315B42] hover:underline font-semibold inline-flex items-center gap-1 mt-0.5"
                              >
                                View Mandi Profile &rarr;
                              </button>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {isAiRecommended && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#263D2D] bg-[#F8C45C] px-2 py-0.5 rounded shadow-xs">
                                ★ AI Recommended
                              </span>
                            )}
                            {isBest && !isAiRecommended && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-[#315B42] px-2 py-0.5 rounded shadow-xs">
                                Cheapest Mandi Rate
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Supplier Specs Grid */}
                        <div className="grid grid-cols-3 gap-2 my-2.5 p-2 bg-[#FFF9EF] rounded-lg text-center text-xs">
                          <div>
                            <span className="text-[9px] text-[#8A7662] block">Landed Rate</span>
                            <span className="font-mono font-bold text-sm text-[#315B42]">
                              ₹{item.landedCost}/{item.unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-[#8A7662] block">Delivery</span>
                            <span className="text-[11px] font-semibold text-[#2C1E14] block mt-0.5">
                              {item.deliveryDays || 'Next day 5 AM'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-[#8A7662] block">MOQ / Rating</span>
                            <span className="text-[11px] font-semibold text-[#2C1E14] block mt-0.5">
                              {item.moq} {item.unit} &bull; ★ {item.rating}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectSupplierForIngredient(
                                selectedIngredient.name,
                                item.supplier?.name || item.priceItem.supplierName,
                                item.landedCost,
                                item.unit
                              )
                            }
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isBest
                                ? 'bg-[#F8C45C] hover:bg-[#eab348] text-[#263D2D]'
                                : 'bg-[#263D2D] hover:bg-[#315B42] text-white'
                            }`}
                          >
                            Select & Add to Order Slip
                          </button>

                          <a
                            href={`tel:${item.phone}`}
                            className="p-1.5 rounded-lg border border-[#E4D7C0] hover:bg-[#F9F5EC] text-[#66523B] flex items-center justify-center"
                            title="Call vendor"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-2.5 px-3 border-t border-[#F1E8D8] bg-[#FFF9EF] flex items-center justify-between shrink-0">
                <span className="text-[10px] text-[#8A7662]">
                  Direct Mandi rates updated daily
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedIngredient(null)}
                  className="px-3 py-1.5 rounded-lg bg-[#263D2D] text-white text-xs font-bold hover:bg-[#315B42]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. DEDICATED SUPPLIER PROFILE DRAWER (Direct Mandi Wholesaler Profile) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedSupplierForModal && (
          <div className="fixed inset-0 z-50 flex justify-end p-2 sm:p-3 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSupplierForModal(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 w-full sm:w-[410px] bg-white max-h-[calc(100vh-24px)] my-auto rounded-2xl shadow-2xl flex flex-col border border-[#E4D7C0] overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="p-3.5 px-4 border-b border-[#F1E8D8] bg-[#FFF9EF] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E4D7C0] flex items-center justify-center shrink-0 shadow-xs text-[#263D2D]">
                    <Store className="w-5 h-5 text-[#315B42]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-fraunces font-bold text-sm text-[#2C1E14] truncate">
                        {selectedSupplierForModal.name}
                      </h3>
                      {selectedSupplierForModal.verified && (
                        <span title="Verified Mandi Wholesaler" className="inline-flex">
                          <ShieldCheck className="w-4 h-4 text-[#315B42]" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#8A7662]">
                      <span className="font-semibold text-[#8C5D08]">★ {selectedSupplierForModal.rating}</span>
                      <span>({selectedSupplierForModal.reviewCount} reviews)</span>
                      <span>&bull;</span>
                      <span className="text-[#166534] font-medium">{selectedSupplierForModal.onTimeDeliveryRate}% on-time</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSupplierForModal(null)}
                  className="w-7 h-7 rounded-full bg-[#F1E8D8] hover:bg-[#E2D5BF] flex items-center justify-center text-[#66523B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-3.5 overflow-y-auto flex-1 space-y-3.5 text-xs">
                {/* Mandi Meta Card */}
                <div className="p-3 bg-[#FFFDF9] border border-[#E4D7C0] rounded-xl space-y-2">
                  <div className="flex items-start gap-2 text-[11px] text-[#2C1E14]">
                    <Store className="w-3.5 h-3.5 text-[#8A7662] shrink-0 mt-0.5" />
                    <span>{selectedSupplierForModal.address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F1E8D8] text-[10px]">
                    <div>
                      <span className="text-[#8A7662] block">Delivery Slot:</span>
                      <span className="font-semibold text-[#2C1E14]">{selectedSupplierForModal.deliveryTime || 'Daily 6:00 AM'}</span>
                    </div>
                    <div>
                      <span className="text-[#8A7662] block">Min Order Value:</span>
                      <span className="font-semibold text-[#2C1E14]">₹{selectedSupplierForModal.minOrderValue} (Free Delivery)</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Contacts */}
                <div className="flex gap-2">
                  <a
                    href={`tel:${selectedSupplierForModal.phone}`}
                    className="flex-1 py-2 rounded-xl bg-[#263D2D] hover:bg-[#315B42] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F8C45C]" />
                    <span>Call Mandi Vendor</span>
                  </a>
                  <a
                    href={`https://wa.me/${selectedSupplierForModal.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste, placing wholesale order from Food Market Hub for ${currentCity?.name || 'mandi'}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl border border-[#25D366] text-[#128C7E] hover:bg-[#DCFCE7]/40 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Commodities List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C1E14]">
                      Wholesale Commodities Available ({supplierCommodities.length})
                    </span>
                    <span className="text-[10px] text-[#8A7662]">Live Mandi Price</span>
                  </div>

                  <div className="divide-y divide-[#F1E8D8] border border-[#E4D7C0] rounded-xl overflow-hidden bg-[#FFFDF9]">
                    {supplierCommodities.map((item) => (
                      <div key={item.id} className="p-2.5 px-3 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-[#2C1E14] block truncate">
                            {item.ingredientName}
                          </span>
                          <span className="text-[10px] text-[#8A7662]">
                            MOQ: {item.moq} {item.unit} &bull; {item.deliveryDays}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="font-mono font-bold text-xs text-[#315B42]">
                            ₹{item.price}/{item.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              addShoppingItem({
                                ingredientId: item.ingredientId,
                                ingredientName: item.ingredientName,
                                quantity: item.moq || 10,
                                unit: item.unit,
                                targetSupplierId: selectedSupplierForModal.id,
                                targetSupplierName: selectedSupplierForModal.name,
                                estPricePerUnit: item.price,
                                totalCost: item.price * (item.moq || 10),
                                isCompleted: false,
                                category: item.category,
                              });
                              setToastMessage(`Added ${item.ingredientName} (${item.moq || 10}${item.unit}) to Order Slip!`);
                            }}
                            className="px-2.5 py-1 rounded-md bg-[#263D2D] hover:bg-[#315B42] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs"
                          >
                            + Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-2.5 px-4 border-t border-[#F1E8D8] bg-[#FFF9EF] flex items-center justify-between shrink-0">
                <span className="text-[10px] text-[#8A7662]">
                  Verified APMC Wholesale Partner
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSupplierForModal(null)}
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
