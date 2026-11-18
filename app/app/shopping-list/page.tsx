'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Printer,
  Download,
  Share2,
  Trash2,
  CheckCircle2,
  Plus,
  Minus,
  Calendar,
  Building2,
  Phone,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Clock,
  Truck,
  Check,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { getIngredientIllustration } from '@/lib/ingredientVisuals';

export default function ShoppingListPage() {
  const isHydrated = useHydrated();
  const {
    shoppingList,
    suppliers,
    updateShoppingItemQuantity,
    toggleShoppingItem,
    removeShoppingItem,
    clearShoppingList,
    getCurrentCity,
    getCurrentRestaurant,
  } = useAppStore();

  const currentCity = isHydrated ? getCurrentCity() : null;
  const currentRestaurant = isHydrated ? getCurrentRestaurant() : null;

  // Frequency toggle: 'weekly' | 'monthly'
  const [cycle, setCycle] = useState<'weekly' | 'monthly'>('weekly');
  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const multiplier = cycle === 'weekly' ? 1 : 4.3;

  // Group items by supplier
  const groupedSuppliers = useMemo(() => {
    const map: Record<
      string,
      {
        supplierId: string;
        supplierName: string;
        supplierObj: (typeof suppliers)[0] | null;
        items: typeof shoppingList;
        subtotal: number;
        savingsSubtotal: number;
      }
    > = {};

    shoppingList.forEach((item) => {
      const supId = item.targetSupplierId || 'sup-apmc';
      const supName = item.targetSupplierName || 'Azadpur APMC Direct Mandi';

      if (!map[supId]) {
        const found = suppliers.find((s) => s.id === supId) || null;
        map[supId] = {
          supplierId: supId,
          supplierName: supName,
          supplierObj: found,
          items: [],
          subtotal: 0,
          savingsSubtotal: 0,
        };
      }

      const lineTotal = item.quantity * multiplier * item.estPricePerUnit;
      const lineRetail = item.quantity * multiplier * (item.estPricePerUnit * 1.25);
      const lineSavings = Math.max(0, lineRetail - lineTotal);

      map[supId].items.push(item);
      map[supId].subtotal += lineTotal;
      map[supId].savingsSubtotal += lineSavings;
    });

    return Object.values(map);
  }, [shoppingList, suppliers, multiplier]);

  // Grand totals
  const grandTotals = useMemo(() => {
    let totalProcurement = 0;
    let totalRetail = 0;

    shoppingList.forEach((item) => {
      const q = item.quantity * multiplier;
      const cost = q * item.estPricePerUnit;
      const retail = q * (item.estPricePerUnit * 1.25);
      totalProcurement += cost;
      totalRetail += retail;
    });

    const netSavings = Math.max(0, totalRetail - totalProcurement);
    const savingsPercent = totalRetail > 0 ? Math.round((netSavings / totalRetail) * 100) : 0;

    return {
      totalProcurement: Math.round(totalProcurement),
      totalRetail: Math.round(totalRetail),
      netSavings: Math.round(netSavings),
      savingsPercent,
    };
  }, [shoppingList, multiplier]);

  // Print slip action
  const handlePrint = () => {
    window.print();
  };

  // WhatsApp individual vendor action
  const handleWhatsAppVendor = (supName: string, items: typeof shoppingList, subtotal: number) => {
    const itemList = items
      .map(
        (it) =>
          `• ${it.ingredientName}: ${Math.round(it.quantity * multiplier * 10) / 10} ${it.unit} @ ₹${it.estPricePerUnit}/${it.unit}`
      )
      .join('\n');

    const message = `Hello ${supName},\nOrder from ${currentRestaurant?.name || 'Restaurant'}:\n\n${itemList}\n\nTotal Estimated: ₹${Math.round(subtotal).toLocaleString('en-IN')}\nPlease confirm delivery time.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Share order slip
  const handleShare = async () => {
    const text = `Procurement Order Slip for ${currentRestaurant?.name || 'Restaurant'}\nTotal: ₹${grandTotals.totalProcurement.toLocaleString('en-IN')}\nSuppliers: ${groupedSuppliers.length} vendors\nGenerated via Food Market Hub`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Procurement Order Slip', text });
      } catch (err) {
        // fallback
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-12">
      {/* 1. HEADER (Heading & Actions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E4D7C0]/70 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-fraunces text-[#2C1E14] tracking-tight">
              Your Shopping List
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#EAF3ED] border border-[#315B42]/20 text-[#315B42] text-[11px] font-semibold">
              {shoppingList.length} Items &bull; {groupedSuppliers.length} Suppliers
            </span>
          </div>
          <p className="text-xs text-[#66523B] mt-0.5 font-normal">
            Direct procurement slips organized by verified mandi wholesale vendors.
          </p>
        </div>

        {/* Controls: Frequency Toggle & Document Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Cycle Toggle */}
          <div className="bg-[#F1E8D8] p-0.5 rounded-lg inline-flex items-center text-xs font-bold border border-[#E0D1B8]">
            <button
              type="button"
              onClick={() => setCycle('weekly')}
              className={`px-3 py-1 rounded-md transition-all ${
                cycle === 'weekly'
                  ? 'bg-white text-[#2C1E14] shadow-xs'
                  : 'text-[#66523B] hover:text-[#2C1E14]'
              }`}
            >
              Weekly Slip
            </button>
            <button
              type="button"
              onClick={() => setCycle('monthly')}
              className={`px-3 py-1 rounded-md transition-all ${
                cycle === 'monthly'
                  ? 'bg-white text-[#2C1E14] shadow-xs'
                  : 'text-[#66523B] hover:text-[#2C1E14]'
              }`}
            >
              Monthly Slip
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            className="text-xs h-8"
          >
            Print
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleShare}
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            className="text-xs h-8"
          >
            {copied ? 'Copied Link!' : 'Share Slip'}
          </Button>
        </div>
      </div>

      {/* 2. ORDER DOCUMENT CARD (Official Procurement Slip Format) */}
      <div className="bg-white border border-[#E0D1B8] rounded-2xl shadow-warm-xs overflow-hidden">
        {/* Document Header Band */}
        <div className="p-4 sm:p-5 bg-[#FFF9EF] border-b border-[#E4D7C0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#8C5D08] bg-[#FEF6E4] px-2 py-0.5 rounded border border-[#F8C45C]/50">
                #FMH-ORD-2026-DEL-089
              </span>
              <span className="text-[11px] text-[#8A7662]">
                Issued: 18 November 2026 &bull; {cycle === 'weekly' ? '7-Day Procurement' : '30-Day Procurement'}
              </span>
            </div>
            <h2 className="font-fraunces font-bold text-base text-[#2C1E14] mt-1">
              {currentRestaurant?.name || 'Delhi Haveli Restaurant'} &bull; Central Kitchen
            </h2>
            <span className="text-xs text-[#66523B]">
              Procurement Hub: {currentCity?.name || 'Delhi NCR'} Mandi Cluster
            </span>
          </div>

          <div className="text-right sm:border-l sm:border-[#E4D7C0] sm:pl-5 shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#8A7662] block">
              Estimated Procurement Total
            </span>
            <span className="text-xl font-bold font-mono text-[#315B42] block">
              ₹{grandTotals.totalProcurement.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-semibold text-[#166534]">
              Saves ₹{grandTotals.netSavings.toLocaleString('en-IN')} ({grandTotals.savingsPercent}%) vs Supermarket
            </span>
          </div>
        </div>

        {/* 3. SUPPLIER GROUPINGS (Each verified vendor has its own clean sub-order section) */}
        <div className="p-4 sm:p-5 space-y-6">
          {groupedSuppliers.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8A7662]">
              Your order slip is empty. Go to{' '}
              <Link href="/app/suppliers" className="text-[#315B42] font-bold underline">
                Find Suppliers
              </Link>{' '}
              to add items.
            </div>
          ) : (
            groupedSuppliers.map((group, gIdx) => (
              <div
                key={group.supplierId}
                className="border border-[#E4D7C0] rounded-xl overflow-hidden bg-[#FFFDF9]"
              >
                {/* Vendor Header */}
                <div className="p-3 bg-[#F1E8D8]/50 border-b border-[#E4D7C0] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#315B42]" />
                      <h3 className="font-fraunces font-bold text-sm text-[#2C1E14]">
                        {group.supplierName}
                      </h3>
                      <span className="inline-flex">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#315B42]" />
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#8A7662] mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {group.supplierObj?.phone || '+91 98110 24891'}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" /> Delivery: Early Morning 5:00 AM
                      </span>
                      <span>&bull;</span>
                      <span>Min Order: ₹{group.supplierObj?.minOrderValue || 2000} (Met ✓)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className="font-mono font-bold text-xs text-[#2C1E14]">
                      Subtotal: ₹{Math.round(group.subtotal).toLocaleString('en-IN')}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleWhatsAppVendor(group.supplierName, group.items, group.subtotal)
                      }
                      className="px-2.5 py-1 rounded-md bg-[#166534] hover:bg-[#14532D] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                      title="Send WhatsApp Order to Vendor"
                    >
                      <MessageSquare className="w-3 h-3" /> WhatsApp Order
                    </button>
                  </div>
                </div>

                {/* Ingredient Rows in this Vendor */}
                <div className="divide-y divide-[#F1E8D8] text-xs">
                  {group.items.map((item) => {
                    const lineQty = Math.round(item.quantity * multiplier * 10) / 10;
                    const linePrice = Math.round(lineQty * item.estPricePerUnit);

                    return (
                      <div
                        key={item.id}
                        className={`p-3 flex items-center justify-between gap-3 transition-colors ${
                          item.isCompleted ? 'bg-[#F9F5EC]/60 opacity-60' : 'hover:bg-[#FFF9EF]'
                        }`}
                      >
                        {/* Checkbox & Item Name */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleShoppingItem(item.id)}
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              item.isCompleted
                                ? 'bg-[#315B42] border-[#315B42] text-white'
                                : 'border-[#D1BF9F] bg-white'
                            }`}
                          >
                            {item.isCompleted && <Check className="w-3 h-3" />}
                          </button>

                          <div className="w-7 h-7 rounded bg-white border border-[#E4D7C0] flex items-center justify-center shrink-0">
                            {getIngredientIllustration(item.ingredientName, '', 18)}
                          </div>

                          <div className="min-w-0">
                            <span
                              className={`font-semibold text-xs text-[#2C1E14] block truncate ${
                                item.isCompleted ? 'line-through text-[#8A7662]' : ''
                              }`}
                            >
                              {item.ingredientName}
                            </span>
                            <span className="text-[10px] text-[#8A7662]">
                              Wholesale Mandi Rate: ₹{item.estPricePerUnit}/{item.unit}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Quantity Stepper & Price */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center border border-[#E4D7C0] rounded-md bg-white">
                            <button
                              type="button"
                              onClick={() => {
                                const newQ = Math.max(1, item.quantity - 5);
                                updateShoppingItemQuantity(item.id, newQ);
                              }}
                              className="px-2 py-0.5 text-[#66523B] hover:text-[#2C1E14] font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 font-mono text-xs font-bold text-[#2C1E14]">
                              {lineQty} {item.unit}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newQ = item.quantity + 5;
                                updateShoppingItemQuantity(item.id, newQ);
                              }}
                              className="px-2 py-0.5 text-[#66523B] hover:text-[#2C1E14] font-bold"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-mono font-bold text-xs text-[#2C1E14] w-20 text-right">
                            ₹{linePrice.toLocaleString('en-IN')}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeShoppingItem(item.id)}
                            className="w-6 h-6 rounded hover:bg-[#FEE2E2] text-[#C2410C] flex items-center justify-center"
                            title="Remove item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. FINAL SUMMARY DOCUMENT FOOTER */}
        <div className="p-4 sm:p-5 bg-[#FFF9EF] border-t border-[#E4D7C0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClearConfirm(!showClearConfirm)}
              className="text-xs text-[#C2410C] hover:bg-rose-50"
            >
              Clear Entire Slip
            </Button>
            {showClearConfirm && (
              <button
                type="button"
                onClick={() => {
                  clearShoppingList();
                  setShowClearConfirm(false);
                }}
                className="px-2.5 py-1 rounded bg-[#C2410C] text-white text-[11px] font-bold"
              >
                Confirm Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] text-[#8A7662] block">Total Procurement Payable</span>
              <span className="font-mono font-bold text-base text-[#2C1E14]">
                ₹{grandTotals.totalProcurement.toLocaleString('en-IN')}
              </span>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              className="text-xs font-bold"
            >
              Print Master Slip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
