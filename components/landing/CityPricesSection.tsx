'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PriceTag } from '@/components/ui/PriceTag';
import { Card } from '@/components/ui/Card';

interface CityRateData {
  id: string;
  name: string;
  state: string;
  x: number; // percentage on SVG map
  y: number;
  paneerPrice: number;
  chickenPrice: number;
  onionPrice: number;
  avgSavingPercent: number;
}

const CITY_BENCHMARKS: CityRateData[] = [
  { id: 'delhi-ncr', name: 'Delhi NCR', state: 'APMC Azadpur & Ghazipur', x: 42, y: 31, paneerPrice: 285, chickenPrice: 235, onionPrice: 31, avgSavingPercent: 14.2 },
  { id: 'mumbai', name: 'Mumbai', state: 'Vashi Turbhe APMC', x: 30, y: 58, paneerPrice: 295, chickenPrice: 245, onionPrice: 29, avgSavingPercent: 13.8 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Yeshwanthpur Wholesale', x: 44, y: 78, paneerPrice: 310, chickenPrice: 220, onionPrice: 34, avgSavingPercent: 15.1 },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Bowenpally Agri Mandi', x: 48, y: 64, paneerPrice: 305, chickenPrice: 230, onionPrice: 32, avgSavingPercent: 12.9 },
  { id: 'chennai', name: 'Chennai', state: 'Koyambedu Wholesale Market', x: 52, y: 82, paneerPrice: 320, chickenPrice: 240, onionPrice: 35, avgSavingPercent: 11.7 },
  { id: 'kolkata', name: 'Kolkata', state: 'Posta Bazar & Mechua', x: 78, y: 48, paneerPrice: 290, chickenPrice: 225, onionPrice: 33, avgSavingPercent: 13.4 },
  { id: 'pune', name: 'Pune', state: 'Gultekdi Market Yard', x: 33, y: 62, paneerPrice: 290, chickenPrice: 235, onionPrice: 27, avgSavingPercent: 12.5 },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Jamalpur APMC', x: 28, y: 46, paneerPrice: 280, chickenPrice: 250, onionPrice: 28, avgSavingPercent: 12.1 },
];

export function CityPricesSection() {
  const [selectedCityId, setSelectedCityId] = useState('delhi-ncr');
  const activeCity = CITY_BENCHMARKS.find((c) => c.id === selectedCityId) || CITY_BENCHMARKS[0];

  return (
    <section id="cities" className="py-16 md:py-24 bg-[#F8F3EA]/70 border-y border-[#EBE1CF] scroll-mt-20">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeading
          badge="Live Mandi Arbitrage"
          title="Daily Wholesale Rates Across"
          serifAccent="India's Culinary Hubs"
          subtitle="Explore live APMC mandi benchmarks in 8 major restaurant cities. Compare real daily spot prices and lock seasonal contracts."
          align="center"
          className="mb-10 md:mb-14"
        />

        {/* Mobile Horizontal Scrolling City Chips */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 no-scrollbar snap-x">
          {CITY_BENCHMARKS.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => setSelectedCityId(city.id)}
              className={`snap-start shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-1.5 ${
                selectedCityId === city.id
                  ? 'bg-[#263D2D] text-white shadow-warm-xs'
                  : 'bg-white border border-[#EBE1CF] text-[#66523B]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{city.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Stylized Illustrated India Map (Inline SVG) */}
          <div className="lg:col-span-7 bg-white border border-[#EBE1CF] rounded-[28px] p-6 sm:p-8 shadow-warm relative overflow-hidden flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A7662] self-start mb-2">
              Interactive Map &bull; Click any city pin
            </span>

            <div className="relative w-full max-w-[420px] aspect-[4/5] mx-auto my-2">
              {/* Simplified Geometric India Outline */}
              <svg viewBox="0 0 400 500" className="w-full h-full" fill="none">
                {/* Soft India Silhouette */}
                <path
                  d="M165 40L210 50L240 80L230 115L270 140L330 140L360 160L380 200L350 215L310 200L290 230L300 280L270 310L230 360L200 440L180 470L170 440L140 370L110 330L90 260L70 230L90 190L130 180L140 140L130 110L165 40Z"
                  fill="#F1E8D8"
                  stroke="#E0D1B8"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Coastal warm shadow line */}
                <path
                  d="M70 230L90 260L110 330L140 370L170 440L180 470"
                  stroke="#315B42"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeOpacity="0.5"
                />
              </svg>

              {/* City Pins placed on SVG via percentage coordinates */}
              {CITY_BENCHMARKS.map((city) => {
                const isSelected = city.id === selectedCityId;
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => setSelectedCityId(city.id)}
                    style={{ left: `${city.x}%`, top: `${city.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20"
                    title={city.name}
                  >
                    <div className="relative flex flex-col items-center">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-125 shadow-warm-xs ${
                          isSelected
                            ? 'bg-[#315B42] text-white ring-4 ring-[#F8C45C]'
                            : 'bg-[#F8C45C] text-[#2C1E14] border border-[#E0D1B8]'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </span>
                      <span
                        className={`hidden sm:block text-[11px] font-bold px-2 py-0.5 rounded-md mt-1 whitespace-nowrap shadow-warm-xs ${
                          isSelected
                            ? 'bg-[#263D2D] text-white'
                            : 'bg-white text-[#2C1E14] border border-[#EBE1CF]'
                        }`}
                      >
                        {city.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* City Live Price Card Panel */}
          <div className="lg:col-span-5 space-y-4">
            <Card variant="golden" className="p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4D7C0]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#315B42]">
                    Selected Mandi Zone
                  </span>
                  <h3 className="text-2xl font-black text-[#2C1E14]">{activeCity.name}</h3>
                  <p className="text-xs text-[#8A7662] mt-0.5">{activeCity.state}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#315B42] bg-[#EAF3ED] px-2.5 py-1 rounded-full border border-[#C5DEC9]">
                    {activeCity.avgSavingPercent}% Avg Savings
                  </span>
                </div>
              </div>

              {/* 3 Sample Updated Ingredient Prices */}
              <div className="space-y-3">
                <div className="p-3.5 bg-cream-50 rounded-2xl border border-[#EBE1CF] flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-[#2C1E14]">Fresh Malai Paneer</h5>
                    <span className="text-xs text-[#8A7662]">Mandi Benchmark</span>
                  </div>
                  <PriceTag amount={activeCity.paneerPrice} originalAmount={340} unit="kg" size="md" showSavings />
                </div>

                <div className="p-3.5 bg-cream-50 rounded-2xl border border-[#EBE1CF] flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-[#2C1E14]">Chicken Breast Boneless</h5>
                    <span className="text-xs text-[#8A7662]">Poultry Wholesalers</span>
                  </div>
                  <PriceTag amount={activeCity.chickenPrice} originalAmount={280} unit="kg" size="md" showSavings />
                </div>

                <div className="p-3.5 bg-cream-50 rounded-2xl border border-[#EBE1CF] flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-[#2C1E14]">Nashik Grade A Red Onion</h5>
                    <span className="text-xs text-[#8A7662]">APMC Direct Mandi</span>
                  </div>
                  <PriceTag amount={activeCity.onionPrice} originalAmount={42} unit="kg" size="md" showSavings />
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/app/city-prices"
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#263D2D] hover:bg-[#1C2E22] text-white text-sm font-semibold transition-all shadow-warm min-h-[44px]"
                >
                  View Full Mandi Index in App &rarr;
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
