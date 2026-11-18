'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  Cpu,
  Store,
  TrendingDown,
  PiggyBank,
  Sparkles,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  MenuCardIllustration,
  VegetableBasketIllustration,
  GroceryBagIllustration,
  ServingTrayIllustration,
} from '@/components/illustrations';

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <SectionHeading
        badge="Intelligent Procurement Hub"
        title="Everything your kitchen needs"
        serifAccent="to spend smarter"
        subtitle="Automate tedious price calls, uncover hidden supplier margins, and cut food costs by over 12% across your entire menu."
        align="center"
        className="mb-12 md:mb-16"
      />

      {/* Asymmetrical Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {/* Tile 1: Menu Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-[#EBE1CF] rounded-[24px] p-6 sm:p-7 shadow-warm hover:shadow-warm-md transition-all flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FEF6E4] border border-[#F8C45C]/50 flex items-center justify-center text-[#8C5D08] mb-5">
            <UploadCloud className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7662]">Step 01</span>
            <h3 className="text-xl font-bold text-[#2C1E14] mt-1 mb-2">1-Click Menu Upload</h3>
            <p className="text-sm text-[#66523B] leading-relaxed">
              Upload physical menu cards, PDF catalogs, or point-of-sale exports in seconds.
            </p>
          </div>
          <div className="mt-6 flex justify-center py-2 bg-cream-50 rounded-xl border border-[#F1E8D8]">
            <MenuCardIllustration size={56} />
          </div>
        </motion.div>

        {/* Tile 2: AI Ingredient Extraction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-[#F8C45C]/70 rounded-[24px] p-6 sm:p-7 shadow-warm hover:shadow-warm-md transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#F8C45C]/15 rounded-bl-full pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-[#F8C45C] text-[#2C1E14] flex items-center justify-center mb-5">
            <Cpu className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#315B42]">AI Agent Powered</span>
            <h3 className="text-xl font-bold text-[#2C1E14] mt-1 mb-2">Automated Portion Breakdown</h3>
            <p className="text-sm text-[#66523B] leading-relaxed">
              Proprietary culinary agents parse every dish into raw dairy, meats, produce, and spice grams.
            </p>
          </div>
          <div className="mt-6 p-3 bg-cream-50 rounded-xl border border-[#F1E8D8] text-xs font-mono text-[#66523B] space-y-1">
            <div className="flex justify-between font-bold text-[#2C1E14]">
              <span>Butter Chicken (1 Portion)</span>
              <span>₹142 raw cost</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#8A7662]">
              <span>Boneless Breast: 240g</span>
              <span>White Butter: 45g</span>
            </div>
          </div>
        </motion.div>

        {/* Tile 3: Photo Tile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative rounded-[24px] overflow-hidden min-h-[300px] shadow-warm-md group"
        >
          <Image
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
            alt="Chef plating fine dining food"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C2E22] via-[#263D2D]/60 to-transparent p-6 flex flex-col justify-end text-white">
            <span className="text-xs font-bold text-[#F8C45C] uppercase tracking-wider">Kitchen First</span>
            <h3 className="text-xl font-bold text-white mt-1">Built for Fast-Paced Restaurants</h3>
            <p className="text-xs text-white/80 mt-1">
              Zero complicated ERP training needed. Made for chefs and managers.
            </p>
          </div>
        </motion.div>

        {/* Tile 4: Cheapest Supplier Finder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-[#EBE1CF] rounded-[24px] p-6 sm:p-7 shadow-warm hover:shadow-warm-md transition-all flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3ED] border border-[#C5DEC9] flex items-center justify-center text-[#315B42] mb-5">
            <Store className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7662]">Direct Mandi Sourcing</span>
            <h3 className="text-xl font-bold text-[#2C1E14] mt-1 mb-2">Cheapest Supplier Finder</h3>
            <p className="text-sm text-[#66523B] leading-relaxed">
              Instant price comparisons across APMC mandis, licensed dairy co-ops, and verified wholesalers.
            </p>
          </div>
          <div className="mt-6 flex justify-center py-2 bg-cream-50 rounded-xl border border-[#F1E8D8]">
            <VegetableBasketIllustration size={56} />
          </div>
        </motion.div>

        {/* Tile 5: City-wise Prices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#EBE1CF] rounded-[24px] p-6 sm:p-7 shadow-warm hover:shadow-warm-md transition-all flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] mb-5">
            <TrendingDown className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7662]">12 Culinary Hubs</span>
            <h3 className="text-xl font-bold text-[#2C1E14] mt-1 mb-2">City-Wise Price Intelligence</h3>
            <p className="text-sm text-[#66523B] leading-relaxed">
              Track real-time inflation and price trends across Delhi NCR, Mumbai, Bengaluru, and 9 more cities.
            </p>
          </div>
          <div className="mt-6 flex justify-center py-2 bg-cream-50 rounded-xl border border-[#F1E8D8]">
            <ServingTrayIllustration size={56} />
          </div>
        </motion.div>

        {/* Tile 6: AI Assistant & Savings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-[#263D2D] text-white rounded-[24px] p-6 sm:p-7 shadow-warm-lg hover:shadow-warm-xl transition-all flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#F8C45C] flex items-center justify-center mb-5 border border-white/15">
            <Sparkles className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F8C45C]">24/7 Culinary Copilot</span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">AI Cost Assistant</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Chat in plain English to formulate recipe substitutes, negotiate supplier terms, and audit food waste.
            </p>
          </div>
          <div className="mt-6 p-3 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between text-xs font-semibold">
            <span className="text-[#F8C45C]">Avg. Monthly Savings</span>
            <span className="text-white text-sm font-bold">₹62,500</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
