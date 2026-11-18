'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

// SAMPLE CONTENT: Fictional restaurateurs and testimonials for demonstration purposes
const TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Chef Zorawar Bhatia',
    role: 'Executive Chef & Co-owner',
    restaurant: 'Pind Da Dawat',
    city: 'New Delhi',
    savings: '₹74,000 / mo saved',
    avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80',
    quote:
      'Before Food Market Hub, we were paying our dairy distributor ₹340/kg for paneer. The platform linked us straight to Verka Mandi at ₹285/kg. The ingredient AI extracted our exact recipe portions in under 4 minutes.',
  },
  {
    id: 't-2',
    name: 'Ananya Raghavan',
    role: 'Founder & Culinary Director',
    restaurant: 'Malabar & Coast',
    city: 'Bengaluru',
    savings: '₹58,500 / mo saved',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    quote:
      'We run three high-volume coastal restaurants in Indiranagar. Consolidating our daily coconut oil, spices, and seafood orders through the city pricing index shaved 4.8% off our monthly prime food cost.',
  },
  {
    id: 't-3',
    name: 'Kabir Singhania',
    role: 'Managing Partner',
    restaurant: 'Bao & Wok Kitchens',
    city: 'Mumbai',
    savings: '₹82,000 / mo saved',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    quote:
      'Operating five cloud kitchen delivery brands meant juggling 14 different vendors on WhatsApp every night. The AI assistant now compiles our consolidated morning shopping list with zero manual calculation.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeading
        badge="Loved by Kitchen Operators"
        title="Trusted by top chefs & restaurateurs"
        serifAccent="saving lakhs every quarter"
        subtitle="See how independent dining rooms and multi-brand kitchens take control of their food costs."
        align="center"
        className="mb-12 md:mb-16"
      />

      {/* Grid on Desktop, Swipe Carousel with Snap on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 no-scrollbar snap-x snap-mandatory">
        {TESTIMONIALS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="snap-start shrink-0 w-[88vw] sm:w-[70vw] md:w-auto bg-white border border-[#EBE1CF] hover:border-[#F8C45C] rounded-[24px] p-6 sm:p-7 shadow-warm hover:shadow-warm-lg transition-all flex flex-col justify-between"
          >
            {/* Top quote icon & Stars */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-[#F8C45C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F8C45C]" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#315B42] bg-[#EAF3ED] px-2.5 py-1 rounded-full border border-[#C5DEC9]">
                  {item.savings}
                </span>
              </div>

              <p className="text-sm sm:text-[15px] text-[#66523B] leading-relaxed italic font-serif mb-6">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            {/* Author Profile */}
            <div className="pt-4 border-t border-[#F1E8D8] flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#E4D7C0] shrink-0">
                <Image src={item.avatar} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-[#2C1E14] font-sans">{item.name}</span>
                <span className="text-xs text-[#8A7662]">
                  {item.role} &bull; {item.restaurant}
                </span>
                <span className="text-[11px] font-semibold text-[#315B42]">{item.city}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
