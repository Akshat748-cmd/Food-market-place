'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Coffee,
  Cloud,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Search,
  Building2,
  Phone,
  Mail,
  User,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore, OnboardingProfile } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mascot } from '@/components/ui/Mascot';
import { MascotFace } from '@/components/illustrations/MascotFace';
import { Stepper } from '@/components/ui/Stepper';
import { CityId } from '@/types';
import {
  ChefHatIllustration,
  VegetableBasketIllustration,
  ServingTrayIllustration,
  MenuCardIllustration,
} from '@/components/illustrations';

const POPULAR_CITIES: { id: CityId; name: string }[] = [
  { id: 'delhi-ncr', name: 'Delhi NCR' },
  { id: 'mumbai', name: 'Mumbai' },
  { id: 'bengaluru', name: 'Bengaluru' },
  { id: 'hyderabad', name: 'Hyderabad' },
  { id: 'chennai', name: 'Chennai' },
  { id: 'pune', name: 'Pune' },
];

const CUISINE_OPTIONS = [
  { id: 'North Indian', label: 'North Indian & Mughlai', emoji: '🍛' },
  { id: 'South Indian', label: 'South Indian & Coastal', emoji: '🥥' },
  { id: 'Indo-Chinese', label: 'Indo-Chinese & Dimsum', emoji: '🥟' },
  { id: 'Biryani', label: 'Awadhi & Hyderabadi Biryani', emoji: '🍚' },
  { id: 'Cafe & Continental', label: 'Cafe & Bakery', emoji: '☕' },
  { id: 'Fast Food', label: 'Burgers & Wraps', emoji: '🍔' },
  { id: 'Desserts', label: 'Mithai & Desserts', emoji: '🍮' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const { cities, setOnboardingProfile } = useAppStore();

  const [step, setStep] = useState(0);
  const [citySearch, setCitySearch] = useState('');

  // Form state
  const [restaurantName, setRestaurantName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [restaurantType, setRestaurantType] = useState<'dine_in' | 'cafe' | 'cloud_kitchen' | 'chain'>('dine_in');
  const [cityId, setCityId] = useState<CityId>('delhi-ncr');
  const [cuisines, setCuisines] = useState<string[]>(['North Indian']);
  const [outletsCount, setOutletsCount] = useState(1);
  const [monthlyPortions, setMonthlyPortions] = useState(4500);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mascotReaction = [
    { expression: 'neutral' as const, message: "Welcome Chef! Let's register your restaurant profile." },
    { expression: 'thinking' as const, message: "Tell me your format and city so I can tap local APMC mandis." },
    { expression: 'happy' as const, message: "Awesome cuisine choices! I will calibrate exact portion weights." },
    { expression: 'alert' as const, message: "Everything looks set to save ~₹62,500/month. Let's start!" },
  ];

  const handlePreFillSample = () => {
    setRestaurantName('The Urban Tandoor');
    setOwnerName('Aditya Roy');
    setPhone('+91 98201 55667');
    setEmail('aditya@urbantandoor.in');
    setRestaurantType('dine_in');
    setCityId('mumbai');
    setCuisines(['North Indian', 'Biryani']);
    setOutletsCount(1);
    setMonthlyPortions(5200);
    setErrors({});
  };

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!restaurantName.trim()) errs.restaurantName = 'Please enter your restaurant name';
      if (!ownerName.trim()) errs.ownerName = 'Please enter owner or head chef name';
      if (!phone.trim() || phone.length < 8) errs.phone = 'Valid phone number is required';
      if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
    } else if (s === 1) {
      if (!cityId) errs.cityId = 'Please select your primary city';
    } else if (s === 2) {
      if (cuisines.length === 0) errs.cuisines = 'Select at least one primary cuisine';
      if (outletsCount < 1) errs.outletsCount = 'At least 1 outlet required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleFinish();
      }
    }
  };

  const handleFinish = () => {
    const profile: OnboardingProfile = {
      restaurantName,
      ownerName,
      phone,
      email,
      restaurantType,
      cityId,
      cuisines,
      outletsCount,
      monthlyPortions,
    };
    setOnboardingProfile(profile);
    router.push('/app/menu');
  };

  const filteredCities = (isHydrated ? cities : []).filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    c.state.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFF9EF] py-4 sm:py-8 px-3 sm:px-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Top Standalone Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E4D7C0]/80 mb-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#E4D7C0] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <MascotFace emotion="happy" size={26} />
            </div>
            <div>
              <span className="font-fraunces font-bold text-sm sm:text-base text-[#2C1E14] tracking-tight block">
                FOOD MARKET HUB
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#315B42]">
                New Restaurant Partner Registration
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="text-[#8A7662] hidden sm:inline">Already registered?</span>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E4D7C0] text-[#2C1E14] hover:bg-[#F9F5EC] transition-colors"
            >
              Sign In &rarr;
            </Link>
            <Link
              href="/"
              className="text-[#66523B] hover:text-[#2C1E14] transition-colors text-xs"
            >
              &times; Exit
            </Link>
          </div>
        </div>

        {/* Top Banner with Mascot reaction */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E4D7C0]/80">
          <Mascot
            role="assistant"
            expression={mascotReaction[step].expression}
            size={52}
            message={mascotReaction[step].message}
          />
          <button
            type="button"
            onClick={handlePreFillSample}
            className="px-3.5 py-1.5 rounded-xl border border-[#F8C45C] bg-[#FEF6E4] hover:bg-[#FDE9BE] text-[#8C5D08] text-xs font-bold transition-all shadow-warm-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use Sample Details (Urban Tandoor)</span>
          </button>
        </div>

      {/* Progress Stepper */}
      <Stepper
        currentStep={step}
        onStepClick={(s) => {
          if (s < step) setStep(s);
          else if (validateStep(step)) setStep(s);
        }}
        steps={[
          { id: 1, label: 'Owner & Brand' },
          { id: 2, label: 'Format & City' },
          { id: 3, label: 'Cuisine & Scale' },
          { id: 4, label: 'Kitchen Ready' },
        ]}
      />

      {/* Step Form Box */}
      <div className="mt-6 bg-white border border-[#EBE1CF] rounded-[28px] p-6 sm:p-9 shadow-warm-lg relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* STEP 1: Basic Information */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="pb-3 border-b border-[#F1E8D8]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#315B42]">Step 1 of 4</span>
                <h2 className="text-xl sm:text-2xl font-black text-[#2C1E14] font-sans">Restaurant & Contact Details</h2>
                <p className="text-xs text-[#8A7662] mt-0.5">Let’s personalize your kitchen’s mandi procurement ledger.</p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Restaurant / Brand Name"
                  placeholder="e.g. Dawat-e-Khaas"
                  leftIcon={<Building2 className="w-4 h-4" />}
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  error={errors.restaurantName}
                />

                <Input
                  label="Owner / Head Chef Full Name"
                  placeholder="e.g. Vikram Malhotra"
                  leftIcon={<User className="w-4 h-4" />}
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  error={errors.ownerName}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number (WhatsApp POs)"
                    placeholder="+91 98101 22334"
                    leftIcon={<Phone className="w-4 h-4" />}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.phone}
                  />

                  <Input
                    label="Kitchen Management Email"
                    type="email"
                    placeholder="chef@restaurant.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Format & City Selection */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="pb-3 border-b border-[#F1E8D8]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#315B42]">Step 2 of 4</span>
                <h2 className="text-xl sm:text-2xl font-black text-[#2C1E14] font-sans">Select Operating Model & City</h2>
                <p className="text-xs text-[#8A7662] mt-0.5">This connects your kitchen to the nearest APMC wholesale suppliers.</p>
              </div>

              {/* 4 Illustrated Operating Format Cards */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7662] mb-3">
                  Operating Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'dine_in', title: 'Dine-In', icon: Utensils, desc: 'Fine & casual dining' },
                    { id: 'cafe', title: 'Cafe & Bake', icon: Coffee, desc: 'Coffee & bakeries' },
                    { id: 'cloud_kitchen', title: 'Cloud Kitchen', icon: Cloud, desc: 'Delivery brands' },
                    { id: 'chain', title: 'Chain / QSR', icon: Layers, desc: 'Multi-outlet' },
                  ].map((fmt) => {
                    const Icon = fmt.icon;
                    const isSelected = restaurantType === fmt.id;
                    return (
                      <div
                        key={fmt.id}
                        onClick={() => setRestaurantType(fmt.id as any)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                          isSelected
                            ? 'bg-[#FEF6E4] border-[#F8C45C] shadow-warm-xs'
                            : 'bg-white border-[#EBE1CF] hover:border-[#E4D7C0]'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${isSelected ? 'bg-[#F8C45C] text-[#2C1E14]' : 'bg-cream-100 text-[#66523B]'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-[#2C1E14]">{fmt.title}</span>
                        <span className="text-[10px] text-[#8A7662] mt-0.5">{fmt.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7662] mb-2">
                  City Wholesale Mandi Zone
                </label>
                {/* Popular City Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {POPULAR_CITIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCityId(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        cityId === c.id
                          ? 'bg-[#263D2D] text-white shadow-warm-xs'
                          : 'bg-[#F1E8D8] text-[#66523B] hover:bg-[#E8DCB8]'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Input
                    placeholder="Search city mandi..."
                    leftIcon={<Search className="w-4 h-4" />}
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                  />
                  {citySearch && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E4D7C0] rounded-xl shadow-warm-lg max-h-48 overflow-y-auto z-20 p-2">
                      {filteredCities.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setCityId(c.id);
                            setCitySearch('');
                          }}
                          className="p-2 hover:bg-cream-50 rounded-lg cursor-pointer text-xs font-bold text-[#2C1E14] flex justify-between"
                        >
                          <span>{c.name}</span>
                          <span className="text-[#8A7662]">{c.state}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.cityId && <p className="text-xs text-[#C2410C] font-semibold mt-1">{errors.cityId}</p>}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Cuisine & Scale */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="pb-3 border-b border-[#F1E8D8]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#315B42]">Step 3 of 4</span>
                <h2 className="text-xl sm:text-2xl font-black text-[#2C1E14] font-sans">Cuisine Style & Volume Scale</h2>
                <p className="text-xs text-[#8A7662] mt-0.5">Helps the AI portion calculator configure baseline yields.</p>
              </div>

              {/* Cuisine Multi-select Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7662] mb-2.5">
                  Primary Cuisines (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {CUISINE_OPTIONS.map((c) => {
                    const isSelected = cuisines.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) setCuisines(cuisines.filter((item) => item !== c.id));
                          else setCuisines([...cuisines, c.id]);
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                          isSelected
                            ? 'bg-[#315B42] text-white shadow-warm-xs'
                            : 'bg-white border border-[#E0D1B8] text-[#66523B] hover:bg-cream-50'
                        }`}
                      >
                        <span>{c.emoji}</span>
                        <span>{c.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-1 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
                {errors.cuisines && <p className="text-xs text-[#C2410C] font-semibold mt-1">{errors.cuisines}</p>}
              </div>

              {/* Outlets Count Stepper */}
              <div className="p-4 bg-cream-50 rounded-2xl border border-[#F1E8D8] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#2C1E14]">Number of Outlets</h4>
                  <p className="text-xs text-[#8A7662]">Locations ordering from this mandi zone</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOutletsCount(Math.max(1, outletsCount - 1))}
                    className="w-9 h-9 rounded-xl bg-white border border-[#E4D7C0] flex items-center justify-center font-bold text-lg text-[#2C1E14] hover:bg-cream-100"
                  >
                    -
                  </button>
                  <span className="text-base font-black text-[#2C1E14] w-6 text-center">{outletsCount}</span>
                  <button
                    type="button"
                    onClick={() => setOutletsCount(outletsCount + 1)}
                    className="w-9 h-9 rounded-xl bg-white border border-[#E4D7C0] flex items-center justify-center font-bold text-lg text-[#2C1E14] hover:bg-cream-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Monthly Portions Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8A7662]">
                    Estimated Monthly Portions Sold
                  </label>
                  <span className="text-sm font-extrabold text-[#315B42] bg-[#EAF3ED] px-2.5 py-0.5 rounded-lg border border-[#C5DEC9]">
                    {monthlyPortions.toLocaleString('en-IN')} plates
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="500"
                  value={monthlyPortions}
                  onChange={(e) => setMonthlyPortions(Number(e.target.value))}
                  className="w-full accent-[#315B42] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#A48E75]">
                  <span>500 plates</span>
                  <span>10,000 plates</span>
                  <span>25,000+ plates</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Review Summary & Finish */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="pb-3 border-b border-[#F1E8D8]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#315B42]">Step 4 of 4</span>
                <h2 className="text-xl sm:text-2xl font-black text-[#2C1E14] font-sans">Review Kitchen Profile</h2>
                <p className="text-xs text-[#8A7662] mt-0.5">We have calibrated your baseline procurement models.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-cream-50 rounded-2xl border border-[#EBE1CF] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7662]">Restaurant</span>
                  <h4 className="text-base font-bold text-[#2C1E14]">{restaurantName || 'Dawat-e-Khaas'}</h4>
                  <p className="text-xs text-[#66523B]">Chef/Owner: {ownerName || 'Vikram Malhotra'}</p>
                  <p className="text-xs text-[#66523B]">{phone || '+91 98101 22334'}</p>
                </div>

                <div className="p-4 bg-cream-50 rounded-2xl border border-[#EBE1CF] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7662]">Mandi Hub & Scale</span>
                  <h4 className="text-base font-bold text-[#2C1E14]">
                    {cities.find((c) => c.id === cityId)?.name || 'Delhi NCR'}
                  </h4>
                  <p className="text-xs text-[#66523B]">
                    {outletsCount} {outletsCount === 1 ? 'Outlet' : 'Outlets'} &bull; {monthlyPortions.toLocaleString('en-IN')} portions/mo
                  </p>
                  <p className="text-xs text-[#315B42] font-semibold">
                    Cuisines: {cuisines.join(', ') || 'North Indian'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EAF3ED] border border-[#C5DEC9] flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#315B42] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#F8C45C]" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#2C1E14]">Projected Procurement Savings Unlocked</h5>
                  <p className="text-xs text-[#315B42] font-medium">
                    Estimated <strong>₹62,500/month</strong> reduction in raw ingredient spend starting today.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation Buttons (Sticky Safe Area on Mobile) */}
        <div className="mt-8 pt-5 border-t border-[#EBE1CF] flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setStep(step - 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            {step === 3 ? 'Start My Kitchen & Add Menu →' : 'Continue →'}
          </Button>
        </div>
      </div>
    </div>
  </div>
  );
}
