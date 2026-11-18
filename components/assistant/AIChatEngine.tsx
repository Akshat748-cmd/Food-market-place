'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Send,
  Sparkles,
  ShoppingBag,
  Store,
  Check,
  TrendingDown,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { formatCurrency } from '@/lib/utils';
import { MascotFace } from '@/components/illustrations/MascotFace';
import { Button } from '@/components/ui/Button';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  cardType?: 'supplier' | 'substitution' | 'shopping_list';
  cardData?: any;
  followUps?: string[];
}

interface AIChatEngineProps {
  isModal?: boolean;
  externalPrompt?: string;
  onExternalPromptHandled?: () => void;
}

export function AIChatEngine({
  isModal = false,
  externalPrompt,
  onExternalPromptHandled,
}: AIChatEngineProps) {
  const router = useRouter();
  const isHydrated = useHydrated();
  const {
    getCurrentRestaurant,
    getCurrentCity,
    ingredients,
    suppliers,
    addShoppingItem,
    applySubstitution,
  } = useAppStore();

  const currentRestaurant = isHydrated ? getCurrentRestaurant() : null;
  const currentCity = isHydrated ? getCurrentCity() : null;

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Namaste Chef! I am your AI Copilot for ${currentRestaurant?.name || 'The Urban Tandoor'} in ${currentCity?.name || 'Jaipur'}. How can I help you reduce food costs today?`,
      time: 'Just now',
      followUps: [
        'Where is the cheapest paneer?',
        'How can I reduce Butter Chicken cost?',
      ],
    },
  ]);

  const quickActionChips = [
    { label: 'Find cheapest paneer', prompt: 'Where is the cheapest paneer in my city today?' },
    { label: 'Reduce my food cost', prompt: 'How can I reduce my Butter Chicken cost?' },
    { label: 'Suggest ingredient alternatives', prompt: 'What is a good substitute for cashew in gravy?' },
    { label: 'Create weekly shopping list', prompt: 'Create my Monday morning mandi shopping list' },
    { label: 'Compare suppliers', prompt: 'Who is the highest rated dairy supplier?' },
  ];

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      const container = chatScrollContainerRef.current;
      if (!container) return;
      // Scroll strictly inside the message container - never scroll the whole window/page
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    });
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      scrollToBottom('auto');
      return;
    }
    scrollToBottom('smooth');
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Keyword intent matching in English & Hinglish
    const lower = query.toLowerCase();

    setTimeout(() => {
      let replyText = '';
      let cardType: Message['cardType'] = undefined;
      let cardData: any = undefined;
      let followUps: string[] = ['Check today mandi prices', 'View my shopping list'];

      // 1. Add to shopping list intent
      if (
        (lower.includes('add') || lower.includes('added')) &&
        (lower.includes('shopping') || lower.includes('list') || lower.includes('slip'))
      ) {
        replyText = `✅ Added 60kg Fresh Malai Paneer (₹285/kg from Verka Mandi) to your kitchen Shopping List! Estimated total is ₹17,100, saving ₹3,300 compared to spot retail.`;
        cardType = 'shopping_list';
        cardData = {
          itemsCount: 1,
          totalEst: '₹17,100',
          savingsEst: '₹3,300',
        };
        followUps = ['Open full Shopping List slip', 'Compare with other dairy vendors'];
      }
      // 2. Compare suppliers intent
      else if (lower.includes('compare') || lower.includes('vendors') || lower.includes('highest rated')) {
        replyText = `Mandi price benchmark for Fresh Malai Paneer in ${currentCity?.name || 'Jaipur'}:\n• Verka Mandi Dairy: ₹285/kg (★ 4.9, 6:00 AM delivery)\n• Mother Dairy B2B: ₹298/kg (★ 4.8, 7:30 AM delivery)\n• Local Milk Federation: ₹310/kg (★ 4.7, 9:00 AM delivery)\nVerka Mandi is currently the top-rated with the lowest landed cost.`;
        followUps = ['Add 60kg Paneer to Shopping List', 'Check today mandi prices'];
      }
      // 3. Paneer / Dairy inquiry
      else if (lower.includes('paneer') || lower.includes('dairy') || lower.includes('doodh')) {
        replyText = `Found Grade A+ Fresh Malai Paneer at ₹285/kg from Verka Mandi Dairy Wholesaler in ${currentCity?.name || 'Jaipur'}. It's ₹55/kg cheaper than retail!`;
        cardType = 'supplier';
        cardData = {
          supplierId: 'sup-delhi-02',
          supplierName: 'Verka Mandi Dairy Wholesaler',
          ingredientId: 'ing-paneer-01',
          item: 'Fresh Malai Paneer',
          price: 285,
          unit: 'kg',
          rating: 4.9,
          delivery: 'Same-day 6:00 AM',
          savings: 'Save ₹13,200/month',
        };
        followUps = ['Add 60kg Paneer to Shopping List', 'Compare with other dairy vendors'];
      } else if (lower.includes('cost') || lower.includes('chicken') || lower.includes('butter') || lower.includes('margin')) {
        replyText = `To reduce Butter Chicken food cost from 35.8% to 29.5%, switch to Ghazipur Prime boneless chicken (₹235/kg) and blend cooking cream with high-fat churned butter.`;
        cardType = 'substitution';
        cardData = {
          title: 'Butter Chicken Portion Optimization',
          currentCost: '₹142 / portion',
          newCost: '₹118 / portion',
          savingsPercent: '16.9% food cost reduction',
        };
        followUps = ['Review ingredient yields in My Menu', 'Find cheaper poultry suppliers'];
      } else if (lower.includes('substitute') || lower.includes('kaju') || lower.includes('cashew') || lower.includes('badam')) {
        replyText = `Cashew wholesale prices are ₹610/kg. You can replace 50% with stone-ground Magaz (Watermelon Seeds at ₹180/kg). Taste tests show identical velvet texture!`;
        cardType = 'substitution';
        cardData = {
          title: 'Cashew ➔ Magaz Seed Emulsion',
          currentCost: '₹610 / kg',
          newCost: '₹320 / kg (blended)',
          savingsPercent: 'Save ₹5,450/month',
        };
        followUps = ['Accept and apply to recipes', 'Where to buy bulk Magaz seeds?'];
      } else if (lower.includes('shopping') || lower.includes('list') || lower.includes('po') || lower.includes('order')) {
        replyText = `I have compiled your morning purchase order based on your 10 dishes and weekend portions. Ready to export to WhatsApp!`;
        cardType = 'shopping_list';
        cardData = {
          itemsCount: 5,
          totalEst: '₹46,230',
          savingsEst: '₹9,840',
        };
        followUps = ['Open full Shopping List slip', 'Send PO to Ghazipur Poultry'];
      } else {
        replyText = `Based on live ${currentCity?.name || 'Jaipur'} APMC data, you can save an estimated ₹62,500/month across poultry, paneer, and aged basmati rice. Would you like to review direct mandi suppliers?`;
        followUps = ['Show cheapest suppliers', 'Calculate monthly savings'];
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: 'Just now',
        cardType,
        cardData,
        followUps,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  useEffect(() => {
    if (externalPrompt) {
      handleSendMessage(externalPrompt);
      onExternalPromptHandled?.();
    }
  }, [externalPrompt]);

  return (
    <div className={`flex flex-col bg-white rounded-2xl overflow-hidden border border-[#EBE1CF] shadow-xs ${isModal ? 'h-[490px]' : 'h-[540px] lg:h-[580px]'}`}>
      {/* Quick Action Chips Bar */}
      <div className="p-2.5 px-3 bg-cream-50 border-b border-[#E4D7C0] flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {quickActionChips.map((chip, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(chip.prompt)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FEF6E4] border border-[#E0D1B8] hover:border-[#F8C45C] text-[11px] font-semibold text-[#66523B] hover:text-[#2C1E14] transition-all whitespace-nowrap shrink-0 shadow-xs min-h-[30px]"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={chatScrollContainerRef}
        className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FFFCF7]"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2.5 max-w-[92%] sm:max-w-[80%]">
              {msg.sender === 'assistant' && (
                <MascotFace emotion="happy" size={30} className="shrink-0 mt-0.5" />
              )}

              <div className="space-y-2">
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-sans leading-relaxed shadow-warm-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#263D2D] text-white rounded-tr-sm'
                      : 'bg-white border border-[#E4D7C0] text-[#2C1E14] rounded-tl-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Rich Interactive Cards */}
                {msg.cardType === 'supplier' && (
                  <div className="p-3.5 bg-cream-50 rounded-2xl border border-[#F8C45C] space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#315B42]">Recommended Mandi</span>
                        <h5 className="font-bold text-sm text-[#2C1E14]">{msg.cardData.supplierName}</h5>
                        <p className="text-[#8A7662]">{msg.cardData.item} &bull; {msg.cardData.delivery}</p>
                      </div>
                      <span className="font-bold text-base text-[#315B42]">₹{msg.cardData.price}/{msg.cardData.unit}</span>
                    </div>
                    <div className="pt-2 flex gap-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          addShoppingItem({
                            ingredientId: 'ing-paneer-01',
                            ingredientName: 'Fresh Malai Paneer',
                            quantity: 60,
                            unit: 'kg',
                            targetSupplierId: 'sup-delhi-02',
                            targetSupplierName: msg.cardData.supplierName,
                            estPricePerUnit: msg.cardData.price,
                            totalCost: msg.cardData.price * 60,
                            isCompleted: false,
                            category: 'Dairy & Paneer',
                          });
                          handleSendMessage('Added 60kg Paneer to Shopping List');
                        }}
                      >
                        Add 60kg to Shopping List
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const supId = msg.cardData?.supplierId || 'sup-delhi-02';
                          const ingId = msg.cardData?.ingredientId || 'ing-paneer-01';
                          router.push(`/app/suppliers?supplierId=${supId}&ingredientId=${ingId}`);
                        }}
                      >
                        View Supplier
                      </Button>
                    </div>
                  </div>
                )}

                {msg.cardType === 'substitution' && (
                  <div className="p-3.5 bg-cream-50 rounded-2xl border border-[#315B42] space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#315B42]">Recipe Optimization</span>
                        <h5 className="font-bold text-sm text-[#2C1E14]">{msg.cardData.title}</h5>
                      </div>
                      <span className="text-xs font-bold text-[#315B42] bg-[#EAF3ED] px-2 py-0.5 rounded">
                        {msg.cardData.savingsPercent}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#66523B]">
                      <span>Original Spend: {msg.cardData.currentCost}</span>
                      <span>Optimized: <strong>{msg.cardData.newCost}</strong></span>
                    </div>
                    <div className="pt-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          applySubstitution('ing-cashew-tukda-21', 'ing-magaz', 'Melon Seeds', 320);
                          handleSendMessage('Applied substitution to recipe ledger');
                        }}
                      >
                        Accept & Update Menu Recipe
                      </Button>
                    </div>
                  </div>
                )}

                {msg.cardType === 'shopping_list' && (
                  <div className="p-3.5 bg-cream-50 rounded-2xl border border-[#E4D7C0] space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#2C1E14]">{msg.cardData.itemsCount} Mandi Items Compiled</span>
                      <strong className="text-sm font-mono text-[#315B42]">{msg.cardData.totalEst}</strong>
                    </div>
                    <p className="text-[11px] text-[#315B42]">Save {msg.cardData.savingsEst} vs spot retail purchasing</p>
                    <Button type="button" variant="primary" size="sm" fullWidth onClick={() => router.push('/app/shopping-list')}>
                      Open Full Order Slip &rarr;
                    </Button>
                  </div>
                )}

                {/* Follow up suggestions */}
                {msg.followUps && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.followUps.map((fu, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(fu)}
                        className="text-[11px] text-[#315B42] hover:text-[#2C1E14] font-medium bg-[#EAF3ED] hover:bg-[#D5EBD9] px-2.5 py-1 rounded-lg transition-colors border border-[#C5DEC9]"
                      >
                        {fu} &rarr;
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#8A7662]">
            <MascotFace emotion="thinking" size={26} />
            <span className="animate-pulse">Copilot is checking mandi benchmarks...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-white border-t border-[#EBE1CF] flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask in English or Hinglish (e.g. cheapest paneer in Delhi)..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-cream-50 border border-[#E4D7C0] text-xs sm:text-sm text-[#2C1E14] focus:outline-none focus:border-[#F8C45C] min-h-[44px]"
        />
        <Button variant="primary" size="md" type="submit" disabled={!input.trim()} rightIcon={<Send className="w-4 h-4" />}>
          Send
        </Button>
      </form>
    </div>
  );
}
