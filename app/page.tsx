import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { SupplierDiscoverySection } from '@/components/landing/SupplierDiscoverySection';
import { CityPricesSection } from '@/components/landing/CityPricesSection';
import { SavingsSection } from '@/components/landing/SavingsSection';
import { AIAssistantSection } from '@/components/landing/AIAssistantSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FooterSection } from '@/components/landing/FooterSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#2C1E14] selection:bg-[#F8C45C]/30 overflow-x-hidden">
      {/* Locked Hero (exact screenshot visual source of truth) */}
      <Hero />

      {/* 11 Landing Page Sections Below The Hero */}
      <FeaturesSection />
      <HowItWorksSection />
      <SupplierDiscoverySection />
      <CityPricesSection />
      <SavingsSection />
      <AIAssistantSection />
      <BenefitsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
