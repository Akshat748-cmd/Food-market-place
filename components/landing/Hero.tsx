'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Check } from 'lucide-react';
import { HeroAvatarIllustration } from '@/components/illustrations';
import { SupplierWaitlistModal } from '@/components/landing/SupplierWaitlistModal';

export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#FFF9EF] text-[#2C1E14] overflow-x-hidden selection:bg-[#F8C45C]/30 flex flex-col justify-between">
      {/* Supplier Waitlist Modal */}
      <SupplierWaitlistModal
        isOpen={supplierModalOpen}
        onClose={() => setSupplierModalOpen(false)}
      />

      {/* ================= LOCKED APPROVED TOP NAV ================= */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Logo Chef Hat Icon */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#66523B]/30 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full stroke-[#66523B]"
            >
              <path
                d="M10 16C8.5 15 8 13 8 11C8 8.5 10 6.5 13 6.5C13.5 6.5 14 6.7 14.5 7C15.2 5.5 16.8 4.5 18.5 4.5C20.8 4.5 22.5 6.2 22.5 8.5C22.5 8.8 22.4 9.1 22.3 9.4C23.9 10 25 11.5 25 13.5C25 15.5 23.5 17 21 17"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <rect
                x="9.5"
                y="17"
                width="13"
                height="6"
                rx="1.5"
                strokeWidth="1.8"
              />
              <path d="M13 17V23M16 17V23M19 17V23" strokeWidth="1.2" />
            </svg>
          </div>
          {/* Brand Name */}
          <div className="flex flex-col leading-none">
            <span className="text-[13px] sm:text-sm font-black tracking-widest text-[#2C1E14] uppercase font-sans">
              FOOD
            </span>
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#66523B] uppercase font-sans">
              MARKET HUB
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-10 text-[15px] font-medium text-[#2C1E14]">
          <a
            href="#features"
            className="hover:text-[#66523B] transition-colors"
          >
            Restaurants
          </a>
          <a
            href="#suppliers"
            className="hover:text-[#66523B] transition-colors"
          >
            Suppliers
          </a>
          <a
            href="#pricing"
            className="hover:text-[#66523B] transition-colors"
          >
            Pricing
          </a>
          <Link
            href="/blog"
            className="hover:text-[#66523B] transition-colors"
          >
            Blog
          </Link>
        </nav>

        {/* Right: Login & CTA Button */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/login"
            className="text-[15px] font-medium text-[#2C1E14] hover:text-[#66523B] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#F8C45C] hover:bg-[#F5B93E] text-[#2C1E14] font-semibold text-[15px] transition-all duration-150 shadow-warm-xs hover:shadow-warm active:scale-95"
          >
            Start Free Trial
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#2C1E14] hover:bg-[#F1E8D8] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Slide-down Nav Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] z-50 bg-[#FFF9EF] border-b border-[#E4D7C0] shadow-warm-lg p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-base font-semibold text-[#2C1E14]">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#F1E8D8]"
            >
              Restaurants
            </a>
            <a
              href="#suppliers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#F1E8D8]"
            >
              Suppliers
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#F1E8D8]"
            >
              Pricing
            </a>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#F1E8D8]"
            >
              Blog
            </Link>
          </nav>
          <div className="pt-4 border-t border-[#E4D7C0] flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 font-semibold text-[#2C1E14] rounded-lg border border-[#E4D7C0] bg-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 font-bold text-[#2C1E14] rounded-xl bg-[#F8C45C] shadow-warm-sm"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}

      {/* ================= LOCKED APPROVED HERO MAIN CONTENT ================= */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 md:pt-6 md:pb-16 text-center flex-1 flex flex-col items-center justify-start">
        {/* Headline */}
        <h1 className="text-[34px] sm:text-[46px] md:text-[58px] lg:text-[66px] font-black tracking-[-0.03em] leading-[1.1] text-[#2C1E14] font-sans max-w-4xl mx-auto">
          Because your <span className="text-[#F8C45C]">cost matters.</span>
        </h1>

        {/* Subtext */}
        <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] md:text-[18px] text-[#66523B] max-w-2xl mx-auto leading-relaxed font-normal">
          Food Market Hub helps F&B businesses to improve profits by over 12% with smart ordering and cost-management data.
        </p>

        {/* Two Golden CTA Buttons */}
        <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto min-w-[170px] px-8 py-3.5 rounded-xl bg-[#F8C45C] hover:bg-[#F5B93E] text-[#2C1E14] font-bold text-base transition-all duration-150 shadow-warm-sm hover:shadow-warm active:scale-95 text-center"
          >
            For Restaurants
          </Link>
          <button
            type="button"
            onClick={() => setSupplierModalOpen(true)}
            className="w-full sm:w-auto min-w-[170px] px-8 py-3.5 rounded-xl bg-[#F8C45C] hover:bg-[#F5B93E] text-[#2C1E14] font-bold text-base transition-all duration-150 shadow-warm-sm hover:shadow-warm active:scale-95 text-center cursor-pointer"
          >
            For Suppliers
          </button>
        </div>

        {/* Green Check with Setup in 5 minutes */}
        <div className="mt-5 sm:mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2C1E14]">
          <span className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center text-white shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
          <span>Setup in 5 minutes</span>
        </div>

        {/* Staggered Trio of Rounded Photos */}
        <div className="mt-10 sm:mt-14 w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-end">
          {/* Photo 1: Lower-Left, Barista with beanie & glasses */}
          <div className="sm:col-span-3 sm:pb-4 flex justify-center sm:justify-start">
            <div className="relative w-full max-w-[240px] sm:max-w-none h-[220px] sm:h-[240px] md:h-[270px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-warm-md border border-[#EBE1CF]/60">
              <Image
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80"
                alt="Smiling barista preparing coffee"
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Photo 2: Tall Center, Female Chef dusting flour / smiling */}
          <div className="sm:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-none h-[300px] sm:h-[380px] md:h-[440px] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-warm-lg border border-[#EBE1CF]/60">
              <Image
                src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=800&q=80"
                alt="Female chef smiling in professional kitchen"
                fill
                sizes="(max-width: 640px) 100vw, 42vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Photo 3: Medium Upper-Right, Chef cooking with flames */}
          <div className="sm:col-span-4 sm:pb-12 flex justify-center sm:justify-end">
            <div className="relative w-full max-w-[260px] sm:max-w-none h-[220px] sm:h-[260px] md:h-[290px] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-warm-md border border-[#EBE1CF]/60">
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
                alt="Chef preparing dish with flames in kitchen"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Illustrated Assistant Avatar at Bottom-Left with Green Dot */}
      <div className="fixed bottom-5 left-5 z-40 sm:bottom-7 sm:left-7">
        <Link
          href="/app/assistant"
          className="block transition-transform duration-200 hover:scale-110 active:scale-95"
          title="Open AI Assistant"
        >
          <HeroAvatarIllustration size={56} showOnlineDot={true} />
        </Link>
      </div>
    </div>
  );
}
