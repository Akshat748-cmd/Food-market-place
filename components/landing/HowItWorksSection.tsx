'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  ChefHatIllustration,
  HeroAvatarIllustration,
  MenuCardIllustration,
  VegetableBasketIllustration,
  ServingTrayIllustration,
} from '@/components/illustrations';

export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      name: 'Menu Parser',
      description: 'Upload your food menu or snap a photo from your mobile phone.',
      illustration: <MenuCardIllustration size={50} />,
    },
    {
      num: '02',
      name: 'Ingredient Agent',
      description: 'Deconstructs every dish into exact portion weights and spices.',
      illustration: <ChefHatIllustration size={50} />,
    },
    {
      num: '03',
      name: 'Normalizer Agent',
      description: 'Standardizes units, pack sizes, and quality grades across mandis.',
      illustration: <VegetableBasketIllustration size={50} />,
    },
    {
      num: '04',
      name: 'Sourcing Agent',
      description: 'Scans city APMCs and vetted wholesalers for rock-bottom rates.',
      illustration: <ServingTrayIllustration size={50} />,
    },
    {
      num: '05',
      name: 'Savings Advisor',
      description: 'Generates ready-to-dispatch POs and tracks ₹62.5k monthly savings.',
      illustration: <HeroAvatarIllustration size={50} showOnlineDot={false} />,
    },
  ];

  return (
    <section id="how" className="py-16 md:py-24 bg-[#F8F3EA]/60 border-y border-[#EBE1CF] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Multi-Agent Orchestration"
          title="From menu upload to supplier savings"
          serifAccent="in five automated steps"
          subtitle="How our specialized AI culinary agents work together behind the scenes to optimize your kitchen procurement."
          align="center"
          className="mb-14 md:mb-20"
        />

        {/* Desktop Connected Horizontal Path (Hidden on Mobile) */}
        <div className="hidden lg:block relative">
          {/* Animated SVG Path connecting the steps */}
          <div className="absolute top-1/2 left-10 right-10 -translate-y-8 h-1 z-0">
            <svg className="w-full h-8 overflow-visible" fill="none">
              <motion.path
                d="M 40 16 H 1100"
                stroke="#F8C45C"
                strokeWidth="3"
                strokeDasharray="6 6"
                initial={{ pathLength: 0, opacity: 0.4 } as any}
                whileInView={{ pathLength: 1, opacity: 1 } as any}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#E4D7C0] group-hover:border-[#F8C45C] shadow-warm flex items-center justify-center mb-5 transition-transform group-hover:-translate-y-1">
                  {step.illustration}
                </div>
                <span className="w-6 h-6 rounded-full bg-[#F8C45C] text-[#2C1E14] text-xs font-black flex items-center justify-center mb-2 shadow-warm-xs">
                  {idx + 1}
                </span>
                <h4 className="text-base font-bold text-[#2C1E14] font-sans mb-1.5">{step.name}</h4>
                <p className="text-xs text-[#66523B] leading-relaxed max-w-[200px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Vertical Connected Timeline (Hidden on Desktop) */}
        <div className="lg:hidden relative pl-6 border-l-2 border-dashed border-[#F8C45C] space-y-8 max-w-md mx-auto">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative bg-white border border-[#EBE1CF] rounded-2xl p-4 shadow-warm-sm"
            >
              {/* Timeline Node Pin */}
              <div className="absolute -left-[35px] top-4 w-7 h-7 rounded-full bg-[#F8C45C] text-[#2C1E14] text-xs font-black flex items-center justify-center shadow-warm-xs ring-4 ring-[#FFF9EF]">
                {idx + 1}
              </div>

              <div className="flex items-center gap-3.5 mb-2">
                <div className="p-1 rounded-xl bg-cream-50 border border-[#F1E8D8] shrink-0">
                  {step.illustration}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7662]">Step {step.num}</span>
                  <h4 className="text-base font-bold text-[#2C1E14]">{step.name}</h4>
                </div>
              </div>
              <p className="text-xs text-[#66523B] leading-relaxed pl-1">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
