'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EmptyState } from '@/components/ui/EmptyState';
import { MenuCardIllustration } from '@/components/illustrations';
import { Button } from '@/components/ui/Button';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#2C1E14] pb-20">
      <header className="border-b border-[#E4D7C0] px-4 sm:px-8 py-5 bg-[#FFF9EF]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#66523B] hover:text-[#2C1E14]">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <span className="text-sm font-black tracking-widest text-[#2C1E14] uppercase font-sans">
            FOOD MARKET HUB &bull; BLOG
          </span>
          <Link href="/app">
            <Button variant="primary" size="sm">
              Open App Hub
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-8">
        <SectionHeading
          badge="Culinary Cost Engineering"
          title="The Food Market Hub"
          serifAccent="Journal & Insights"
          subtitle="Articles, APMC mandi analysis, and food-cost reduction playbooks for Indian restaurateurs."
          align="center"
        />

        <EmptyState
          illustration={<MenuCardIllustration size={96} />}
          title="Weekly Mandi Insights Launching Soon"
          description="Our editorial team is writing in-depth guides on hedging onion price volatility, milk fat yield audits, and multi-outlet commissary management."
          actionLabel="Explore City Prices on Hub"
          onAction={() => (window.location.href = '/app/city-prices')}
        />
      </main>
    </div>
  );
}
