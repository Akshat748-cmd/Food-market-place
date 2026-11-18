'use client';

import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';

export function FAQSection() {
  const faqItems = [
    {
      id: 'faq-1',
      title: 'How does the AI extract exact ingredients from my menu?',
      subtitle: 'Portion-level culinary deconstruction',
      children:
        'Our culinary AI models analyze your menu dish titles, descriptions, and regional style (e.g. North Indian Mughlai vs Coastal vs Indo-Chinese). It breaks down each item into standard culinary portion weights for dairy, proteins, base gravies, and spices.',
      defaultOpen: true,
    },
    {
      id: 'faq-2',
      title: 'Can I manually edit and fine-tune recipe grams?',
      subtitle: 'Complete kitchen customizability',
      children:
        'Yes, 100%. Once our agent parses your menu, you can adjust portion weights, swap preferred brands (like Amul butter vs white makkhan), or add confidential proprietary ingredients with a single click.',
    },
    {
      id: 'faq-3',
      title: 'Where do the wholesale ingredient prices come from?',
      subtitle: 'APMC mandis & direct distributor benchmarks',
      children:
        'We benchmark daily wholesale prices from verified APMC Mandis (such as Azadpur and Ghazipur in Delhi, Vashi in Mumbai, Yeshwanthpur in Bengaluru) along with licensed co-ops and B2B distributor feeds updated each morning.',
    },
    {
      id: 'faq-4',
      title: 'Which Indian cities are currently supported?',
      subtitle: '12 culinary metro markets',
      children:
        'Food Market Hub currently supports 12 key metropolitan culinary zones: Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Chandigarh, and Indore.',
    },
    {
      id: 'faq-5',
      title: 'How can fresh food suppliers and mandi traders join?',
      subtitle: 'Vendor onboarding and quality vetting',
      children:
        'Suppliers must maintain valid FSSAI registrations, cold-chain SLAs, and commit to transparent wholesale pricing. You can click "For Suppliers" at the top of the page to apply for partner onboarding.',
    },
    {
      id: 'faq-6',
      title: 'Is my menu, recipe, and vendor pricing data confidential?',
      subtitle: 'Enterprise-grade encryption',
      children:
        'Yes. Your custom recipes, internal food cost targets, and historical purchasing invoices are encrypted and isolated to your restaurant account. They are never shared with competitor restaurants.',
    },
    {
      id: 'faq-7',
      title: 'Can I cancel or change my plan anytime?',
      subtitle: 'No long-term lock-in',
      children:
        'Absolutely. You can cancel, pause, or upgrade your plan directly in your restaurant settings at any time without penalty or cancellation fees.',
    },
    {
      id: 'faq-8',
      title: 'Does Food Market Hub support multi-brand cloud kitchens?',
      subtitle: 'Virtual brands & commissary routing',
      children:
        'Yes! The platform is purpose-built for multi-brand cloud kitchens. It combines separate aggregator menus (e.g. Biryani brand + Burger brand + Bowl brand) into one consolidated daily mandi purchase order.',
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <SectionHeading
        badge="Frequently Asked Questions"
        title="Everything you need to know"
        serifAccent="about Food Market Hub"
        subtitle="Got questions about our mandi price tracking or recipe extraction? Here are the straightforward answers."
        align="center"
        className="mb-10 md:mb-14"
      />

      <Accordion items={faqItems} />
    </section>
  );
}
