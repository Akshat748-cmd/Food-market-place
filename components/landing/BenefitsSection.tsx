'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Utensils, Coffee, Cloud } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface BenefitTabContent {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  tagline: string;
  benefits: { title: string; desc: string }[];
}

const BENEFIT_TABS: BenefitTabContent[] = [
  {
    id: 'restaurants',
    label: 'Fine Dining & Casual Dining',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    tagline: 'High-volume dining with complex gravies, marinades & multi-vendor bills.',
    benefits: [
      {
        title: 'Master Recipe Gram Breakdown',
        desc: 'Extract exact dairy, poultry, and spice consumption across 50+ dishes automatically.',
      },
      {
        title: 'Contract Price Locking',
        desc: 'Hedge against onion and tomato seasonal price spikes through APMC forward contracts.',
      },
      {
        title: 'Multi-Outlet Consolidation',
        desc: 'Pool purchasing volumes across all outlets to unlock tier-1 wholesale pricing.',
      },
    ],
  },
  {
    id: 'cafes',
    label: 'Cafes & Bakeries',
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    tagline: 'Precision baking supplies, specialized milks & quick prep items.',
    benefits: [
      {
        title: 'Specialized Dairy Sourcing',
        desc: 'Cut costs by up to 18% on barista milk, unsalted butter, and whipping creams.',
      },
      {
        title: 'Zero Waste Forecasting',
        desc: 'Align daily bakery batches with weekend footfall trends to prevent expired stock.',
      },
      {
        title: 'Packaging & Consumables Wholesale',
        desc: 'Direct manufacturer pricing for Kraft boxes, cups, PLA lids, and branded pouches.',
      },
    ],
  },
  {
    id: 'cloud-kitchens',
    label: 'Cloud Kitchens & QSRs',
    icon: Cloud,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    tagline: 'High-speed delivery operations where every 1% food cost decides viability.',
    benefits: [
      {
        title: 'Real-Time Food Cost Margins',
        desc: 'Instant alerts whenever raw material cost changes erode your aggregator contribution margin.',
      },
      {
        title: 'Daily Auto-Generated POs',
        desc: 'Automatically combine multiple virtual brand orders into a single consolidated mandi run.',
      },
      {
        title: 'Under 5-Minute Setup',
        desc: 'Upload standard CSV food catalogs or aggregator menus to go live the same afternoon.',
      },
    ],
  },
];

export function BenefitsSection() {
  const [activeTabId, setActiveTabId] = useState('restaurants');
  const activeContent = BENEFIT_TABS.find((t) => t.id === activeTabId) || BENEFIT_TABS[0];

  return (
    <section className="py-16 md:py-24 bg-[#F8F3EA]/70 border-y border-[#EBE1CF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Tailored For Your Operating Model"
          title="Engineered specifically for"
          serifAccent="every type of food business"
          subtitle="Whether you run a heritage Mughlai restaurant, a bustling coffee roastery, or an 8-brand cloud kitchen collective."
          align="center"
          className="mb-10 md:mb-12"
        />

        {/* Tab Controls */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-white rounded-2xl border border-[#E0D1B8] shadow-warm-xs overflow-x-auto max-w-full">
            {BENEFIT_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#F8C45C] text-[#2C1E14] shadow-warm-xs'
                      : 'text-[#66523B] hover:text-[#2C1E14]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeContent.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#EBE1CF] rounded-[28px] p-6 sm:p-10 shadow-warm"
          >
            {/* Left Photo */}
            <div className="lg:col-span-5 relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-warm-md">
              <Image
                src={activeContent.image}
                alt={activeContent.label}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                <span className="text-white text-xs font-semibold">{activeContent.tagline}</span>
              </div>
            </div>

            {/* Right 3 Benefits */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#315B42]">Operational Impact</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2C1E14] font-sans mt-1">
                  How {activeContent.label} Profit with Us
                </h3>
              </div>

              <div className="space-y-4">
                {activeContent.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-4 rounded-xl bg-cream-50 border border-[#F1E8D8]">
                    <div className="w-7 h-7 rounded-full bg-[#EAF3ED] text-[#315B42] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#2C1E14]">{b.title}</h4>
                      <p className="text-xs sm:text-sm text-[#66523B] mt-0.5 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
