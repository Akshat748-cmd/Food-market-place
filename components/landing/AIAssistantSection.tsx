'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, ChefHat } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { HeroAvatarIllustration } from '@/components/illustrations';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

const PRESET_CONVERSATIONS: Record<string, { user: string; reply: string }> = {
  paneer: {
    user: 'Where can I get the cheapest fresh malai paneer in Delhi today?',
    reply:
      'Verka Mandi Dairy Wholesaler in Okhla has Grade A+ Malai Paneer at ₹285/kg (MOQ 10kg, delivered 6:00 AM). That is ₹55/kg cheaper than your current dairy invoice, saving you ₹13,200/month!',
  },
  cost: {
    user: 'How can I reduce Butter Chicken portion cost without changing taste?',
    reply:
      'By replacing your current retail cream with ProFood 25% cooking cream (save ₹35/L) and sourcing direct Ghazipur chicken breast (save ₹45/kg), raw portion cost drops from ₹142 to ₹118. Margins improve by 16.9%!',
  },
  cashew: {
    user: 'Cashew prices spiked. What substitute works for Shahi Gravy?',
    reply:
      'Try blending 60% Magaz (watermelon melon seeds at ₹180/kg) with 40% Kaju Tukda JK (₹610/kg). The emulsion matches the rich velvety mouthfeel and cuts your nut-base spend by 52%.',
  },
  shopping: {
    user: 'Make my Monday morning procurement shopping list.',
    reply:
      'Drafted! 60kg Paneer (Verka), 70kg Boneless Chicken (Ghazipur), 15L Desi Ghee (Khyber), and 155kg Salad Veg (Azadpur APMC). Total PO: ₹46,230. Ready to dispatch via WhatsApp.',
  },
};

export function AIAssistantSection() {
  const [activePreset, setActivePreset] = useState<string>('paneer');
  const [typedReply, setTypedReply] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    const fullText = PRESET_CONVERSATIONS[activePreset].reply;
    setTypedReply('');
    setIsTyping(true);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setTypedReply(fullText.slice(0, idx));
      if (idx >= fullText.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [activePreset]);

  return (
    <section className="py-16 md:py-24 bg-[#FFF9EF] px-4 sm:px-8 lg:px-12 xl:px-16 w-full max-w-[1560px] mx-auto">
      <SectionHeading
        badge="Culinary Intelligence Agent"
        title="Meet your 24/7 AI Kitchen Copilot"
        serifAccent="that knows every mandi price"
        subtitle="Ask questions in plain English or Hinglish. Formulate recipe portion substitutes, audit vendor invoices, and generate instant supplier POs."
        align="center"
        className="mb-12 md:mb-16"
      />

      <div className="max-w-3xl mx-auto bg-white border-2 border-[#F8C45C]/60 rounded-[28px] shadow-warm-xl overflow-hidden">
        {/* Chat Window Header */}
        <div className="bg-[#263D2D] p-4 sm:p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <HeroAvatarIllustration size={46} showOnlineDot={true} />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm sm:text-base font-sans">FMH Chef Copilot</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#315B42] text-[#F8C45C]">
                  Live Agent
                </span>
              </div>
              <p className="text-[11px] text-white/75">Trained on 12 APMC Mandis & 60+ Food Categories</p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-xs text-[#F8C45C] font-semibold">
            Setup in 5 minutes &bull; Instant Answers
          </span>
        </div>

        {/* Quick Action Prompt Buttons */}
        <div className="p-3 sm:p-4 bg-cream-50 border-b border-[#EBE1CF] flex gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActivePreset('paneer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[36px] ${
              activePreset === 'paneer'
                ? 'bg-[#F8C45C] text-[#2C1E14] shadow-warm-xs'
                : 'bg-white border border-[#E0D1B8] text-[#66523B]'
            }`}
          >
            🧀 Cheapest paneer
          </button>
          <button
            type="button"
            onClick={() => setActivePreset('cost')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[36px] ${
              activePreset === 'cost'
                ? 'bg-[#F8C45C] text-[#2C1E14] shadow-warm-xs'
                : 'bg-white border border-[#E0D1B8] text-[#66523B]'
            }`}
          >
            📉 Reduce food cost
          </button>
          <button
            type="button"
            onClick={() => setActivePreset('cashew')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[36px] ${
              activePreset === 'cashew'
                ? 'bg-[#F8C45C] text-[#2C1E14] shadow-warm-xs'
                : 'bg-white border border-[#E0D1B8] text-[#66523B]'
            }`}
          >
            🥜 Substitute cashew
          </button>
          <button
            type="button"
            onClick={() => setActivePreset('shopping')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[36px] ${
              activePreset === 'shopping'
                ? 'bg-[#F8C45C] text-[#2C1E14] shadow-warm-xs'
                : 'bg-white border border-[#E0D1B8] text-[#66523B]'
            }`}
          >
            📋 Make shopping list
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="p-5 sm:p-7 space-y-5 bg-[#FFFCF7] min-h-[260px]">
          {/* User Message Bubble */}
          <div className="flex justify-end">
            <div className="max-w-[85%] sm:max-w-[75%] bg-[#263D2D] text-white rounded-2xl rounded-tr-sm p-4 text-xs sm:text-sm font-sans shadow-warm-xs leading-relaxed">
              {PRESET_CONVERSATIONS[activePreset].user}
              <span className="block text-[10px] text-white/60 text-right mt-1">Just now</span>
            </div>
          </div>

          {/* Assistant Message Bubble with Avatar & Typing */}
          <div className="flex items-start gap-3">
            <HeroAvatarIllustration size={36} showOnlineDot={false} className="shrink-0 mt-1" />
            <div className="max-w-[90%] sm:max-w-[85%] bg-white border border-[#E4D7C0] rounded-2xl rounded-tl-sm p-4 text-xs sm:text-sm font-sans text-[#2C1E14] shadow-warm-xs leading-relaxed">
              <span className="text-[11px] font-bold text-[#315B42] block mb-1">FMH Copilot</span>
              <p className="whitespace-pre-wrap">{typedReply}</p>
              {isTyping && <span className="inline-block w-1.5 h-3.5 bg-[#F8C45C] ml-1 animate-pulse" />}
              <span className="block text-[10px] text-[#A48E75] text-right mt-1.5">Mandi rates verified</span>
            </div>
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#EBE1CF] flex items-center gap-2">
          <input
            type="text"
            readOnly
            value="Ask anything about recipe portion costs or mandi rates..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-cream-50 border border-[#E4D7C0] text-xs sm:text-sm text-[#8A7662] cursor-not-allowed focus:outline-none"
          />
          <button
            type="button"
            onClick={() => (window.location.href = '/app/assistant')}
            className="px-4 py-2.5 rounded-xl bg-[#F8C45C] hover:bg-[#F5B93E] text-[#2C1E14] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-warm-xs min-h-[44px]"
          >
            <span>Try Live</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
