'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter Kitchen',
      description: 'Ideal for independent restaurants, cafes and single cloud kitchens.',
      outlets: '1 Outlet',
      price: billingCycle === 'monthly' ? 999 : 799,
      isPopular: false,
      features: [
        'AI Menu & Recipe Parser (up to 30 dishes)',
        'City Mandi Price Index (1 city)',
        'Cheapest Supplier Directory & Ratings',
        'Export WhatsApp & PDF Purchase Orders',
        'Email Support & Daily Updates',
      ],
      buttonLabel: 'Start Free 14-Day Trial',
      buttonVariant: 'outline' as const,
    },
    {
      id: 'growth',
      name: 'Growth Collective',
      description: 'For busy dining destinations, multi-brand kitchens & expanding cafes.',
      outlets: 'Up to 5 Outlets',
      price: billingCycle === 'monthly' ? 2499 : 1999,
      isPopular: true,
      features: [
        'Unlimited AI Menu & Portion Extraction',
        'Live 12-City Mandi Benchmarking & Alerts',
        'Direct Mandi Partner Price-Lock Contracts',
        '24/7 AI Chef Copilot (Unlimited Queries)',
        'Priority Phone & Dedicated Account Manager',
      ],
      buttonLabel: 'Start Free 14-Day Trial',
      buttonVariant: 'primary' as const,
    },
    {
      id: 'chain',
      name: 'Restaurant Chain',
      description: 'Custom SLA, multi-city pooling, and enterprise procurement integrations.',
      outlets: '6+ Outlets & Franchises',
      price: 'Custom',
      isPopular: false,
      features: [
        'Custom ERP & POS Recipe Synchronization',
        'Central Commissary & Multi-Warehouse Routing',
        'B2B Mandi Forward Hedging Contracts',
        'Custom Ingredient AI Fine-Tuning',
        'Executive Food Cost SLA & 99.9% Uptime',
      ],
      buttonLabel: 'Contact Sales',
      buttonVariant: 'secondary' as const,
    },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-[#F8F3EA]/70 border-y border-[#EBE1CF] scroll-mt-20">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeading
          badge="Simple Transparent Pricing"
          title="Invest less than your savings on"
          serifAccent="a single bag of paneer"
          subtitle="All plans include a 14-day free trial. Setup in 5 minutes with zero hardware or credit card required."
          align="center"
          className="mb-8"
        />

        {/* Monthly vs Yearly Toggle with 20% Off badge */}
        <div className="flex items-center justify-center gap-3 mb-12 sm:mb-16">
          <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-[#2C1E14]' : 'text-[#8A7662]'}`}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-8 bg-[#263D2D] rounded-full p-1 transition-colors relative focus:outline-none"
            aria-label="Toggle annual billing"
          >
            <div
              className={`w-6 h-6 rounded-full bg-[#F8C45C] transition-transform duration-200 ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-semibold flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-[#2C1E14]' : 'text-[#8A7662]'}`}>
            <span>Annual Billing</span>
            <span className="text-xs font-bold text-[#315B42] bg-[#EAF3ED] px-2 py-0.5 rounded-full border border-[#C5DEC9]">
              Save 20%
            </span>
          </span>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-[28px] p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                plan.isPopular
                  ? 'bg-white border-2 border-[#F8C45C] shadow-warm-xl lg:-translate-y-2'
                  : 'bg-white border border-[#EBE1CF] shadow-warm hover:shadow-warm-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#315B42] text-[#F8C45C] px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-warm-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Most Popular Choice</span>
                </div>
              )}

              <div>
                <div className="border-b border-[#F1E8D8] pb-6 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#315B42]">
                    {plan.outlets}
                  </span>
                  <h3 className="text-2xl font-black text-[#2C1E14] mt-1 font-sans">{plan.name}</h3>
                  <p className="text-xs text-[#8A7662] mt-1.5 leading-relaxed">{plan.description}</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    {typeof plan.price === 'number' ? (
                      <>
                        <span className="text-4xl sm:text-5xl font-black text-[#2C1E14] font-sans">
                          ₹{plan.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-[#8A7662] font-medium">/ month</span>
                      </>
                    ) : (
                      <span className="text-4xl sm:text-5xl font-black text-[#2C1E14] font-sans">
                        {plan.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* 5 Checklist Items */}
                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A7662] block mb-2">
                    Included with plan:
                  </span>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#66523B]">
                      <div className="w-5 h-5 rounded-full bg-[#EAF3ED] text-[#315B42] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link href="/register">
                  <Button variant={plan.buttonVariant} size="lg" fullWidth>
                    {plan.buttonLabel}
                  </Button>
                </Link>
                <p className="text-center text-[11px] text-[#A48E75] mt-2.5">
                  14-day free trial &bull; Cancel anytime in 1 click
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
