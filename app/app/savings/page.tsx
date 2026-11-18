'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Download,
  FileSpreadsheet,
  Printer,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

// Dynamic chart loading
const FoodCostDonutChart = dynamic(
  () => import('@/components/savings/SavingsCharts').then((m) => m.FoodCostDonutChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 flex items-center justify-center bg-[#FFF9EF] rounded-xl text-xs text-[#8A7662]">
        Loading category breakdown...
      </div>
    ),
  }
);

const SixMonthSavingsChart = dynamic(
  () => import('@/components/savings/SavingsCharts').then((m) => m.SixMonthSavingsChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 flex items-center justify-center bg-[#FFF9EF] rounded-xl text-xs text-[#8A7662]">
        Loading historical trends...
      </div>
    ),
  }
);

export default function SavingsPage() {
  const isHydrated = useHydrated();
  const { ingredients, dishes, suppliers, getCurrentRestaurant, getCurrentCity } = useAppStore();

  const currentRestaurant = isHydrated ? getCurrentRestaurant() : null;
  const currentCity = isHydrated ? getCurrentCity() : null;

  // Breakdown tab: 'ingredient' | 'supplier'
  const [breakdownView, setBreakdownView] = useState<'ingredient' | 'supplier'>('ingredient');
  const [selectedStatementPeriod, setSelectedStatementPeriod] = useState('Current Month (November 2026)');

  // Executive Procurement Totals
  const financialTotals = useMemo(() => {
    let baselineSpend = 0;
    let optimizedSpend = 0;

    const items = ingredients.map((ing) => {
      const demand = ing.monthlyUsageQuantity || 120;
      const currentRate = ing.userCurrentPrice || ing.currentAvgPrice || Math.round(ing.bestCityPrice * 1.25);
      const mandiRate = ing.bestCityPrice;

      const baseline = currentRate * demand;
      const optimized = mandiRate * demand;
      const saved = Math.max(0, baseline - optimized);

      baselineSpend += baseline;
      optimizedSpend += optimized;

      return {
        id: ing.id,
        name: ing.name,
        category: ing.category,
        demand,
        unit: ing.standardUnit,
        currentRate,
        mandiRate,
        baseline,
        optimized,
        saved,
        supplierName: ing.bestSupplierName || 'APMC Direct Mandi',
      };
    });

    const netSavings = Math.max(0, baselineSpend - optimizedSpend);
    const savingsPercent = baselineSpend > 0 ? Math.round((netSavings / baselineSpend) * 1000) / 10 : 0;
    const annualProjected = netSavings * 12;

    return {
      baselineSpend,
      optimizedSpend,
      netSavings,
      savingsPercent,
      annualProjected,
      items: items.sort((a, b) => b.saved - a.saved),
    };
  }, [ingredients]);

  // Supplier-wise aggregated savings
  const supplierBreakdown = useMemo(() => {
    const map: Record<
      string,
      { supplierName: string; itemCount: number; totalSpend: number; totalSaved: number }
    > = {};

    financialTotals.items.forEach((item) => {
      const key = item.supplierName;
      if (!map[key]) {
        map[key] = {
          supplierName: key,
          itemCount: 0,
          totalSpend: 0,
          totalSaved: 0,
        };
      }
      map[key].itemCount += 1;
      map[key].totalSpend += item.optimized;
      map[key].totalSaved += item.saved;
    });

    return Object.values(map).sort((a, b) => b.totalSaved - a.totalSaved);
  }, [financialTotals]);

  // Print/Export simulation
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'Ingredient,Category,Monthly Demand,Unit,Current Rate,Mandi Rate,Monthly Saved,Preferred Vendor\n';
    const rows = financialTotals.items
      .map(
        (i) =>
          `"${i.name}","${i.category}",${i.demand},"${i.unit}",${i.currentRate},${i.mandiRate},${i.saved},"${i.supplierName}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FoodMarketHub_Savings_Statement_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4 w-full max-w-[1600px] mx-auto pb-12">
      {/* 1. HEADER (Heading & Executive Document Actions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E4D7C0]/70 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-fraunces text-[#2C1E14] tracking-tight">
              Your Procurement Savings
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#EAF3ED] border border-[#315B42]/20 text-[#315B42] text-[11px] font-semibold">
              Verified Mandi Audited
            </span>
          </div>
          <p className="text-xs text-[#66523B] mt-0.5 font-normal">
            Financial statement of kitchen procurement efficiency for {currentRestaurant?.name || 'Delhi Haveli'}.
          </p>
        </div>

        {/* Financial Document Export Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-[#315B42]" />}
            className="text-xs h-8"
          >
            Export Excel / CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs h-8"
          >
            Download PDF Statement
          </Button>
        </div>
      </div>

      {/* 2. MAIN FINANCIAL HIGHLIGHT (Executive Procurement Statement Banner) */}
      <div className="bg-[#FFFDF8] border border-[#263D2D]/15 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 bg-white border border-[#E4D7C0] rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[#8A7662] block">
              Previous Procurement Spend
            </span>
            <span className="text-lg font-bold font-mono text-[#2C1E14] mt-0.5 block">
              ₹{financialTotals.baselineSpend.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#8A7662]">Unoptimized middleman rates</span>
          </div>

          <div className="p-3 bg-[#EAF3ED] border border-[#315B42]/20 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[#315B42] block">
              Optimized Mandi Spend
            </span>
            <span className="text-lg font-bold font-mono text-[#315B42] mt-0.5 block">
              ₹{financialTotals.optimizedSpend.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#315B42]/80">With verified wholesale mandis</span>
          </div>

          <div className="p-3 bg-[#FEF6E4] border border-[#F8C45C]/60 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[#8C5D08] block">
              Total Monthly Savings
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold font-mono text-[#8C5D08]">
                ₹{financialTotals.netSavings.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-1.5 py-0.2 rounded">
                +{financialTotals.savingsPercent}%
              </span>
            </div>
            <span className="text-[10px] text-[#8C5D08]/80">Direct bottom-line margin expansion</span>
          </div>

          <div className="p-3 bg-[#263D2D] text-white rounded-xl">
            <span className="text-[10px] uppercase font-bold text-[#F8C45C] block">
              Annual Projected Savings
            </span>
            <span className="text-lg font-bold font-mono text-white mt-0.5 block">
              ₹{financialTotals.annualProjected.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-white/70">12-month compounding benefit</span>
          </div>
        </div>
      </div>

      {/* 3. VISUAL REPORTS ROW (6-Month Trajectory & Category Share) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Six Month Trajectory */}
        <div className="lg:col-span-7 bg-white border border-[#E0D1B8] rounded-2xl p-4 shadow-warm-xs space-y-2">
          <div className="flex items-center justify-between border-b border-[#F1E8D8] pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1E14]">
                Procurement Trend (Retail vs Mandi Pooled)
              </h3>
              <span className="text-[10px] text-[#8A7662]">Monthly historical baseline savings</span>
            </div>
            <span className="text-[10px] text-[#315B42] font-semibold">6-Month Trend</span>
          </div>
          <SixMonthSavingsChart />
        </div>

        {/* Category-wise Savings Share */}
        <div className="lg:col-span-5 bg-white border border-[#E0D1B8] rounded-2xl p-4 shadow-warm-xs space-y-2">
          <div className="flex items-center justify-between border-b border-[#F1E8D8] pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C1E14]">
                Category-wise Cost Breakdown
              </h3>
              <span className="text-[10px] text-[#8A7662]">Proportion of total kitchen food spend</span>
            </div>
            <span className="text-[10px] text-[#8A7662]">6 Key Categories</span>
          </div>
          <FoodCostDonutChart />
        </div>
      </div>

      {/* 4. FINANCIAL STATEMENT SECTION (Executive Ledger Table) */}
      <div className="bg-white border border-[#E0D1B8] rounded-2xl p-4 sm:p-5 shadow-warm-xs space-y-4">
        {/* Table Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1E8D8] pb-3">
          <div>
            <h2 className="text-base font-bold font-fraunces text-[#2C1E14]">
              Procurement Audit Statement
            </h2>
            <p className="text-xs text-[#66523B]">
              Itemized billing statement comparing current retail benchmarks vs direct mandi wholesale pricing.
            </p>
          </div>

          {/* Toggle: Ingredient-wise vs Supplier-wise */}
          <div className="bg-[#F1E8D8] p-0.5 rounded-lg inline-flex items-center text-xs font-bold border border-[#E0D1B8]">
            <button
              type="button"
              onClick={() => setBreakdownView('ingredient')}
              className={`px-3 py-1 rounded-md transition-all ${
                breakdownView === 'ingredient'
                  ? 'bg-white text-[#2C1E14] shadow-xs'
                  : 'text-[#66523B] hover:text-[#2C1E14]'
              }`}
            >
              Ingredient-wise ({financialTotals.items.length})
            </button>
            <button
              type="button"
              onClick={() => setBreakdownView('supplier')}
              className={`px-3 py-1 rounded-md transition-all ${
                breakdownView === 'supplier'
                  ? 'bg-white text-[#2C1E14] shadow-xs'
                  : 'text-[#66523B] hover:text-[#2C1E14]'
              }`}
            >
              Supplier-wise ({supplierBreakdown.length})
            </button>
          </div>
        </div>

        {/* VIEW 1: INGREDIENT STATEMENT TABLE */}
        {breakdownView === 'ingredient' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E4D7C0] text-[#8A7662] uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Commodity Item</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Monthly Volume</th>
                  <th className="py-2.5 px-3 text-right">Current Rate</th>
                  <th className="py-2.5 px-3 text-right">Mandi Rate</th>
                  <th className="py-2.5 px-3 text-right">Monthly Savings</th>
                  <th className="py-2.5 px-3">Preferred Vendor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1E8D8]">
                {financialTotals.items.map((row) => (
                  <tr key={row.id} className="hover:bg-[#FFF9EF]/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#2C1E14]">{row.name}</td>
                    <td className="py-2.5 px-3 text-[#66523B]">{row.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {row.demand} {row.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#8A7662] line-through">
                      ₹{row.currentRate}/{row.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#315B42]">
                      ₹{row.mandiRate}/{row.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#8C5D08] bg-[#FEF6E4]/40">
                      ₹{row.saved.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-[#2C1E14] font-medium">{row.supplierName}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#263D2D] bg-[#FFFDF8] font-bold text-xs">
                  <td colSpan={5} className="py-3 px-3 text-[#2C1E14]">
                    Total Monthly Net Procurement Savings
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm text-[#166534]">
                    ₹{financialTotals.netSavings.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-[#315B42]">
                    +{financialTotals.savingsPercent}% Cost Reduction
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* VIEW 2: SUPPLIER STATEMENT TABLE */}
        {breakdownView === 'supplier' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E4D7C0] text-[#8A7662] uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Mandi Supplier Partner</th>
                  <th className="py-2.5 px-3 text-right">Items Sourced</th>
                  <th className="py-2.5 px-3 text-right">Monthly Spend</th>
                  <th className="py-2.5 px-3 text-right">Total Net Savings</th>
                  <th className="py-2.5 px-3 text-right">Share of Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1E8D8]">
                {supplierBreakdown.map((row, idx) => {
                  const share =
                    financialTotals.netSavings > 0
                      ? Math.round((row.totalSaved / financialTotals.netSavings) * 100)
                      : 0;

                  return (
                    <tr key={idx} className="hover:bg-[#FFF9EF]/80 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-[#2C1E14] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#315B42]" />
                        {row.supplierName}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">{row.itemCount} commodities</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#2C1E14]">
                        ₹{row.totalSpend.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#166534] bg-[#DCFCE7]/30">
                        ₹{row.totalSaved.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#66523B]">{share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
