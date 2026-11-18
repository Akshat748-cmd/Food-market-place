'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Receipt, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

// Lazy load the full Recharts component cleanly
const SavingsBarChart = dynamic(() => import('@/components/landing/SavingsBarChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-cream-50 rounded-xl animate-pulse text-xs text-[#8A7662]">
      Loading Mandi Comparison Chart...
    </div>
  ),
});

const SAVINGS_CHART_DATA = [
  { category: 'Dairy & Paneer', current: 112000, optimized: 89300, saved: 22700 },
  { category: 'Poultry & Meat', current: 135000, optimized: 114700, saved: 20300 },
  { category: 'Oils & Ghee', current: 48000, optimized: 41400, saved: 6600 },
  { category: 'Rice & Grains', current: 36000, optimized: 30400, saved: 5600 },
  { category: 'Fresh Produce', current: 42000, optimized: 34700, saved: 7300 },
];

export function SavingsSection() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 62500;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 xl:px-16 w-full max-w-[1560px] mx-auto">
      <SectionHeading
        badge="Direct Bottom-Line ROI"
        title="Predictable kitchen profits"
        serifAccent="verified on every receipt"
        subtitle="See how switching 5 core staples to verified mandi partners saves Dawat-e-Khaas ₹62,500 every single month."
        align="center"
        className="mb-12 md:mb-16"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Receipt-Style "Monthly Savings Bill" Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5 bg-white border border-[#E0D1B8] rounded-[24px] p-6 sm:p-7 shadow-warm-lg relative flex flex-col justify-between font-mono text-xs text-[#2C1E14]"
        >
          {/* Jagged / Dotted Top Receipt Header */}
          <div>
            <div className="text-center pb-4 border-b-2 border-dashed border-[#E4D7C0] space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF3ED] text-[#315B42] text-[10px] font-bold uppercase tracking-wider">
                <Receipt className="w-3.5 h-3.5" />
                <span>Verified Audit</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-[#2C1E14]">FOOD MARKET HUB</h3>
              <p className="text-[11px] text-[#8A7662]">Outpost: Connaught Place, New Delhi</p>
              <p className="text-[10px] text-[#A48E75]">Monthly Procurement Cycle: 30 Days</p>
            </div>

            {/* Dotted Leader Line Items */}
            <div className="py-5 space-y-3.5">
              <div className="flex justify-between items-baseline">
                <span className="font-sans font-medium text-[#2C1E14]">Fresh Malai Paneer (240kg)</span>
                <span className="flex-1 border-b border-dotted border-[#D1BF9F] mx-2" />
                <span className="font-bold text-[#315B42] font-mono">-₹13,200</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-sans font-medium text-[#2C1E14]">Chicken Breast Boneless (280kg)</span>
                <span className="flex-1 border-b border-dotted border-[#D1BF9F] mx-2" />
                <span className="font-bold text-[#315B42] font-mono">-₹12,600</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-sans font-medium text-[#2C1E14]">Unsalted White Butter (90kg)</span>
                <span className="flex-1 border-b border-dotted border-[#D1BF9F] mx-2" />
                <span className="font-bold text-[#315B42] font-mono">-₹5,850</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-sans font-medium text-[#2C1E14]">Curry Cut Chicken (220kg)</span>
                <span className="flex-1 border-b border-dotted border-[#D1BF9F] mx-2" />
                <span className="font-bold text-[#315B42] font-mono">-₹7,700</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-sans font-medium text-[#2C1E14]">Produce & Spices (Bulk)</span>
                <span className="flex-1 border-b border-dotted border-[#D1BF9F] mx-2" />
                <span className="font-bold text-[#315B42] font-mono">-₹23,150</span>
              </div>
            </div>
          </div>

          {/* Dotted Total Box */}
          <div className="pt-4 border-t-2 border-dashed border-[#E4D7C0] space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="font-serif uppercase text-[#66523B]">NET MONTHLY SAVINGS</span>
              <span className="text-2xl font-black text-[#315B42] font-mono">
                ₹{count.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#EAF3ED] border border-[#C5DEC9] text-center text-[11px] font-sans font-semibold text-[#315B42]">
              Food cost reduced from 35.8% &rarr; 30.5% (+5.3% Net Margin)
            </div>
          </div>
        </motion.div>

        {/* Before vs After Recharts Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-7 bg-white border border-[#EBE1CF] rounded-[24px] p-6 sm:p-8 shadow-warm flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F1E8D8]">
              <div>
                <h4 className="text-lg font-bold text-[#2C1E14]">Category-Wise Monthly Spend</h4>
                <p className="text-xs text-[#8A7662]">Current Middlemen Invoices vs. Food Market Hub Mandi Routing</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#A48E75]">
                  <span className="w-3 h-3 rounded-sm bg-[#D1BF9F]" /> Before
                </span>
                <span className="flex items-center gap-1.5 text-[#315B42]">
                  <span className="w-3 h-3 rounded-sm bg-[#315B42]" /> With Hub
                </span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="w-full h-72 sm:h-80 pt-4">
              <SavingsBarChart data={SAVINGS_CHART_DATA} />
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1E8D8] flex items-center justify-between text-xs text-[#66523B]">
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#315B42]" /> Based on actual daily APMC Delhi NCR indices
            </span>
            <a href="/app/savings" className="font-bold text-[#315B42] hover:underline">
              Analyze your menu savings &rarr;
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
