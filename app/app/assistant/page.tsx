'use client';

import React from 'react';
import { AIChatEngine } from '@/components/assistant/AIChatEngine';
import { Sparkles, HelpCircle, Lightbulb, TrendingDown, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function AssistantPage() {
  const { getCurrentCity, getTotalSavingsMonthly } = useAppStore();
  const currentCity = getCurrentCity();
  const monthlySavings = getTotalSavingsMonthly();

  const samplePrompts = [
    { title: 'Find cheapest dairy', query: 'Who has the cheapest paneer and malai in Delhi?' },
    { title: 'Cut menu food costs', query: 'How can I reduce overall kitchen food costs this month?' },
    { title: 'Substitute cashews', query: 'What is a cheaper substitute for cashew paste in gravies?' },
    { title: 'Generate fresh grocery slip', query: 'Create an optimized weekly shopping list for my dishes' },
    { title: 'Wholesale mandi tips', query: 'What are current wholesale mandi trends in Azadpur?' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263D2D]/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8C45C]/20 border border-[#F8C45C]/50 text-xs font-semibold text-[#66523B] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#263D2D]" />
            Kitchen Procurement Copilot
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#263D2D] font-outfit">
            AI Kitchen <span className="font-fraunces italic font-normal text-[#315B42]">Advisor</span>
          </h1>
          <p className="text-sm text-[#66523B] mt-1">
            Real-time procurement insights tailored for {currentCity.name} kitchen margins.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#263D2D]/10 p-3 flex items-center gap-4 shadow-sm self-start sm:self-auto">
          <div className="w-10 h-10 rounded-xl bg-[#315B42]/10 flex items-center justify-center text-[#315B42]">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[#66523B]/80 font-medium">Estimated Monthly Gain</div>
            <div className="text-lg font-bold text-[#315B42]">
              ₹{monthlySavings.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chat window */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          <AIChatEngine />
        </div>

        {/* Side recommendations & tips */}
        <div className="lg:col-span-4 order-1 lg:order-2 space-y-4">
          {/* Quick suggestions panel */}
          <div className="bg-white rounded-3xl p-5 border border-[#263D2D]/10 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#263D2D]">
              <Lightbulb className="w-4 h-4 text-[#F8C45C]" />
              Suggested Kitchen Questions
            </div>
            <p className="text-xs text-[#66523B]">
              Tap any inquiry below or type your own question in Hinglish or English:
            </p>
            <div className="space-y-2">
              {samplePrompts.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#FFF9EF] border border-[#263D2D]/5 hover:border-[#F8C45C] transition-colors group cursor-pointer"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Ask Chef Hub"]') as HTMLInputElement;
                    if (input) {
                      input.value = item.query;
                      input.focus();
                    }
                  }}
                >
                  <div className="text-xs font-semibold text-[#263D2D] group-hover:text-[#315B42]">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#66523B]/80 mt-0.5 line-clamp-1">
                    &ldquo;{item.query}&rdquo;
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities highlight */}
          <div className="bg-[#263D2D] text-white rounded-3xl p-5 space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#F8C45C]">
              <HelpCircle className="w-4 h-4" />
              What Chef Hub Can Do
            </div>
            <ul className="text-xs space-y-2 text-white/80">
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
