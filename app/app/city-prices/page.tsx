'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Building2,
  TrendingDown,
  TrendingUp,
  Store,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { CityId } from '@/types';
import { getIngredientIllustration } from '@/lib/ingredientVisuals';

interface CityDetail {
  id: CityId;
  name: string;
  state: string;
  mandi: string;
  mandiTypes: string[];
  x: number; // Percentage coordinate on India map SVG
  y: number;
  priceIndexVsNational: number; // e.g. -4.8% below national avg
  suppliersCount: number;
  dailyTurnoverCr: number;
  rates: {
    name: string;
    category: string;
    price: number;
    unit: string;
    trend: number; // e.g. -2.5%
    nationalAvg: number;
  }[];
}

const ALL_12_CITIES: CityDetail[] = [
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    state: 'Delhi',
    mandi: 'Azadpur APMC, Ghazipur & Okhla',
    mandiTypes: ['Asia’s Largest Fruit & Veg APMC', 'Poultry & Meat Terminal'],
    x: 37,
    y: 28,
    priceIndexVsNational: -4.8,
    suppliersCount: 142,
    dailyTurnoverCr: 48,
    rates: [
      { name: 'Fresh Malai Paneer', category: 'Dairy', price: 285, unit: 'kg', trend: -3.2, nationalAvg: 310 },
      { name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', price: 215, unit: 'kg', trend: +1.5, nationalAvg: 230 },
      { name: 'Nashik Red Onions', category: 'Vegetables', price: 28, unit: 'kg', trend: -8.5, nationalAvg: 33 },
      { name: 'Salad Tomatoes (Hybrid)', category: 'Vegetables', price: 24, unit: 'kg', trend: -12.0, nationalAvg: 29 },
      { name: 'Premium Basmati Rice (1121)', category: 'Grains', price: 98, unit: 'kg', trend: -1.0, nationalAvg: 104 },
      { name: 'Pure Desi Ghee (Tin)', category: 'Oils & Ghee', price: 540, unit: 'kg', trend: 0.0, nationalAvg: 565 },
      { name: 'White Butter (Makhan)', category: 'Dairy', price: 395, unit: 'kg', trend: -2.0, nationalAvg: 415 },
      { name: 'Kashmiri Red Chilli', category: 'Spices', price: 420, unit: 'kg', trend: +2.5, nationalAvg: 440 },
    ],
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    mandi: 'Vashi Turbhe APMC & Dadar Market',
    mandiTypes: ['Western India Agri Hub', 'Seafood Wholesale Sassoon Dock'],
    x: 26,
    y: 56,
    priceIndexVsNational: -1.2,
    suppliersCount: 168,
    dailyTurnoverCr: 62,
    rates: [
      { name: 'Fresh Malai Paneer', category: 'Dairy', price: 295, unit: 'kg', trend: -1.5, nationalAvg: 310 },
      { name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', price: 235, unit: 'kg', trend: +2.0, nationalAvg: 230 },
      { name: 'Nashik Red Onions', category: 'Vegetables', price: 26, unit: 'kg', trend: -10.0, nationalAvg: 33 },
      { name: 'Salad Tomatoes (Hybrid)', category: 'Vegetables', price: 30, unit: 'kg', trend: +4.0, nationalAvg: 29 },
      { name: 'Premium Basmati Rice (1121)', category: 'Grains', price: 105, unit: 'kg', trend: 0.0, nationalAvg: 104 },
      { name: 'Pure Desi Ghee (Tin)', category: 'Oils & Ghee', price: 555, unit: 'kg', trend: +1.2, nationalAvg: 565 },
      { name: 'White Butter (Makhan)', category: 'Dairy', price: 410, unit: 'kg', trend: +0.5, nationalAvg: 415 },
      { name: 'Kashmiri Red Chilli', category: 'Spices', price: 435, unit: 'kg', trend: -1.0, nationalAvg: 440 },
    ],
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    mandi: 'Yeshwanthpur Wholesale & Kalasipalya',
    mandiTypes: ['South India Grain & Pulse Terminal', 'Kolar Tomato Link'],
    x: 41,
    y: 77,
    priceIndexVsNational: -5.4,
    suppliersCount: 135,
    dailyTurnoverCr: 39,
    rates: [
      { name: 'Fresh Malai Paneer', category: 'Dairy', price: 305, unit: 'kg', trend: 0.0, nationalAvg: 310 },
      { name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', price: 210, unit: 'kg', trend: -4.0, nationalAvg: 230 },
      { name: 'Nashik Red Onions', category: 'Vegetables', price: 32, unit: 'kg', trend: -2.0, nationalAvg: 33 },
      { name: 'Salad Tomatoes (Hybrid)', category: 'Vegetables', price: 22, unit: 'kg', trend: -15.0, nationalAvg: 29 },
      { name: 'Premium Basmati Rice (1121)', category: 'Grains', price: 96, unit: 'kg', trend: -2.5, nationalAvg: 104 },
      { name: 'Pure Desi Ghee (Tin)', category: 'Oils & Ghee', price: 545, unit: 'kg', trend: -1.0, nationalAvg: 565 },
      { name: 'White Butter (Makhan)', category: 'Dairy', price: 405, unit: 'kg', trend: -1.5, nationalAvg: 415 },
      { name: 'Kashmiri Red Chilli', category: 'Spices', price: 425, unit: 'kg', trend: 0.0, nationalAvg: 440 },
    ],
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    mandi: 'Bowenpally Agri Mandi & Malakpet',
    mandiTypes: ['Chilli & Rice Heartland', 'Deccan APMC'],
    x: 44,
    y: 63,
    priceIndexVsNational: -3.8,
    suppliersCount: 112,
    dailyTurnoverCr: 34,
    rates: [
      { name: 'Fresh Malai Paneer', category: 'Dairy', price: 300, unit: 'kg', trend: -1.0, nationalAvg: 310 },
      { name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', price: 220, unit: 'kg', trend: +1.0, nationalAvg: 230 },
      { name: 'Nashik Red Onions', category: 'Vegetables', price: 30, unit: 'kg', trend: -4.5, nationalAvg: 33 },
      { name: 'Salad Tomatoes (Hybrid)', category: 'Vegetables', price: 25, unit: 'kg', trend: -5.0, nationalAvg: 29 },
      { name: 'Premium Basmati Rice (1121)', category: 'Grains', price: 98, unit: 'kg', trend: -3.0, nationalAvg: 104 },
      { name: 'Pure Desi Ghee (Tin)', category: 'Oils & Ghee', price: 550, unit: 'kg', trend: 0.0, nationalAvg: 565 },
      { name: 'White Butter (Makhan)', category: 'Dairy', price: 410, unit: 'kg', trend: 0.0, nationalAvg: 415 },
      { name: 'Kashmiri Red Chilli', category: 'Spices', price: 395, unit: 'kg', trend: -6.0, nationalAvg: 440 },
    ],
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    mandi: 'Koyambedu Wholesale Market Complex',
    mandiTypes: ['Asia’s Largest Perishable Goods Market'],
    x: 48,
    y: 81,
    priceIndexVsNational: +2.1,
    suppliersCount: 98,
    dailyTurnoverCr: 32,
    rates: [
      { name: 'Fresh Malai Paneer', category: 'Dairy', price: 318, unit: 'kg', trend: +1.5, nationalAvg: 310 },
      { name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', price: 230, unit: 'kg', trend: 0.0, nationalAvg: 230 },
      { name: 'Nashik Red Onions', category: 'Vegetables', price: 34, unit: 'kg', trend: +2.0, nationalAvg: 33 },
      { name: 'Salad Tomatoes (Hybrid)', category: 'Vegetables', price: 28, unit: 'kg', trend: -2.0, nationalAvg: 29 },
      { name: 'Premium Basmati Rice (1121)', category: 'Grains', price: 102, unit: 'kg', trend: -1.0, nationalAvg: 104 },
      { name: 'Pure Desi Ghee (Tin)', category: 'Oils & Ghee', price: 570, unit: 'kg', trend: +1.5, nationalAvg: 565 },
      { name: 'White Butter (Makhan)', category: 'Dairy', price: 420, unit: 'kg', trend: +1.0, nationalAvg: 415 },
      { name: 'Kashmiri Red Chilli', category: 'Spices', price: 445, unit: 'kg', trend: +2.0, nationalAvg: 440 },
    ],
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    mandi: 'Posta Bazar, Mechua & Koley Market',
    mandiTypes: ['Eastern India Trading Gateway', 'Riverine Fish Terminal'],
    x: 75,
    y: 47,
    priceIndexVsNational: -3.2,
    suppliersCount: 104,
    dailyTurnoverCr: 36,
    rates: [
      { name: 'Fresh Malai Paneer', category: 'Dairy', price: 292, unit: 'kg', trend: -2.0, nationalAvg: 310 },
      { name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', price: 218, unit: 'kg', trend: -1.5, nationalAvg: 230 },
      { name: 'Nashik Red Onions', category: 'Vegetables', price: 31, unit: 'kg', trend: -3.0, nationalAvg: 33 },
      { name: 'Salad Tomatoes (Hybrid)', category: 'Vegetables', price: 27, unit: 'kg', trend: -4.0, nationalAvg: 29 },
      { name: 'Premium Basmati Rice (1121)', category: 'Grains', price: 95, unit: 'kg', trend: -4.0, nationalAvg: 104 },
      { name: 'Pure Desi Ghee (Tin)', category: 'Oils & Ghee', price: 550, unit: 'kg', trend: 0.0, nationalAvg: 565 },
      { name: 'White Butter (Makhan)', category: 'Dairy', price: 400, unit: 'kg', trend: -1.0, nationalAvg: 415 },
      { name: 'Kashmiri Red Chilli', category: 'Spices', price: 430, unit: 'kg', trend: 0.0, nationalAvg: 440 },
    ],
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    mandi: 'Gultekdi Market Yard APMC',
    mandiTypes: ['Western Ghats Fresh Harvest Terminal'],
    x: 29,
    y: 60,
    priceIndexVsNational: -4.1,
    suppliersCount: 88,
    dailyTurnoverCr: 28,
    rates: [
      { name: 'Fresh Malai Paneer', category: 'Dairy', price: 288, unit: 'kg', trend: -2.5, nationalAvg: 310 },
      { name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', price: 228, unit: 'kg', trend: 0.0, nationalAvg: 230 },
      { name: 'Nashik Red Onions', category: 'Vegetables', price: 25, unit: 'kg', trend: -12.0, nationalAvg: 33 },
      { name: 'Salad Tomatoes (Hybrid)', category: 'Vegetables', price: 26, unit: 'kg', trend: -6.0, nationalAvg: 29 },
      { name: 'Premium Basmati Rice (1121)', category: 'Grains', price: 102, unit: 'kg', trend: -1.0, nationalAvg: 104 },
      { name: 'Pure Desi Ghee (Tin)', category: 'Oils & Ghee', price: 545, unit: 'kg', trend: -1.5, nationalAvg: 565 },
      { name: 'White Butter (Makhan)', category: 'Dairy', price: 402, unit: 'kg', trend: -2.0, nationalAvg: 415 },
      { name: 'Kashmiri Red Chilli', category: 'Spices', price: 428, unit: 'kg', trend: -1.0, nationalAvg: 440 },
    ],
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    mandi: 'Jamalpur APMC & Sardar Patel Market',
    mandiTypes: ['Dairy & Edible Oil Benchmark Mandi'],
    x: 24,
    y: 45,
    priceIndexVsNational: -6.0,
    suppliersCount: 82,
    dailyTurnoverCr: 26,
    rates: [
      { name: 'Fresh Malai Paneer', category: 'Dairy', price: 278, unit: 'kg', trend: -4.0, nationalAvg: 310 },
      { name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', price: 240, unit: 'kg', trend: +1.0, nationalAvg: 230 },
      { name: 'Nashik Red Onions', category: 'Vegetables', price: 27, unit: 'kg', trend: -7.0, nationalAvg: 33 },
      { name: 'Salad Tomatoes (Hybrid)', category: 'Vegetables', price: 23, unit: 'kg', trend: -10.0, nationalAvg: 29 },
      { name: 'Premium Basmati Rice (1121)', category: 'Grains', price: 98, unit: 'kg', trend: -2.0, nationalAvg: 104 },
      { name: 'Pure Desi Ghee (Tin)', category: 'Oils & Ghee', price: 530, unit: 'kg', trend: -3.5, nationalAvg: 565 },
      { name: 'White Butter (Makhan)', category: 'Dairy', price: 388, unit: 'kg', trend: -3.0, nationalAvg: 415 },
      { name: 'Kashmiri Red Chilli', category: 'Spices', price: 420, unit: 'kg', trend: -2.0, nationalAvg: 440 },
    ],
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    mandi: 'Muhana Terminal Mandi & Lal Kothi',
    mandiTypes: ['Mustard Oil & Spice Trading Mandi'],
    x: 32,
    y: 36,
    priceIndexVsNational: -5.1,
    suppliersCount: 76,
    dailyTurnoverCr: 24,
    rates: [
      { name: 'Fresh Malai Paneer', category: 'Dairy', price: 280, unit: 'kg', trend: -3.5, nationalAvg: 310 },
      { name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', price: 232, unit: 'kg', trend: 0.0, nationalAvg: 230 },
      { name: 'Nashik Red Onions', category: 'Vegetables', price: 27, unit: 'kg', trend: -8.0, nationalAvg: 33 },
      { name: 'Salad Tomatoes (Hybrid)', category: 'Vegetables', price: 24, unit: 'kg', trend: -8.0, nationalAvg: 29 },
      { name: 'Premium Basmati Rice (1121)', category: 'Grains', price: 99, unit: 'kg', trend: -1.5, nationalAvg: 104 },
      { name: 'Pure Desi Ghee (Tin)', category: 'Oils & Ghee', price: 535, unit: 'kg', trend: -2.5, nationalAvg: 565 },
      { name: 'White Butter (Makhan)', category: 'Dairy', price: 395, unit: 'kg', trend: -2.0, nationalAvg: 415 },
      { name: 'Kashmiri Red Chilli', category: 'Spices', price: 415, unit: 'kg', trend: -4.0, nationalAvg: 440 },
    ],
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    mandi: 'Dubagga Mandi & Naveen Galla Mandi',
    mandiTypes: ['Awadh Agro Trade Center', 'Northern Grain Mandi'],
    x: 50,
    y: 36,
    priceIndexVsNational: -4.5,
    suppliersCount: 72,
    dailyTurnoverCr: 22,
    rates: [
      { name: 'Fresh Malai Paneer', category: 'Dairy', price: 285, unit: 'kg', trend: -2.0, nationalAvg: 310 },
      { name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', price: 225, unit: 'kg', trend: -1.0, nationalAvg: 230 },
      { name: 'Nashik Red Onions', category: 'Vegetables', price: 29, unit: 'kg', trend: -5.0, nationalAvg: 33 },
      { name: 'Salad Tomatoes (Hybrid)', category: 'Vegetables', price: 25, unit: 'kg', trend: -7.0, nationalAvg: 29 },
      { name: 'Premium Basmati Rice (1121)', category: 'Grains', price: 94, unit: 'kg', trend: -4.0, nationalAvg: 104 },
      { name: 'Pure Desi Ghee (Tin)', category: 'Oils & Ghee', price: 545, unit: 'kg', trend: -1.0, nationalAvg: 565 },
      { name: 'White Butter (Makhan)', category: 'Dairy', price: 400, unit: 'kg', trend: -1.5, nationalAvg: 415 },
      { name: 'Kashmiri Red Chilli', category: 'Spices', price: 425, unit: 'kg', trend: 0.0, nationalAvg: 440 },
    ],
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    state: 'Punjab / Haryana',
    mandi: 'Sector 26 Grain & Veg Wholesale Market',
    mandiTypes: ['Dairy & Wheat Capital Mandi'],
    x: 35,
    y: 22,
    priceIndexVsNational: -3.5,
    suppliersCount: 65,
    dailyTurnoverCr: 19,
    rates: [
      { name: 'Fresh Malai Paneer', category: 'Dairy', price: 278, unit: 'kg', trend: -4.5, nationalAvg: 310 },
      { name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', price: 230, unit: 'kg', trend: 0.0, nationalAvg: 230 },
      { name: 'Nashik Red Onions', category: 'Vegetables', price: 30, unit: 'kg', trend: -4.0, nationalAvg: 33 },
      { name: 'Salad Tomatoes (Hybrid)', category: 'Vegetables', price: 26, unit: 'kg', trend: -6.0, nationalAvg: 29 },
      { name: 'Premium Basmati Rice (1121)', category: 'Grains', price: 95, unit: 'kg', trend: -3.0, nationalAvg: 104 },
      { name: 'Pure Desi Ghee (Tin)', category: 'Oils & Ghee', price: 535, unit: 'kg', trend: -2.0, nationalAvg: 565 },
      { name: 'White Butter (Makhan)', category: 'Dairy', price: 390, unit: 'kg', trend: -3.0, nationalAvg: 415 },
      { name: 'Kashmiri Red Chilli', category: 'Spices', price: 430, unit: 'kg', trend: +1.0, nationalAvg: 440 },
    ],
  },
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    mandi: 'Choithram Mandi & Chhavani',
    mandiTypes: ['Central India Soybean, Wheat & Potato Mandi'],
    x: 34,
    y: 48,
    priceIndexVsNational: -5.8,
    suppliersCount: 59,
    dailyTurnoverCr: 21,
    rates: [
      { name: 'Fresh Malai Paneer', category: 'Dairy', price: 280, unit: 'kg', trend: -3.0, nationalAvg: 310 },
      { name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', price: 235, unit: 'kg', trend: +0.5, nationalAvg: 230 },
      { name: 'Nashik Red Onions', category: 'Vegetables', price: 25, unit: 'kg', trend: -11.0, nationalAvg: 33 },
      { name: 'Salad Tomatoes (Hybrid)', category: 'Vegetables', price: 22, unit: 'kg', trend: -12.0, nationalAvg: 29 },
      { name: 'Premium Basmati Rice (1121)', category: 'Grains', price: 96, unit: 'kg', trend: -2.0, nationalAvg: 104 },
      { name: 'Pure Desi Ghee (Tin)', category: 'Oils & Ghee', price: 540, unit: 'kg', trend: -2.0, nationalAvg: 565 },
      { name: 'White Butter (Makhan)', category: 'Dairy', price: 392, unit: 'kg', trend: -2.5, nationalAvg: 415 },
      { name: 'Kashmiri Red Chilli', category: 'Spices', price: 415, unit: 'kg', trend: -3.0, nationalAvg: 440 },
    ],
  },
];

export default function CityPricesPage() {
  const isHydrated = useHydrated();
  const { selectedCityId, setCity } = useAppStore();

  const [activeCityId, setActiveCityId] = useState<CityId>(
    isHydrated && selectedCityId ? selectedCityId : 'delhi-ncr'
  );

  const [showAllCommodities, setShowAllCommodities] = useState(false);
  const [hoveredCityId, setHoveredCityId] = useState<CityId | null>(null);

  const activeCity = useMemo(() => {
    return ALL_12_CITIES.find((c) => c.id === activeCityId) || ALL_12_CITIES[0];
  }, [activeCityId]);

  const displayedRates = useMemo(() => {
    if (showAllCommodities) return activeCity.rates;
    return activeCity.rates.slice(0, 4); // Progressive disclosure
  }, [activeCity, showAllCommodities]);

  const handleSelectCity = (cityId: CityId) => {
    setActiveCityId(cityId);
  };

  const handleSetActiveKitchenCity = (cityId: CityId) => {
    setCity(cityId);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* 1. HEADER (Heading & Subtitle) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E4D7C0]/70 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-fraunces text-[#2C1E14] tracking-tight">
              Explore Wholesale Prices Across India
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EAF3ED] border border-[#315B42]/20 text-[#315B42] text-[11px] font-semibold">
              <Compass className="w-3 h-3 text-[#315B42]" /> 12 Major Mandis
            </span>
          </div>
          <p className="text-xs text-[#66523B] mt-0.5 font-normal">
            Real-time mandi procurement benchmarks and inter-city price differentials across 12 culinary centers.
          </p>
        </div>

        {/* Active City Pill */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-lg bg-white border border-[#E4D7C0] text-xs font-bold text-[#2C1E14] shadow-xs flex items-center gap-1.5 h-8">
            <MapPin className="w-3.5 h-3.5 text-[#315B42]" />
            <span>Viewing: {activeCity.name}</span>
          </div>

          {selectedCityId !== activeCity.id && (
            <button
              type="button"
              onClick={() => handleSetActiveKitchenCity(activeCity.id)}
              className="px-3 py-1 rounded-lg bg-[#F8C45C] hover:bg-[#eab348] text-[#263D2D] text-xs font-bold transition-all shadow-xs h-8"
            >
              Set as Kitchen City
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN LAYOUT: Interactive India Map (Left) + City Detail Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: INTERACTIVE INDIA MAP (7 Cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF8] border border-[#E0D1B8] rounded-2xl p-4 sm:p-5 shadow-warm-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#F1E8D8] pb-3 mb-2">
            <div>
              <h2 className="text-sm font-bold font-fraunces text-[#2C1E14]">
                Interactive Mandi Geospatial Map
              </h2>
              <span className="text-[10px] text-[#8A7662]">
                Click any city pin to view local mandi benchmarks
              </span>
            </div>

            {/* Quick City Switcher Dropdown for small screens */}
            <select
              value={activeCityId}
              onChange={(e) => handleSelectCity(e.target.value as CityId)}
              className="bg-white border border-[#E4D7C0] rounded-lg px-2 py-1 text-xs font-semibold text-[#2C1E14] focus:outline-none"
            >
              {ALL_12_CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.priceIndexVsNational > 0 ? `+${c.priceIndexVsNational}%` : `${c.priceIndexVsNational}%`})
                </option>
              ))}
            </select>
          </div>

          {/* Map Container */}
          <div className="relative w-full aspect-[4/3] max-h-[440px] bg-[#FFF9EF] rounded-xl border border-[#E4D7C0]/60 overflow-hidden flex items-center justify-center p-2 select-none">
            {/* SVG India Map Background Graphic */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full max-w-[420px] max-h-[420px] stroke-[#D6C5A8] stroke-[0.8] fill-[#F6EEDF]"
            >
              {/* Stylized geometric India outline contour */}
              <path
                d="M 33 12 
                   L 42 10 L 46 16 L 40 22 L 44 26 L 52 28 L 60 28 L 72 26 L 78 30 L 82 28 L 92 34 
                   L 88 42 L 80 44 L 75 48 L 74 54 L 66 58 L 56 68 L 50 82 L 46 94 L 40 86 L 34 76 
                   L 28 62 L 22 52 L 20 44 L 24 38 L 28 32 L 32 20 Z"
                className="transition-colors fill-[#F7EFE2] hover:fill-[#F4E9D6]"
              />
              {/* Gujarat Peninsula */}
              <path
                d="M 22 45 Q 14 47 16 52 Q 22 56 26 53 Z"
                className="fill-[#F7EFE2]"
              />
              {/* Southern Coastline curves */}
              <path
                d="M 34 76 Q 42 88 46 94 Q 50 84 52 76"
                fill="none"
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />
            </svg>

            {/* City Interactive Pins */}
            {ALL_12_CITIES.map((c) => {
              const isSelected = c.id === activeCityId;
              const isHovered = c.id === hoveredCityId;

              return (
                <div
                  key={c.id}
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  onMouseEnter={() => setHoveredCityId(c.id)}
                  onMouseLeave={() => setHoveredCityId(null)}
                  onClick={() => handleSelectCity(c.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                >
                  {/* Ping Animation on Selected */}
                  {isSelected && (
                    <span className="absolute -inset-1.5 rounded-full bg-[#315B42]/30 animate-ping pointer-events-none" />
                  )}

                  {/* Pin Circle */}
                  <div
                    className={`relative w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                      isSelected
                        ? 'bg-[#315B42] border-[#F8C45C] scale-125 shadow-md'
                        : isHovered
                        ? 'bg-[#F8C45C] border-[#263D2D] scale-110 shadow-xs'
                        : 'bg-white border-[#315B42] hover:scale-105'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-[#F8C45C]' : 'bg-[#315B42]'
                      }`}
                    />
                  </div>

                  {/* City Label Badge */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 -top-5 sm:-top-6 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold whitespace-nowrap transition-all shadow-xs pointer-events-none ${
                      isSelected
                        ? 'bg-[#263D2D] text-white opacity-100 z-20'
                        : 'bg-white/90 text-[#2C1E14] border border-[#E4D7C0] opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    {c.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer: Quick City Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-2 border-t border-[#F1E8D8]">
            {ALL_12_CITIES.map((c) => {
              const isSelected = c.id === activeCityId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCity(c.id)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#263D2D] text-white shadow-xs'
                      : 'bg-white border border-[#EBE1CF] text-[#66523B] hover:text-[#2C1E14]'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DEDICATED CITY INFORMATION PANEL (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* City Headline & Mandi Card */}
          <div className="bg-white border border-[#E0D1B8] rounded-2xl p-4 sm:p-5 shadow-warm-xs space-y-3">
            <div className="flex items-start justify-between gap-3 border-b border-[#F1E8D8] pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold font-fraunces text-[#2C1E14]">
                    {activeCity.name}
                  </h3>
                  <span className="text-[10px] text-[#8A7662]">({activeCity.state})</span>
                </div>
                <p className="text-xs text-[#315B42] font-semibold mt-0.5">
                  {activeCity.mandi}
                </p>
              </div>

              {/* Price Index comparison badge */}
              <div
                className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                  activeCity.priceIndexVsNational < 0
                    ? 'bg-[#EAF3ED] text-[#166534] border border-[#BBF7D0]'
                    : 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                }`}
              >
                {activeCity.priceIndexVsNational < 0 ? (
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {Math.abs(activeCity.priceIndexVsNational)}% vs National
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{activeCity.priceIndexVsNational}% vs National
                  </span>
                )}
              </div>
            </div>

            {/* Quick Mandi Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FFF9EF] border border-[#E4D7C0]">
                <span className="text-[10px] text-[#8A7662] block">Verified Mandi Suppliers</span>
                <span className="font-mono font-bold text-sm text-[#2C1E14]">
                  {activeCity.suppliersCount} active vendors
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF9EF] border border-[#E4D7C0]">
                <span className="text-[10px] text-[#8A7662] block">Daily Wholesale Volume</span>
                <span className="font-mono font-bold text-sm text-[#315B42]">
                  ~₹{activeCity.dailyTurnoverCr} Cr / day
                </span>
              </div>
            </div>

            {/* Mandi Specialties */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#8A7662] block">
                Mandi Hub Specialization
              </span>
              <div className="flex flex-wrap gap-1">
                {activeCity.mandiTypes.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-[#F1E8D8] text-[#66523B] px-2 py-0.5 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Commodity Prices List (Progressive Disclosure) */}
          <div className="bg-white border border-[#E0D1B8] rounded-2xl p-4 sm:p-5 shadow-warm-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F1E8D8] pb-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C1E14]">
                  Mandi Benchmark Rates
                </h4>
                <span className="text-[10px] text-[#8A7662]">Live spot procurement rates</span>
              </div>
              <span className="text-[10px] text-[#315B42] font-semibold">7-Day Trend</span>
            </div>

            {/* Rate Rows */}
            <div className="divide-y divide-[#F1E8D8] text-xs">
              {displayedRates.map((r, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#FFF9EF] border border-[#E4D7C0] flex items-center justify-center shrink-0">
                      {getIngredientIllustration(r.name, r.category, 18)}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-[#2C1E14] block truncate">
                        {r.name}
                      </span>
                      <span className="text-[10px] text-[#8A7662]">
                        Nat. Avg: ₹{r.nationalAvg}/{r.unit}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-sm text-[#315B42] block">
                      ₹{r.price}/{r.unit}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        r.trend < 0 ? 'text-[#166534]' : 'text-[#C2410C]'
                      }`}
                    >
                      {r.trend < 0 ? `${r.trend}%` : `+${r.trend}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Progressive Disclosure Toggle */}
            <button
              type="button"
              onClick={() => setShowAllCommodities(!showAllCommodities)}
              className="w-full py-1.5 rounded-lg border border-[#E4D7C0] hover:bg-[#FFF9EF] text-xs font-semibold text-[#2C1E14] flex items-center justify-center gap-1 transition-colors"
            >
              <span>{showAllCommodities ? 'Show Key Commodities' : 'View All Commodities'}</span>
              {showAllCommodities ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
