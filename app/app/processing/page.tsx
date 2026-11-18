'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Loader2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ChevronDown,
  Terminal,
  FastForward,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { Button } from '@/components/ui/Button';
import {
  MenuCardIllustration,
  ChefHatIllustration,
  VegetableBasketIllustration,
  ServingTrayIllustration,
  HeroAvatarIllustration,
} from '@/components/illustrations';

interface Station {
  id: number;
  name: string;
  desc: string;
  illustration: React.ReactNode;
}

export default function AIProcessingPage() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const {
    dishes,
    ingredients,
    getCurrentCity,
    getCurrentRestaurant,
    setProcessingComplete,
  } = useAppStore();

  const currentCity = isHydrated ? getCurrentCity() : null;
  const currentRestaurant = isHydrated ? getCurrentRestaurant() : null;

  // 14 seconds simulation split across 5 stations:
  // 0s-2.5s: Station 1
  // 2.5s-5.5s: Station 2
  // 5.5s-8.5s: Station 3
  // 8.5s-11.5s: Station 4
  // 11.5s-14s: Station 5 -> complete
  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(5);
  const [isComplete, setIsComplete] = useState(false);
  const [logOpenMobile, setLogOpenMobile] = useState(false);

  // Counters
  const [dishCount, setDishCount] = useState(0);
  const [ingCount, setIngCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [savingsCount, setSavingsCount] = useState(0);

  // Dynamic logs
  const [logs, setLogs] = useState<string[]>([]);

  const stations: Station[] = [
    {
      id: 0,
      name: 'Menu Parser',
      desc: 'Scanning layout, headers & dish titles',
      illustration: <MenuCardIllustration size={44} />,
    },
    {
      id: 1,
      name: 'Ingredient Agent',
      desc: 'Extracting portion grams & marinades',
      illustration: <ChefHatIllustration size={44} />,
    },
    {
      id: 2,
      name: 'Normalizer Agent',
      desc: 'Standardizing APMC mandi units & pack sizes',
      illustration: <VegetableBasketIllustration size={44} />,
    },
    {
      id: 3,
      name: 'Sourcing Agent',
      desc: `Benchmarking ${currentCity?.name || 'Delhi'} mandi rates & MOQs`,
      illustration: <ServingTrayIllustration size={44} />,
    },
    {
      id: 4,
      name: 'Savings Advisor',
      desc: 'Auditing margins & compiling savings ledger',
      illustration: <HeroAvatarIllustration size={44} showOnlineDot={false} />,
    },
  ];

  const targetDishes = dishes.length || 10;
  const targetIngredients = 27;
  const targetSuppliers = currentCity?.activeSuppliersCount || 142;
  const targetSavings = 62500;

  // Handle fast skip
  const handleSkip = () => {
    setActiveStationIndex(4);
    setProgressPercent(100);
    setDishCount(targetDishes);
    setIngCount(targetIngredients);
    setSupplierCount(targetSuppliers);
    setSavingsCount(targetSavings);
    setLogs((prev) => [
      ...prev,
      `[Quick Complete] All 5 agents synchronized for ${currentRestaurant?.name || 'Dawat-e-Khaas'}.`,
    ]);
    setIsComplete(true);
    setProcessingComplete(true);
  };

  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = 14000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
      setProgressPercent(pct);

      if (elapsed < 2800) {
        setActiveStationIndex(0);
        setDishCount(Math.min(targetDishes, Math.floor((elapsed / 2800) * targetDishes)));
      } else if (elapsed < 5800) {
        setActiveStationIndex(1);
        setDishCount(targetDishes);
        setIngCount(Math.min(targetIngredients, Math.floor(((elapsed - 2800) / 3000) * targetIngredients)));
      } else if (elapsed < 8800) {
        setActiveStationIndex(2);
        setIngCount(targetIngredients);
      } else if (elapsed < 11800) {
        setActiveStationIndex(3);
        setSupplierCount(Math.min(targetSuppliers, Math.floor(((elapsed - 8800) / 3000) * targetSuppliers)));
      } else if (elapsed < 14000) {
        setActiveStationIndex(4);
        setSupplierCount(targetSuppliers);
        setSavingsCount(Math.min(targetSavings, Math.floor(((elapsed - 11800) / 2200) * targetSavings)));
      } else {
        setActiveStationIndex(4);
        setSavingsCount(targetSavings);
        setIsComplete(true);
        setProcessingComplete(true);
        clearInterval(interval);
      }
    }, 100);

    // Staggered log additions
    const timeouts = [
      setTimeout(() => setLogs((prev) => [...prev, `[Menu Parser] Ingested 10 recipes from ${currentRestaurant?.name || 'Dawat-e-Khaas'}`]), 800),
      setTimeout(() => setLogs((prev) => [...prev, `[Ingredient Agent] Parsed Old Delhi Butter Chicken: 8 core ingredients found`]), 2500),
      setTimeout(() => setLogs((prev) => [...prev, `[Ingredient Agent] Parsed Paneer Tikka Angara: 7 marinade items deconstructed`]), 4000),
      setTimeout(() => setLogs((prev) => [...prev, `[Normalizer Agent] Merged vernacular terms: 'Tamatar' & 'Makkhan' standardized to APMC codes`]), 6500),
      setTimeout(() => setLogs((prev) => [...prev, `[Sourcing Agent] Scanned ${targetSuppliers} vendors in ${currentCity?.name || 'Delhi NCR'} for Malai Paneer & Poultry`]), 9200),
      setTimeout(() => setLogs((prev) => [...prev, `[Savings Advisor] Sourced Verka Mandi Paneer at ₹285/kg (Save ₹13,200/mo)`]), 11000),
      setTimeout(() => setLogs((prev) => [...prev, `[Savings Advisor] Sourced Ghazipur Prime Chicken at ₹235/kg (Save ₹12,600/mo)`]), 12500),
      setTimeout(() => setLogs((prev) => [...prev, `[Final Audit] Net monthly procurement savings locked: ₹62,500/month (-5.3% food cost)`]), 13800),
    ];

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 min-h-screen bg-[#1C2E22] text-white p-4 sm:p-8 lg:p-12 flex flex-col justify-between">
      {/* Top Processing Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F8C45C] text-[#2C1E14] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight">
              AI Kitchen Procurement Engine
            </h1>
            <p className="text-xs text-white/70">
              Autonomous agents analyzing {currentRestaurant?.name || 'Dawat-e-Khaas'} &bull; {currentCity?.name || 'Delhi NCR'} Mandis
            </p>
          </div>
        </div>

        {!isComplete && (
          <button
            type="button"
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#F8C45C] transition-colors"
          >
            <span>Fast Skip</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Center Area: 5 Stations & Progress Ring */}
      <div className="max-w-6xl w-full mx-auto py-8 sm:py-12 space-y-10">
        {/* Progress Ring & Big Status Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-[28px] bg-[#263D2D] border border-white/10">
          <div className="flex items-center gap-5">
            {/* SVG Circular Progress */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#F8C45C"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * progressPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm text-[#F8C45C]">
                {progressPercent}%
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#F8C45C]">Active Agent Pipeline</span>
              <h2 className="text-xl sm:text-2xl font-bold font-sans mt-0.5">
                {isComplete ? 'Procurement Analysis Complete!' : stations[activeStationIndex].name}
              </h2>
              <p className="text-xs text-white/75 mt-0.5">
                {isComplete
                  ? 'All recipes mapped to lowest verified mandi rates.'
                  : stations[activeStationIndex].desc}
              </p>
            </div>
          </div>

          {/* 4 Counter Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-white/60 block uppercase font-bold">Dishes</span>
              <span className="text-xl font-bold text-white font-mono">{dishCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-white/60 block uppercase font-bold">Ingredients</span>
              <span className="text-xl font-bold text-[#F8C45C] font-mono">{ingCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-white/60 block uppercase font-bold">Suppliers</span>
              <span className="text-xl font-bold text-white font-mono">{supplierCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-white/60 block uppercase font-bold">Mo. Savings</span>
              <span className="text-xl font-bold text-[#34D399] font-mono">₹{savingsCount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* 5 Stations Connected Path */}
        <div>
          {/* Desktop Horizontal Connected Path */}
          <div className="hidden lg:grid grid-cols-5 gap-4 relative">
            {stations.map((st, idx) => {
              const isWaiting = idx > activeStationIndex && !isComplete;
              const isWorking = idx === activeStationIndex && !isComplete;
              const isDone = idx < activeStationIndex || isComplete;

              return (
                <div
                  key={st.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col items-center text-center relative ${
                    isWorking
                      ? 'bg-[#263D2D] border-[#F8C45C] ring-2 ring-[#F8C45C]/40 shadow-warm-lg scale-105'
                      : isDone
                      ? 'bg-[#263D2D]/80 border-[#315B42]'
                      : 'bg-white/5 border-white/10 opacity-60'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className="absolute -top-3 right-3">
                    {isDone && (
                      <span className="w-6 h-6 rounded-full bg-[#315B42] text-white flex items-center justify-center text-xs font-bold shadow-warm-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                    {isWorking && (
                      <span className="w-6 h-6 rounded-full bg-[#F8C45C] text-[#2C1E14] flex items-center justify-center text-xs font-bold animate-spin shadow-warm-xs">
                        <Loader2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {isWaiting && (
                      <span className="w-6 h-6 rounded-full bg-white/10 text-white/50 flex items-center justify-center text-[11px] font-bold">
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  <div className="p-2 rounded-xl bg-white/10 mb-3">{st.illustration}</div>
                  <h4 className="text-sm font-bold text-white font-sans">{st.name}</h4>
                  <p className="text-[11px] text-white/70 mt-1 leading-snug">{st.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical Connected Timeline */}
          <div className="lg:hidden space-y-3">
            {stations.map((st, idx) => {
              const isWaiting = idx > activeStationIndex && !isComplete;
              const isWorking = idx === activeStationIndex && !isComplete;
              const isDone = idx < activeStationIndex || isComplete;

              return (
                <div
                  key={st.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    isWorking
                      ? 'bg-[#263D2D] border-[#F8C45C]'
                      : isDone
                      ? 'bg-[#263D2D]/60 border-[#315B42]'
                      : 'bg-white/5 border-white/10 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-lg bg-white/10 shrink-0">{st.illustration}</div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{st.name}</h4>
                      <p className="text-[11px] text-white/70">{st.desc}</p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isDone && (
                      <span className="w-6 h-6 rounded-full bg-[#315B42] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                    {isWorking && (
                      <span className="w-6 h-6 rounded-full bg-[#F8C45C] text-[#2C1E14] flex items-center justify-center animate-spin">
                        <Loader2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {isWaiting && (
                      <span className="w-6 h-6 rounded-full bg-white/10 text-white/50 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Processing Terminal Logs */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3 text-white/60">
            <span className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#F8C45C]" />
              <span>Real-Time Culinary Agent Logs</span>
            </span>
            <span className="text-[10px] text-[#34D399] font-bold">LIVE STREAM</span>
          </div>

          <div className="space-y-1.5">
            {logs.map((log, i) => (
              <div key={i} className="text-white/80 leading-relaxed">
                <span className="text-[#F8C45C] mr-2">&gt;</span>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Celebratory Summary Card (Framer entrance on completion) */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-r from-[#263D2D] to-[#315B42] border-2 border-[#F8C45C] text-center space-y-4 shadow-warm-xl"
          >
            <div className="w-14 h-14 rounded-full bg-[#F8C45C] text-[#2C1E14] flex items-center justify-center mx-auto shadow-warm-xs">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1 max-w-lg mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F8C45C]">
                Ready for Kitchen Procurement
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-sans">
                ₹62,500 Monthly Savings Identified!
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                We mapped all 10 dishes to verified mandi suppliers across {currentCity?.name || 'Delhi NCR'}.
                Your raw ingredient ledger and supplier price comparisons are ready to review.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => router.push('/app/menu?view=ingredients')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                See My Ingredients & Mandi Rates &rarr;
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer reassurance */}
      <div className="max-w-6xl w-full mx-auto text-center pt-4 border-t border-white/10 text-xs text-white/60">
        <span>Food Market Hub Culinary Engine &bull; Benchmarked daily against APMC Wholesale Indices</span>
      </div>
    </div>
  );
}
