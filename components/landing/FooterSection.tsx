'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function FooterSection() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-[#1C2E22] text-white border-t border-[#315B42]/50 pt-16 md:pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        {/* Large Line-Art Market Stall Illustration & Newsletter Callout */}
        <div className="bg-[#263D2D] border border-white/10 rounded-[32px] p-8 sm:p-12 mb-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Market Stall Line Art SVG */}
          <div className="relative w-full max-w-sm flex justify-center lg:justify-start">
            <svg
              viewBox="0 0 280 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-[260px] stroke-[#F8C45C]"
            >
              {/* Canopy Roof with Scallops */}
              <path
                d="M30 60L50 25H230L250 60H30Z"
                fill="#315B42"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M30 60C40 70 50 70 60 60C70 70 80 70 90 60C100 70 110 70 120 60C130 70 140 70 150 60C160 70 170 70 180 60C190 70 200 70 210 60C220 70 230 70 250 60"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Awning Stripes */}
              <path d="M85 25L95 60M140 25V60M195 25L185 60" stroke="#F8C45C" strokeWidth="1.8" />

              {/* Wooden Stall Frame */}
              <path d="M45 60V160M235 60V160M45 110H235" strokeWidth="2.5" strokeLinecap="round" />
              {/* Counter Front */}
              <rect x="50" y="110" width="180" height="50" rx="4" fill="#1C2E22" strokeWidth="2" />
              <path d="M50 125H230M50 140H230M50 155H230" strokeWidth="1.2" strokeOpacity="0.4" />

              {/* Baskets of Vegetables */}
              <path d="M65 100L60 110H95L90 100H65Z" fill="#F8C45C" strokeWidth="1.8" />
              <circle cx="73" cy="95" r="4" fill="#315B42" strokeWidth="1.5" />
              <circle cx="82" cy="94" r="5" fill="#C2410C" strokeWidth="1.5" />

              <path d="M110 98L105 110H145L140 98H110Z" fill="#F8C45C" strokeWidth="1.8" />
              <circle cx="120" cy="92" r="6" fill="#315B42" strokeWidth="1.5" />
              <circle cx="132" cy="94" r="5" fill="#EAF3ED" strokeWidth="1.5" />

              <path d="M160 100L155 110H190L185 100H160Z" fill="#F8C45C" strokeWidth="1.8" />
              <circle cx="170" cy="95" r="5" fill="#F8C45C" strokeWidth="1.5" />
              <circle cx="178" cy="95" r="4.5" fill="#C2410C" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Newsletter Box */}
          <div className="max-w-xl text-center lg:text-left space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F8C45C]">
              Weekly Mandi Market Bulletin
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-sans">
              Get Monday wholesale mandi prices delivered to your inbox
            </h3>
            <p className="text-sm text-white/75 leading-relaxed">
              Join 4,200+ Indian chefs and restaurant managers tracking seasonal price fluctuations, tomato surges, and poultry indices.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#315B42] rounded-xl text-xs font-bold text-[#F8C45C] flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are subscribed to the Monday Mandi Bulletin!</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
                className="flex flex-col sm:flex-row gap-2.5 pt-2"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your chef or restaurant email..."
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#F8C45C] min-w-[260px]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#F8C45C] hover:bg-[#F5B93E] text-[#2C1E14] font-bold text-sm transition-all shadow-warm-xs flex items-center justify-center gap-2 shrink-0 min-h-[44px]"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4 Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14 text-sm">
          {/* Col 1 */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase text-xs tracking-wider">Product</h5>
            <ul className="space-y-2 text-white/70 text-xs sm:text-sm">
              <li>
                <a href="#features" className="hover:text-[#F8C45C] transition-colors">
                  Menu AI Parser
                </a>
              </li>
              <li>
                <a href="#suppliers" className="hover:text-[#F8C45C] transition-colors">
                  Supplier Discovery
                </a>
              </li>
              <li>
                <a href="#cities" className="hover:text-[#F8C45C] transition-colors">
                  City Price Index
                </a>
              </li>
              <li>
                <Link href="/app/savings" className="hover:text-[#F8C45C] transition-colors">
                  Savings Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase text-xs tracking-wider">Kitchen Types</h5>
            <ul className="space-y-2 text-white/70 text-xs sm:text-sm">
              <li>
                <a href="#features" className="hover:text-[#F8C45C] transition-colors">
                  Fine Dining & Casual
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#F8C45C] transition-colors">
                  Cafes & Bakeries
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#F8C45C] transition-colors">
                  Cloud Kitchens & QSRs
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#F8C45C] transition-colors">
                  Franchise Chains
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase text-xs tracking-wider">Mandi Hubs</h5>
            <ul className="space-y-2 text-white/70 text-xs sm:text-sm">
              <li>
                <a href="#cities" className="hover:text-[#F8C45C] transition-colors">
                  Delhi NCR Mandis
                </a>
              </li>
              <li>
                <a href="#cities" className="hover:text-[#F8C45C] transition-colors">
                  Mumbai Vashi APMC
                </a>
              </li>
              <li>
                <a href="#cities" className="hover:text-[#F8C45C] transition-colors">
                  Bengaluru Yeshwanthpur
                </a>
              </li>
              <li>
                <a href="#cities" className="hover:text-[#F8C45C] transition-colors">
                  Hyderabad & Chennai
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase text-xs tracking-wider">Company</h5>
            <ul className="space-y-2 text-white/70 text-xs sm:text-sm">
              <li>
                <Link href="/blog" className="hover:text-[#F8C45C] transition-colors">
                  Culinary Cost Blog
                </Link>
              </li>
              <li>
                <Link href="/styleguide" className="hover:text-[#F8C45C] transition-colors">
                  Design System
                </Link>
              </li>
              <li>
                <Link href="/app/onboarding" className="hover:text-[#F8C45C] transition-colors">
                  Start Free Trial
                </Link>
              </li>
              <li>
                <a href="#suppliers" className="hover:text-[#F8C45C] transition-colors">
                  Supplier Partner Network
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Brand */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-sans">FOOD MARKET HUB</span>
            <span>&bull; Because your cost matters.</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Food Market Hub India Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
