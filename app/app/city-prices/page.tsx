'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Building2,
  TrendingDown,
  TrendingUp,
  Store,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { formatCurrency } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CityId } from '@/types';

// Lazy load chart
const CityComparisonChart = dynamic(() => import('@/components/city/CityComparisonChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 flex items-center justify-center bg-cream-50 rounded-xl animate-pulse text-xs text-[#8A7662]">
      Loading City Price Benchmarks...
    </div>
  ),
});

interface CityDetail {
  id: CityId;
  name: string;
  mandi: string;
  x: number;
  y: number;
  priceIndexVsNational: number; // e.g. -4.2% vs national
  suppliersCount: number;
  rates: Record<string, number>; // ingredient -> price
}

const DETAILED_12_CITIES: CityDetail[] = [
  { id: 'delhi-ncr', name: 'Delhi NCR', mandi: 'Azadpur APMC & Ghazipur', x: 42, y: 31, priceIndexVsNational: -4.8, suppliersCount: 142, rates: { paneer: 285, chicken: 235, butter: 395, rice: 102, onion: 31, tomato: 28 } },
  { id: 'mumbai', name: 'Mumbai', mandi: 'Vashi Turbhe APMC', x: 30, y: 58, priceIndexVsNational: -1.2, suppliersCount: 168, rates: { paneer: 295, chicken: 245, butter: 410, rice: 108, onion: 29, tomato: 32 } },
  { id: 'bengaluru', name: 'Bengaluru', mandi: 'Yeshwanthpur Wholesale', x: 44, y: 78, priceIndexVsNational: -5.4, suppliersCount: 135, rates: { paneer: 310, chicken: 220, butter: 405, rice: 98, onion: 34, tomato: 26 } },
  { id: 'hyderabad', name: 'Hyderabad', mandi: 'Bowenpally Agri Mandi', x: 48, y: 64, priceIndexVsNational: -3.8, suppliersCount: 112, rates: { paneer: 305, chicken: 230, butter: 412, rice: 100, onion: 32, tomato: 27 } },
  { id: 'chennai', name: 'Chennai', mandi: 'Koyambedu Wholesale Market', x: 52, y: 82, priceIndexVsNational: +2.1, suppliersCount: 98, rates: { paneer: 320, chicken: 240, butter: 420, rice: 105, onion: 35, tomato: 30 } },
  { id: 'kolkata', name: 'Kolkata', mandi: 'Posta Bazar & Mechua', x: 78, y: 48, priceIndexVsNational: -3.2, suppliersCount: 104, rates: { paneer: 290, chicken: 225, butter: 400, rice: 95, onion: 33, tomato: 29 } },
  { id: 'pune', name: 'Pune', mandi: 'Gultekdi Market Yard', x: 33, y: 62, priceIndexVsNational: -4.1, suppliersCount: 88, rates: { paneer: 290, chicken: 235, butter: 402, rice: 104, onion: 27, tomato: 28 } },
  { id: 'ahmedabad', name: 'Ahmedabad', mandi: 'Jamalpur APMC', x: 28, y: 46, priceIndexVsNational: -6.0, suppliersCount: 82, rates: { paneer: 280, chicken: 250, butter: 390, rice: 99, onion: 28, tomato: 25 } },
  { id: 'jaipur', name: 'Jaipur', mandi: 'Muhana APMC Mandi', x: 36, y: 38, priceIndexVsNational: -5.1, suppliersCount: 76, rates: { paneer: 282, chicken: 240, butter: 398, rice: 101, onion: 29, tomato: 26 } },
  { id: 'lucknow', name: 'Lucknow', mandi: 'Dubagga Mandi', x: 54, y: 38, priceIndexVsNational: -4.5, suppliersCount: 72, rates: { paneer: 288, chicken: 232, butter: 405, rice: 96, onion: 30, tomato: 27 } },
  { id: 'chandigarh', name: 'Chandigarh', mandi: 'Sector 26 Grain & Veg Mandi', x: 40, y: 24, priceIndexVsNational: -3.5, suppliersCount: 65, rates: { paneer: 280, chicken: 238, butter: 392, rice: 98, onion: 32, tomato: 29 } },
  { id: 'indore', name: 'Indore', mandi: 'Choithram Mandi', x: 38, y: 50, priceIndexVsNational: -5.8, suppliersCount: 59, rates: { paneer: 282, chicken: 242, butter: 395, rice: 97, onion: 26, tomato: 24 } },
];

