'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Truck, ShieldCheck, Clock } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BestPriceBadge } from '@/components/ui/BestPriceBadge';
import { PriceTag } from '@/components/ui/PriceTag';
import { Button } from '@/components/ui/Button';

interface SupplierDemoCard {
  id: string;
  name: string;
  type: string;
  item: string;
  image: string;
  price: number;
  marketPrice: number;
  moq: number;
  unit: string;
  deliveryTime: string;
  deliveryHours: number; // for sorting
  rating: number;
  qualityScore: number;
  isBestPrice: boolean;
  city: string;
}

const INITIAL_SUPPLIERS: SupplierDemoCard[] = [
  {
    id: 's-1',
    name: 'Verka Mandi Dairy Wholesaler',
    type: 'APMC Dairy Wholesaler',
    item: 'Fresh Malai Paneer (Vacuum Pack)',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    price: 285,
    marketPrice: 340,
    moq: 10,
    unit: 'kg',
    deliveryTime: 'Same-day 6:00 AM',
    deliveryHours: 6,
    rating: 4.9,
    qualityScore: 98,
    isBestPrice: true,
    city: 'Delhi NCR',
  },
  {
    id: 's-2',
    name: 'Ghazipur Prime Poultry',
    type: 'Licensed Meat Purveyor',
    item: 'Fresh Chicken Breast Boneless',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    price: 235,
    marketPrice: 280,
    moq: 15,
    unit: 'kg',
    deliveryTime: 'Daily 5:30 AM',
    deliveryHours: 5.5,
    rating: 4.8,
    qualityScore: 96,
    isBestPrice: true,
    city: 'Delhi NCR',
  },
  {
    id: 's-3',
    name: 'Khari Baoli Heritage Spices',
    type: 'Historic Wholesale Mandi',
    item: 'Kashmiri Red Chili (Whole Deggi)',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    price: 410,
    marketPrice: 480,
    moq: 5,
    unit: 'kg',
    deliveryTime: 'Next-day delivery',
    deliveryHours: 24,
    rating: 4.9,
    qualityScore: 99,
    isBestPrice: true,
    city: 'Delhi NCR',
  },
  {
    id: 's-4',
    name: 'Azadpur APMC Direct Farm',
    type: 'APMC Farmer Co-op',
    item: 'Hybrid Salad Tomatoes (Firm Red)',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    price: 28,
    marketPrice: 38,
    moq: 25,
    unit: 'kg',
    deliveryTime: 'Daily 4:00 AM',
    deliveryHours: 4,
    rating: 4.7,
    qualityScore: 92,
    isBestPrice: true,
    city: 'Delhi NCR',
  },
];

export function SupplierDiscoverySection() {
  const [activeFilter, setActiveFilter] = useState<'cheapest' | 'fastest' | 'quality'>('cheapest');

  const sortedSuppliers = [...INITIAL_SUPPLIERS].sort((a, b) => {
    if (activeFilter === 'cheapest') return a.price - b.price;
    if (activeFilter === 'fastest') return a.deliveryHours - b.deliveryHours;
    if (activeFilter === 'quality') return b.qualityScore - a.qualityScore;
    return 0;
  });

  return (
    <section id="suppliers" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
        <SectionHeading
          badge="Verified Wholesale Network"
          title="Direct Mandi & Wholesaler Discovery"
          serifAccent="at transparent rates"
          subtitle="Skip multiple middlemen markups. Connect directly with licensed mandi operators and cold-chain distributors."
        />

        {/* Live Filter Chips */}
        <div className="inline-flex p-1.5 bg-[#F1E8D8] rounded-2xl border border-[#E0D1B8] self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveFilter('cheapest')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
              activeFilter === 'cheapest'
                ? 'bg-[#F8C45C] text-[#2C1E14] shadow-warm-xs'
                : 'text-[#66523B] hover:text-[#2C1E14]'
            }`}
          >
            Cheapest First
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('fastest')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
              activeFilter === 'fastest'
                ? 'bg-[#F8C45C] text-[#2C1E14] shadow-warm-xs'
                : 'text-[#66523B] hover:text-[#2C1E14]'
            }`}
          >
            Fastest Delivery
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('quality')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
              activeFilter === 'quality'
                ? 'bg-[#F8C45C] text-[#2C1E14] shadow-warm-xs'
                : 'text-[#66523B] hover:text-[#2C1E14]'
            }`}
          >
            Highest Quality
          </button>
        </div>
      </div>

      {/* 4 Large Supplier Cards with Layout Animation */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <AnimatePresence>
          {sortedSuppliers.map((supplier) => (
            <motion.div
              layout
              key={supplier.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-[#EBE1CF] hover:border-[#F8C45C] rounded-[24px] overflow-hidden shadow-warm hover:shadow-warm-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Best Price Pill */}
                <div className="relative h-48 w-full overflow-hidden bg-cream-100">
                  <Image
                    src={supplier.image}
                    alt={supplier.item}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <BestPriceBadge variant="solid" savingsPercent={Math.round(((supplier.marketPrice - supplier.price) / supplier.marketPrice) * 100)} />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#F8C45C] fill-[#F8C45C]" />
                    <span>{supplier.rating}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#315B42]">
                      {supplier.type} &bull; {supplier.city}
                    </span>
                    <h4 className="text-base font-bold text-[#2C1E14] line-clamp-1 group-hover:text-[#315B42] transition-colors">
                      {supplier.name}
                    </h4>
                    <p className="text-xs text-[#8A7662] mt-0.5 line-clamp-1">{supplier.item}</p>
                  </div>

                  {/* Price Comparison */}
                  <div className="p-3 bg-cream-50 rounded-xl border border-[#F1E8D8] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8A7662] block leading-none mb-1">Mandi Rate</span>
                      <PriceTag amount={supplier.price} originalAmount={supplier.marketPrice} unit={supplier.unit} size="md" />
                    </div>
                    <span className="text-xs font-bold text-[#315B42] bg-[#EAF3ED] px-2 py-1 rounded-md">
                      Save ₹{supplier.marketPrice - supplier.price}/{supplier.unit}
                    </span>
                  </div>

                  {/* Meta Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#66523B] pt-1 border-t border-[#F1E8D8]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8A7662]" />
                      <span className="truncate">{supplier.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#8A7662]" />
                      <span>MOQ: {supplier.moq} {supplier.unit}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Button variant="outline" size="sm" fullWidth className="group-hover:bg-[#F8C45C] group-hover:border-[#F8C45C] transition-colors">
                  View Supply Terms &rarr;
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
