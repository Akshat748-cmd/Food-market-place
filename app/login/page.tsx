'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Store,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Building2,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { Button } from '@/components/ui/Button';
import { MascotFace } from '@/components/illustrations/MascotFace';

export default function LoginPage() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const { restaurants, login } = useAppStore();

  const [selectedRestId, setSelectedRestId] = useState('rest-delhi-01');
  const [email, setEmail] = useState('owner@delhihaveli.in');
  const [password, setPassword] = useState('mandi123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Quick switch between demo restaurant profiles
  const handleQuickSelect = (restId: string) => {
    setSelectedRestId(restId);
    const target = restaurants.find((r) => r.id === restId);
    if (target) {
      setEmail(`owner@${target.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(selectedRestId, email);
      setIsLoading(false);
      setSuccessToast(true);

      setTimeout(() => {
        router.push('/app/menu');
      }, 600);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FFF9EF] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F8C45C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#315B42]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header with Brand */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E4D7C0] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <MascotFace emotion="happy" size={28} />
          </div>
          <div>
            <span className="font-fraunces font-bold text-base text-[#2C1E14] tracking-tight block">
              FOOD MARKET HUB
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#315B42]">
              Restaurant Operating System
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-[#66523B] hover:text-[#2C1E14] transition-colors"
        >
          &larr; Back to Home
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-xl mx-auto w-full bg-white border border-[#E4D7C0] rounded-3xl p-6 sm:p-8 shadow-warm-lg space-y-6 relative z-10">
        {/* Title */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3ED] border border-[#315B42]/20 text-[#315B42] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Restaurant Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-fraunces text-[#2C1E14]">
            Restaurant Partner Login
          </h1>
          <p className="text-xs sm:text-sm text-[#66523B]">
            Sign in to manage your kitchen recipes, compare live mandi rates & dispatch purchase orders.
          </p>
        </div>

        {/* 1-Click Fast Demo Login Switcher */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7662] block text-center">
            Select Restaurant Profile (1-Click Demo)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {isHydrated &&
              restaurants.slice(0, 3).map((rest) => {
                const isSelected = selectedRestId === rest.id;
                return (
                  <button
                    key={rest.id}
                    type="button"
                    onClick={() => handleQuickSelect(rest.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-[#FFF9EF] border-[#F8C45C] ring-2 ring-[#F8C45C]/40 shadow-xs'
                        : 'bg-white border-[#E4D7C0] hover:bg-[#F9F5EC] hover:border-[#D1C2A5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-[#315B42]">
                        {rest.cityId === 'mumbai'
                          ? 'Mumbai'
                          : rest.cityId === 'delhi-ncr'
                          ? 'Delhi NCR'
                          : 'Bengaluru'}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#315B42] shrink-0" />
                      )}
                    </div>
                    <div className="font-bold text-xs text-[#2C1E14] truncate">{rest.name}</div>
                    <div className="text-[10px] text-[#8A7662] truncate mt-0.5">{rest.cuisine}</div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Email / ID */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#2C1E14]">
              Restaurant Owner or Chef Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A7662] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@restaurant.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E4D7C0] bg-cream-50/50 text-xs text-[#2C1E14] focus:outline-none focus:border-[#315B42]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#2C1E14]">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Demo Mode: Any password or the default mandi123 works!')}
                className="text-[11px] text-[#315B42] hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A7662] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-[#E4D7C0] bg-cream-50/50 text-xs text-[#2C1E14] focus:outline-none focus:border-[#315B42]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7662] hover:text-[#2C1E14]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#66523B]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#263D2D] rounded"
              />
              <span>Remember this kitchen terminal</span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            variant="primary"
            size="lg"
            type="submit"
            fullWidth
            disabled={isLoading || !email.trim()}
            rightIcon={!isLoading ? <ArrowRight className="w-4 h-4" /> : undefined}
            className="py-3 text-sm font-bold shadow-warm-sm"
          >
            {isLoading ? 'Verifying Kitchen Access...' : 'Sign In to Kitchen Portal'}
          </Button>

          {/* Success Toast Banner */}
          {successToast && (
            <div className="p-2.5 rounded-xl bg-[#EAF3ED] border border-[#315B42]/30 text-center text-xs font-semibold text-[#166534] flex items-center justify-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Login successful! Opening your kitchen workspace...</span>
            </div>
          )}
        </form>

        {/* Divider */}
        <div className="pt-2 border-t border-[#F1E8D8] text-center space-y-2">
          <p className="text-xs text-[#66523B]">
            New restaurant?{' '}
            <Link
              href="/app/onboarding"
              className="font-bold text-[#315B42] hover:underline inline-flex items-center gap-0.5"
            >
              Set up your restaurant menu &rarr;
            </Link>
          </p>
          <div className="text-[11px] text-[#8A7662]">
            Need help? Mandi desk support:{' '}
            <a href="tel:+919811054201" className="font-semibold text-[#2C1E14] hover:underline">
              +91 98110 54201
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center pt-6 text-[11px] text-[#8A7662]">
        &copy; {new Date().getFullYear()} Food Market Hub &bull; Direct Mandi Procurement Engine for Indian Commercial Kitchens.
      </div>
    </div>
  );
}