const COMPARISON_COLORS = ['#315B42', '#F8C45C', '#263D2D', '#D97706'];

export default function CityPricingPage() {
  const isHydrated = useHydrated();
  const { selectedCityId, setCity, getCurrentRestaurant } = useAppStore();
  const currentRestaurant = isHydrated ? getCurrentRestaurant() : null;

  const [compareCities, setCompareCities] = useState<CityId[]>(['delhi-ncr', 'mumbai', 'bengaluru']);
  const [hoveredCity, setHoveredCity] = useState<CityDetail | null>(null);

  const activeCityDetail =
    DETAILED_12_CITIES.find((c) => c.id === selectedCityId) || DETAILED_12_CITIES[0];

  const handleCitySelect = (cId: CityId) => {
    setCity(cId);
    if (!compareCities.includes(cId)) {
      setCompareCities((prev) => [cId, ...prev.slice(0, 3)]);
    }
  };

  const handleToggleCompareCity = (cId: CityId) => {
    if (compareCities.includes(cId)) {
      if (compareCities.length > 2) {
        setCompareCities(compareCities.filter((id) => id !== cId));
      }
    } else {
      if (compareCities.length < 4) {
        setCompareCities([...compareCities, cId]);
      }
    }
  };

  // Top 6 Commodities Comparison Data
  const comparisonData = useMemo(() => {
    const commodities = [
      { key: 'paneer', name: 'Paneer (kg)' },
      { key: 'chicken', name: 'Chicken (kg)' },
      { key: 'butter', name: 'Butter (kg)' },
      { key: 'rice', name: 'Basmati (kg)' },
      { key: 'onion', name: 'Onion (kg)' },
      { key: 'tomato', name: 'Tomato (kg)' },
    ];

    return commodities.map((item) => {
      const row: any = { ingredient: item.name };
      compareCities.forEach((cId) => {
        const city = DETAILED_12_CITIES.find((c) => c.id === cId);
        if (city) {
          row[city.name] = city.rates[item.key] || 100;
        }
      });
      return row;
    });
  }, [compareCities]);

  const activeCompareCityConfigs = useMemo(() => {
    return compareCities.map((cId, idx) => {
      const city = DETAILED_12_CITIES.find((c) => c.id === cId);
      return {
        id: cId,
        name: city?.name || cId,
        color: COMPARISON_COLORS[idx % COMPARISON_COLORS.length],
      };
    });
  }, [compareCities]);

  return (
    <div className="space-y-8 pb-24">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#E4D7C0]">
        <SectionHeading
          badge="National APMC Network"
          title="City Wholesale Price Index"
          serifAccent="& Mandi Benchmarks"
          subtitle={`Interactive price mapping across 12 culinary hubs. Active procurement market: ${activeCityDetail.name}.`}
        />
      </div>

      {/* Mobile Horizontally Scrolling City Chips */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 no-scrollbar snap-x">
        {DETAILED_12_CITIES.map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => handleCitySelect(city.id)}
            className={`snap-start shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center gap-1.5 ${
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

      {/* Interactive India Map & Active City Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Large Illustrated Map Card */}
        <div className="lg:col-span-7 bg-white border border-[#EBE1CF] rounded-[28px] p-6 sm:p-8 shadow-warm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1E8D8]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#315B42]">
                Interactive Geographic Benchmarking
              </span>
              <h3 className="text-lg font-bold text-[#2C1E14]">Click any City Pin to Switch Procurement Zone</h3>
            </div>
            <span className="text-xs font-semibold text-[#8A7662]">12 Cities Live</span>
          </div>

          <div className="relative w-full max-w-[440px] aspect-[4/5] mx-auto my-4">
            <svg viewBox="0 0 400 500" className="w-full h-full" fill="none">
              <path
                d="M165 40L210 50L240 80L230 115L270 140L330 140L360 160L380 200L350 215L310 200L290 230L300 280L270 310L230 360L200 440L180 470L170 440L140 370L110 330L90 260L70 230L90 190L130 180L140 140L130 110L165 40Z"
                fill="#FFF9EF"
                stroke="#E0D1B8"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M70 230L90 260L110 330L140 370L170 440L180 470"
                stroke="#315B42"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
              />
            </svg>

            {/* City Pins */}
            {DETAILED_12_CITIES.map((city) => {
              const isSelected = city.id === selectedCityId;
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCitySelect(city.id)}
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                  style={{ left: `${city.x}%`, top: `${city.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20"
                >
                  <div className="relative flex flex-col items-center">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#315B42] text-white ring-4 ring-[#F8C45C] scale-110 shadow-warm'
                          : 'bg-[#F8C45C] text-[#2C1E14] border border-[#E0D1B8] hover:scale-110'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-warm-xs mt-1 whitespace-nowrap ${
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

          <div className="pt-3 border-t border-[#F1E8D8] flex items-center justify-between text-xs text-[#8A7662]">
            <span>Selected globally sets city for all ingredient searches & POs</span>
            <span className="font-bold text-[#315B42]">Active: {activeCityDetail.name}</span>
          </div>
        </div>

        {/* Right Active City Overview Card */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="golden" className="p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4D7C0]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#315B42]">
                  Active City Market
                </span>
                <h3 className="text-2xl font-black text-[#2C1E14]">{activeCityDetail.name}</h3>
                <p className="text-xs text-[#8A7662] mt-0.5">{activeCityDetail.mandi}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#315B42] bg-[#EAF3ED] px-2.5 py-1 rounded-full border border-[#C5DEC9]">
                  {activeCityDetail.priceIndexVsNational < 0 ? '' : '+'}
                  {activeCityDetail.priceIndexVsNational}% vs Nat. Avg
                </span>
              </div>
            </div>

            {/* Quick Commodity Benchmarks */}
            <div className="space-y-2.5">
              <div className="p-3 bg-cream-50 rounded-xl border border-[#EBE1CF] flex justify-between items-center text-xs">
                <span className="font-bold text-[#2C1E14]">Malai Paneer</span>
                <span className="font-mono font-bold text-[#315B42]">₹{activeCityDetail.rates.paneer}/kg</span>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl border border-[#EBE1CF] flex justify-between items-center text-xs">
                <span className="font-bold text-[#2C1E14]">Boneless Chicken Breast</span>
                <span className="font-mono font-bold text-[#315B42]">₹{activeCityDetail.rates.chicken}/kg</span>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl border border-[#EBE1CF] flex justify-between items-center text-xs">
                <span className="font-bold text-[#2C1E14]">White Cooking Butter</span>
                <span className="font-mono font-bold text-[#315B42]">₹{activeCityDetail.rates.butter}/kg</span>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl border border-[#EBE1CF] flex justify-between items-center text-xs">
                <span className="font-bold text-[#2C1E14]">Aged 1121 Basmati Rice</span>
                <span className="font-mono font-bold text-[#315B42]">₹{activeCityDetail.rates.rice}/kg</span>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl border border-[#EBE1CF] flex justify-between items-center text-xs">
                <span className="font-bold text-[#2C1E14]">Nashik Red Onions</span>
                <span className="font-mono font-bold text-[#315B42]">₹{activeCityDetail.rates.onion}/kg</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => (window.location.href = '/app/suppliers')}
              >
                Browse {activeCityDetail.suppliersCount} Verified Suppliers in {activeCityDetail.name} &rarr;
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Multi-City Comparison Section with Recharts */}
      <div className="bg-white border border-[#EBE1CF] rounded-[28px] p-6 sm:p-8 shadow-warm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1E8D8]">
          <div>
            <h3 className="text-xl font-bold text-[#2C1E14]">Top 6 Commodity Price Comparison</h3>
            <p className="text-xs text-[#8A7662]">
              Select 2 to 4 cities to compare spot wholesale mandi prices.
            </p>
          </div>

          {/* City selector pills */}
          <div className="flex flex-wrap gap-2">
            {DETAILED_12_CITIES.map((c) => {
              const isSelected = compareCities.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleToggleCompareCity(c.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all min-h-[36px] ${
                    isSelected
                      ? 'bg-[#263D2D] text-white shadow-warm-xs'
                      : 'bg-cream-50 text-[#66523B] border border-[#E4D7C0]'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grouped Bar Chart Area */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <CityComparisonChart data={comparisonData} cities={activeCompareCityConfigs} />
        </div>

        {/* Cheapest City Highlights Per Ingredient */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-[#F1E8D8]">
          {[
            { name: 'Paneer', cheapest: 'Ahmedabad (₹280)', note: 'Co-op dairy zone' },
            { name: 'Chicken', cheapest: 'Bengaluru (₹220)', note: 'South poultry belt' },
            { name: 'Butter', cheapest: 'Ahmedabad (₹390)', note: 'Dairy heartland' },
            { name: 'Rice', cheapest: 'Kolkata (₹95)', note: 'East paddy belt' },
            { name: 'Onion', cheapest: 'Indore (₹26)', note: 'Malwa region' },
            { name: 'Tomato', cheapest: 'Indore (₹24)', note: 'Local polyhouse' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-cream-50 rounded-xl border border-[#EBE1CF] text-xs">
              <span className="text-[10px] text-[#8A7662] uppercase font-bold block">{item.name}</span>
              <strong className="text-[#315B42] block mt-0.5">{item.cheapest}</strong>
              <span className="text-[10px] text-[#A48E75]">{item.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Outlet-Wise Sourcing Panel */}
      <div className="bg-white border border-[#EBE1CF] rounded-[28px] p-6 sm:p-8 shadow-warm space-y-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#315B42]">
            Multi-Outlet Arbitrage
          </span>
          <h3 className="text-xl font-bold text-[#2C1E14]">Outlet-Wise Procurement Sourcing</h3>
          <p className="text-xs text-[#8A7662]">
            Compare wholesale raw cost across {currentRestaurant?.name || 'Dawat-e-Khaas'} locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-cream-50 border border-[#EBE1CF] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#66523B]" />
                <h4 className="font-bold text-sm text-[#2C1E14]">Connaught Place Flagship (Delhi NCR)</h4>
              </div>
              <span className="text-xs font-bold text-[#315B42] bg-[#EAF3ED] px-2 py-0.5 rounded">
                Optimal
              </span>
            </div>
            <p className="text-xs text-[#8A7662]">
              Sourcing directly from Azadpur APMC and Ghazipur Mandi. Average monthly procurement: ₹9,80,000.
            </p>
            <div className="p-2.5 bg-white rounded-xl border border-[#E4D7C0] text-xs flex justify-between">
              <span>Monthly Savings Achieved</span>
              <strong className="text-[#315B42]">₹62,500/month</strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-cream-50 border border-[#EBE1CF] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#66523B]" />
                <h4 className="font-bold text-sm text-[#2C1E14]">Cyber Hub Outlet (Gurugram)</h4>
              </div>
              <span className="text-xs font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded">
                +4.2% Variance
              </span>
            </div>
            <p className="text-xs text-[#8A7662]">
              Currently using local Haryana retail distributor for dairy fats (+₹22/kg over Delhi mandi rate).
            </p>
            <div className="p-2.5 bg-white rounded-xl border border-[#E4D7C0] text-xs flex justify-between">
              <span>Potential Additional Savings</span>
              <strong className="text-[#D97706]">₹18,400/month</strong>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FEF6E4] border border-[#F8C45C]/60 flex items-center gap-2.5 text-xs text-[#8C5D08]">
          <Sparkles className="w-4 h-4 shrink-0 text-[#8C5D08]" />
          <span>
            <strong>Hub Tip:</strong> Sourcing Cyber Hub through our pooled Delhi cold chain truck saves an additional ₹18,400/month in distributor markups.
          </span>
        </div>
      </div>
    </div>
  );
}
