'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { MascotFace } from '@/components/illustrations/MascotFace';
import {
  Printer,
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
  Copy,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function ShoppingListPage() {
  const { shoppingList, suppliers, updateShoppingItemQuantity, clearShoppingList, getCurrentCity } = useAppStore();
  const [cycle, setCycle] = useState<'weekly' | 'monthly'>('weekly');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentCity = getCurrentCity();
  const multiplier = cycle === 'weekly' ? 1 : 4.3;

  // Group items by supplier
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, typeof shoppingList> = {};
    shoppingList.forEach(item => {
      const supp = item.targetSupplierId || 'other';
      if (!groups[supp]) groups[supp] = [];
      groups[supp].push(item);
    });
    return groups;
  }, [shoppingList]);

  // Price calculations
  const totals = React.useMemo(() => {
    let grandTotal = 0;
    let retailTotal = 0;

    shoppingList.forEach(item => {
      const q = item.quantity * multiplier;
      const wholesale = q * item.estPricePerUnit;
      const retail = q * (item.estPricePerUnit * 1.25);
      grandTotal += wholesale;
      retailTotal += retail;
    });

    const totalSavings = Math.max(0, retailTotal - grandTotal);
    return { grandTotal, retailTotal, totalSavings };
  }, [shoppingList, multiplier]);

  const handleShare = async () => {
    const summaryText = `🛒 Food Market Hub - Procurement Slip (${cycle.toUpperCase()})\nCity: ${currentCity.name}\nTotal Estimated: ₹${Math.round(totals.grandTotal).toLocaleString('en-IN')}\nEstimated Savings: ₹${Math.round(totals.totalSavings).toLocaleString('en-IN')}\nItems count: ${shoppingList.length} ingredients.\nGenerated on Food Market Hub.`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Kitchen Procurement Order Slip',
          text: summaryText,
        });
        return;
      } catch (err) {
        // User cancelled or fallback
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `*Food Market Hub - Kitchen Order Slip (${cycle.toUpperCase()})*\nCity: ${currentCity.name}\nGrand Total: ₹${Math.round(totals.grandTotal).toLocaleString('en-IN')}\nTotal Savings vs Retail: ₹${Math.round(totals.totalSavings).toLocaleString('en-IN')}\n\nSuppliers: ${Object.keys(groupedItems).length}\nIngredients: ${shoppingList.length}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (shoppingList.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-white border border-[#263D2D]/10 mx-auto flex items-center justify-center shadow-sm">
          <MascotFace emotion="neutral" size={68} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#263D2D] font-outfit">Your Grocery Slip is Empty</h2>
          <p className="text-sm text-[#66523B] mt-1 max-w-md mx-auto">
            You haven&apos;t generated a procurement order list yet. Visit your ingredient list to batch export orders or ask Chef Hub AI.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/app/menu?view=ingredients"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#263D2D] text-white font-semibold text-sm hover:bg-[#315B42] transition-colors flex items-center justify-center gap-2"
          >
            Go to Ingredients Review <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/app/assistant"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F8C45C] text-[#263D2D] font-semibold text-sm hover:bg-[#f3b942] transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Ask Chef Hub to Build Slip
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263D2D]/10 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#263D2D] font-outfit">
            Procurement <span className="font-fraunces italic font-normal text-[#315B42]">Slip</span>
          </h1>
          <p className="text-sm text-[#66523B] mt-1">
            Supplier-grouped digital ordering slip optimized for bulk discounts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cycle Toggle */}
          <div className="bg-white p-1 rounded-xl border border-[#263D2D]/10 flex items-center text-xs font-semibold">
            <button
              onClick={() => setCycle('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                cycle === 'weekly' ? 'bg-[#263D2D] text-white shadow-sm' : 'text-[#66523B] hover:text-[#263D2D]'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                cycle === 'monthly' ? 'bg-[#263D2D] text-white shadow-sm' : 'text-[#66523B] hover:text-[#263D2D]'
              }`}
            >
              Monthly (4.3x)
            </button>
          </div>

          {/* Print PDF */}
          <button
            onClick={() => window.print()}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#263D2D]/15 hover:bg-[#FFF9EF] text-[#263D2D] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          {/* WhatsApp Share */}
          <button
            onClick={handleWhatsAppShare}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            title="Send to WhatsApp"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Share / Copy */}
          <button
            onClick={handleShare}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#263D2D]/15 hover:bg-[#FFF9EF] text-[#263D2D] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            title="Copy or share summary"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Clear */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
            title="Clear Shopping List"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-rose-800">
          <div>
            <strong>Are you sure?</strong> This will empty all {shoppingList.length} ingredients from your current slip.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                clearShoppingList();
                setShowClearConfirm(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700"
            >
              Confirm Clear
            </button>
          </div>
        </div>
      )}

      {/* PRINTABLE ORDER SLIP */}
      <div className="bg-[#FFFDF8] border-2 border-[#263D2D]/15 rounded-3xl shadow-lg p-6 sm:p-8 relative overflow-hidden print:shadow-none print:border print:m-0 print:p-4">
        {/* Decorative Top Perforation */}
        <div className="flex justify-between items-center -mx-8 -mt-8 mb-6 h-4 bg-[#263D2D]/10 [mask-image:radial-gradient(circle_at_bottom,transparent_6px,#000_7px)] [mask-size:16px_16px]" />

        {/* Order Slip Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-dashed border-[#263D2D]/15 pb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#66523B] font-bold">
              Food Market Hub • Digital Order Slip
            </div>
            <h2 className="text-2xl sm:text-3xl font-fraunces font-bold text-[#263D2D] mt-1">
              Procurement Order #FMH-{new Date().getFullYear()}-8492
            </h2>
            <div className="text-xs text-[#66523B] flex items-center gap-2 mt-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>•</span>
              <span className="font-semibold text-[#263D2D]">{cycle === 'weekly' ? 'Weekly Cycle (7 Days)' : 'Monthly Cycle (30 Days)'}</span>
              <span>•</span>
              <span>Mandi City: <strong>{currentCity.name}</strong></span>
            </div>
          </div>

          <div className="bg-[#FFF9EF] border border-[#F8C45C] rounded-2xl p-3 text-right sm:min-w-[180px]">
            <div className="text-[11px] text-[#66523B] uppercase font-bold tracking-wider">Estimated Total</div>
            <div className="text-2xl font-fraunces font-bold text-[#263D2D] mt-0.5">
              ₹{Math.round(totals.grandTotal).toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              Saves ₹{Math.round(totals.totalSavings).toLocaleString('en-IN')} vs Retail
            </div>
          </div>
        </div>

        {/* Grouped Supplier Lists */}
        <div className="divide-y-2 divide-dashed divide-[#263D2D]/15">
          {Object.entries(groupedItems).map(([supplierId, items]) => {
            const supplier = suppliers.find(s => s.id === supplierId);
            const supplierName = supplier?.name || items[0]?.targetSupplierName || 'Consolidated Mandi Wholesale';
            const supplierPhone = supplier?.phone || '+91 98110 54201';
            const supplierLocation = supplier?.address || currentCity.name;

            const groupSubtotal = items.reduce(
              (sum, it) => sum + it.quantity * multiplier * it.estPricePerUnit,
              0
            );

            return (
              <div key={supplierId} className="py-6 space-y-4">
                {/* Supplier Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FFF9EF] p-3.5 rounded-2xl border border-[#263D2D]/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#263D2D] text-white flex items-center justify-center text-xs font-bold">
                      <Building2 className="w-4 h-4 text-[#F8C45C]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#263D2D] font-outfit">{supplierName}</div>
                      <div className="text-xs text-[#66523B]">
                        {supplierLocation} • Min Order: ₹{supplier?.minOrderValue?.toLocaleString('en-IN') || '2,000'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <a
                      href={`tel:${supplierPhone}`}
                      className="inline-flex items-center gap-1.5 text-xs text-[#315B42] hover:underline font-semibold bg-white px-2.5 py-1 rounded-lg border border-[#263D2D]/10 print:border-none"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{supplierPhone}</span>
                    </a>
                    <span className="text-xs font-bold text-[#263D2D] bg-[#F8C45C]/30 px-2.5 py-1 rounded-lg">
                      Subtotal: ₹{Math.round(groupSubtotal).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items in this group */}
                <div className="space-y-3 px-1">
                  {items.map((item) => {
                    const totalQty = Math.round(item.quantity * multiplier * 10) / 10;
                    const itemCost = Math.round(totalQty * item.estPricePerUnit);

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 text-xs group"
                      >
                        {/* Name */}
                        <div className="flex-1 min-w-0 pr-2">
                          <span className="font-semibold text-[#263D2D]">{item.ingredientName}</span>
                        </div>

                        {/* Inline quantity adjuster */}
                        <div className="flex items-center gap-2 print:hidden">
                          <button
                            onClick={() => updateShoppingItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-5 h-5 rounded-md bg-[#263D2D]/5 hover:bg-[#263D2D]/10 flex items-center justify-center text-[#263D2D]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-12 text-center font-mono font-semibold text-[#263D2D]">
                            {totalQty} {item.unit}
                          </span>
                          <button
                            onClick={() => updateShoppingItemQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 rounded-md bg-[#263D2D]/5 hover:bg-[#263D2D]/10 flex items-center justify-center text-[#263D2D]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Print only quantity */}
                        <div className="hidden print:block font-mono font-semibold text-[#263D2D]">
                          {totalQty} {item.unit}
                        </div>

                        {/* Dotted Leader */}
                        <div className="flex-1 border-b border-dotted border-[#263D2D]/20 mx-2 hidden xs:block" />

                        {/* Unit price and Total */}
                        <div className="text-right whitespace-nowrap">
                          <span className="text-[10px] text-[#66523B] mr-2">
                            @ ₹{item.estPricePerUnit}/{item.unit}
                          </span>
                          <span className="font-bold text-[#263D2D] font-mono">
                            ₹{itemCost.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grand Total & Perforated Bottom */}
        <div className="mt-6 pt-6 border-t-2 border-dashed border-[#263D2D]/15 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#66523B] font-medium">Standard Retail Equivalent:</span>
            <span className="font-mono text-[#66523B] line-through">
              ₹{Math.round(totals.retailTotal).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Food Market Hub Direct Mandi Savings:
            </span>
            <span className="font-mono font-bold text-emerald-700">
              - ₹{Math.round(totals.totalSavings).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between text-base sm:text-lg font-bold border-t border-[#263D2D]/10 pt-3">
            <span className="text-[#263D2D] font-fraunces">Net Wholesale Total Due:</span>
            <span className="font-mono text-xl sm:text-2xl text-[#263D2D]">
              ₹{Math.round(totals.grandTotal).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Bottom Perforation styling */}
        <div className="flex justify-between items-center -mx-8 -mb-8 mt-8 h-4 bg-[#263D2D]/10 [mask-image:radial-gradient(circle_at_top,transparent_6px,#000_7px)] [mask-size:16px_16px]" />
      </div>
    </div>
  );
}
