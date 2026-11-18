'use client';

import React, { useState } from 'react';
import { AIChatEngine } from '@/components/assistant/AIChatEngine';
import { Sparkles, TrendingDown, HelpCircle, Lightbulb } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';

export default function AssistantPage() {
  const isHydrated = useHydrated();
  const { getCurrentCity, getCurrentRestaurant, getTotalSavingsMonthly } = useAppStore();

  const currentCity = isHydrated ? getCurrentCity() : null;
  const currentRestaurant = isHydrated ? getCurrentRestaurant() : null;
  const monthlySavings = isHydrated ? getTotalSavingsMonthly() : 62500;

  const [externalPrompt, setExternalPrompt] = useState<string>('');

  const samplePrompts = [
    {
      title: 'Find cheapest dairy',
      query: `Who has the cheapest paneer and malai in ${currentCity?.name || 'Delhi'}?`,
    },
    {
      title: 'Cut menu food costs',
      query: 'How can I reduce overall kitchen food costs this month?',
    },
    {
      title: 'Substitute cashews',
      query: 'What is a cheaper substitute for cashew paste in gravies?',
    },
    {
      title: 'Generate fresh grocery slip',
      query: 'Create an optimized weekly shopping list for my dishes',
    },
    {
      title: 'Wholesale mandi tips',
      query: `What are current wholesale mandi trends in ${currentCity?.name || 'Azadpur'}?`,
    },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16">
      {/* 1. HEADER (Styled exactly like Screenshot 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4D7C0]/70 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F8C45C]/20 border border-[#F8C45C]/50 text-[11px] font-semibold text-[#66523B] mb-1.5">
            <Sparkles className="w-3 h-3 text-[#263D2D]" />
            Kitchen Procurement Copilot
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-fraunces text-[#2C1E14] tracking-tight">
            AI Kitchen <span className="font-fraunces italic font-normal text-[#315B42]">Advisor</span>
          </h1>
          <p className="text-xs text-[#66523B] mt-0.5 font-normal">
            Real-time procurement insights tailored for {currentCity?.name || 'Mumbai'} kitchen margins.
          </p>
        </div>

        {/* Savings Snapshot Badge */}
        <div className="bg-white border border-[#E4D7C0] rounded-2xl px-4 py-2 flex items-center gap-3 shadow-xs self-start sm:self-auto">
          <div className="w-8 h-8 rounded-xl bg-[#EAF3ED] text-[#315B42] flex items-center justify-center shrink-0">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#8A7662] block font-medium">Estimated Monthly Gain</span>
            <span className="font-mono font-bold text-sm text-[#315B42]">
              ₹{monthlySavings.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT (Chat on Left, Suggested Inquiries & Capabilities on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Chat window (8 cols) */}
        <div className="lg:col-span-8">
          <AIChatEngine
            externalPrompt={externalPrompt}
            onExternalPromptHandled={() => setExternalPrompt('')}
          />
        </div>

        {/* Side recommendations & tips (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick suggestions panel */}
          <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-[#E4D7C0] shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2C1E14]">
              <Lightbulb className="w-4 h-4 text-[#F8C45C]" />
              Suggested Kitchen Questions
            </div>
            <p className="text-[11px] text-[#66523B] leading-relaxed">
              Tap any inquiry below or type your own question in Hinglish or English:
            </p>
            <div className="space-y-2">
              {samplePrompts.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setExternalPrompt(item.query)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#FFF9EF] border border-[#E4D7C0]/70 hover:border-[#F8C45C] hover:bg-[#FEF6E4] transition-all group"
                >
                  <div className="text-xs font-semibold text-[#2C1E14] group-hover:text-[#315B42]">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#8A7662] mt-0.5 line-clamp-1">
                    &ldquo;{item.query}&rdquo;
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Capabilities highlight */}
          <div className="bg-[#263D2D] text-white rounded-2xl p-4 sm:p-4.5 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F8C45C]">
              <HelpCircle className="w-4 h-4" />
              What Chef Hub Can Do
            </div>
            <ul className="text-xs space-y-2 text-white/85">
              <li className="flex items-start gap-2">
                <span className="text-[#F8C45C] font-bold">•</span>
                Compare quotes across Azadpur, Okhla, and Ghazipur mandis.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F8C45C] font-bold">•</span>
                Suggest culinary recipe substitutions to beat commodity surges.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F8C45C] font-bold">•</span>
                Auto-generate bulk WhatsApp procurement slips for your head chef.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F8C45C] font-bold">•</span>
                Provide food-waste reduction coaching based on logged kitchen spoilage.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
