'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Store,
  Check,
  Search,
  ExternalLink,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  BestPriceBadge,
  Input,
  Select,
  Stepper,
  SegmentedControl,
  Tabs,
  Chip,
  Accordion,
  Modal,
  Toast,
  Skeleton,
  EmptyState,
  SectionHeading,
  PriceTag,
  ConfidenceDots,
  Sparkline,
  Mascot,
} from '@/components/ui';
import {
  ChefHatIllustration,
  VegetableBasketIllustration,
  GroceryBagIllustration,
  ServingTrayIllustration,
  MenuCardIllustration,
  ChefIllustration,
  WaiterIllustration,
  HeroAvatarIllustration,
} from '@/components/illustrations';

export default function StyleguidePage() {
  const [segmentedVal, setSegmentedVal] = useState('daily');
  const [activeTab, setActiveTab] = useState('all');
  const [stepperStep, setStepperStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [chips, setChips] = useState(['Organic', 'Cold Chain', 'APMC Direct', 'Daily Harvest']);

  const removeChip = (label: string) => {
    setChips(chips.filter((c) => c !== label));
  };

  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#2C1E14] pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#FFF9EF]/95 backdrop-blur-md border-b border-[#E4D7C0] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white border border-[#E4D7C0] hover:bg-cream-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#66523B]" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#2C1E14] font-sans">
                Design System & Styleguide
              </h1>
              <p className="text-xs text-[#8A7662]">
                Food Market Hub &bull; Foundation tokens, shared components & illustration kit
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/app">
              <Button variant="primary" size="sm">
                Open App Hub &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-12">
        {/* ================= 1. COLOR TOKENS ================= */}
        <section className="space-y-4">
          <SectionHeading
            title="1. Color Tokens"
            serifAccent="& Palette"
            subtitle="Strict brand palette matching the approved landing hero. Warm, restaurant-inspired, no cold corporate grays."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="bg-[#FFF9EF] p-4 rounded-2xl border border-[#E4D7C0] shadow-warm-xs text-center">
              <div className="w-full h-12 rounded-xl bg-[#FFF9EF] border border-[#E4D7C0] mb-2" />
              <span className="text-xs font-bold block">Cream</span>
              <span className="text-[10px] text-[#8A7662]">#FFF9EF (Page BG)</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E4D7C0] shadow-warm-xs text-center">
              <div className="w-full h-12 rounded-xl bg-white border border-[#E4D7C0] mb-2" />
              <span className="text-xs font-bold block">Warm White</span>
              <span className="text-[10px] text-[#8A7662]">#FFFFFF (Cards)</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E4D7C0] shadow-warm-xs text-center">
              <div className="w-full h-12 rounded-xl bg-[#F8C45C] mb-2" />
              <span className="text-xs font-bold block">Golden Yellow</span>
              <span className="text-[10px] text-[#8A7662]">#F8C45C (Hero Accent)</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E4D7C0] shadow-warm-xs text-center">
              <div className="w-full h-12 rounded-xl bg-[#263D2D] mb-2" />
              <span className="text-xs font-bold block">Deep Olive</span>
              <span className="text-[10px] text-[#8A7662]">#263D2D</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E4D7C0] shadow-warm-xs text-center">
              <div className="w-full h-12 rounded-xl bg-[#315B42] mb-2" />
              <span className="text-xs font-bold block">Forest Green</span>
              <span className="text-[10px] text-[#8A7662]">#315B42 (Best Price)</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E4D7C0] shadow-warm-xs text-center">
              <div className="w-full h-12 rounded-xl bg-[#66523B] mb-2" />
              <span className="text-xs font-bold block">Warm Brown</span>
              <span className="text-[10px] text-[#8A7662]">#66523B (Lines/Subtext)</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E4D7C0] shadow-warm-xs text-center">
              <div className="w-full h-12 rounded-xl bg-[#2C1E14] mb-2" />
              <span className="text-xs font-bold block">Dark Brown</span>
              <span className="text-[10px] text-[#8A7662]">#2C1E14 (Headings)</span>
            </div>
          </div>
        </section>

        {/* ================= 2. TYPOGRAPHY ================= */}
        <section className="space-y-4">
          <SectionHeading
            title="2. Typography Pairing"
            serifAccent="& Editorial Hierarchy"
            subtitle="Outfit (geometric, heavy sans) for bold restaurant headlines & UI, paired with Fraunces (serif) exclusively for italic editorial accents."
          />
          <Card variant="default" className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase text-[#8A7662] tracking-wider block mb-1">
                Outfit Sans (UI & Heavy Headings)
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-[#2C1E14] tracking-tight">
                Because your <span className="text-[#F8C45C]">cost matters.</span>
              </h3>
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-[#8A7662] tracking-wider block mb-1">
                Fraunces Serif (Italic Accent Words Only)
              </span>
              <p className="text-xl sm:text-2xl font-serif italic text-[#66523B]">
                &ldquo;Direct mandi procurement saved our flagship Connaught Place outlet ₹62,500 every single month.&rdquo;
              </p>
            </div>
          </Card>
        </section>

        {/* ================= 3. BUTTONS ================= */}
        <section className="space-y-4">
          <SectionHeading
            title="3. Buttons"
            serifAccent="& Actions"
            subtitle="All interactive buttons meet minimum 44px mobile touch target requirements."
          />
          <Card variant="default" className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg">
                Primary Golden (lg)
              </Button>
              <Button variant="primary" size="md">
                Primary Golden (md)
              </Button>
              <Button variant="primary" size="sm">
                Primary Golden (sm)
              </Button>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Sparkles className="w-4 h-4 text-[#2C1E14]" />}
              >
                With Left Icon
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button variant="secondary" size="md">
                Secondary Olive
              </Button>
              <Button
                variant="secondary"
                size="md"
                rightIcon={<ShoppingBag className="w-4 h-4 text-white" />}
              >
                With Right Icon
              </Button>
              <Button variant="outline" size="md">
                Outline Warm
              </Button>
              <Button variant="ghost" size="md">
                Ghost Link
              </Button>
              <Button variant="primary" size="md" disabled>
                Disabled State
              </Button>
            </div>
          </Card>
        </section>

        {/* ================= 4. CARDS ================= */}
        <section className="space-y-4">
          <SectionHeading
            title="4. Cards & Variants"
            serifAccent="& Golden Borders"
            subtitle="Soft brown-tinted shadows (never harsh black) with 1px golden border variants for highlighted items."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card variant="default" interactive>
              <h4 className="text-base font-bold text-[#2C1E14]">Default Warm Card</h4>
              <p className="text-xs text-[#8A7662] mt-1">
                Warm white background with 1px beige border and soft brown shadow. Hover lifts smoothly.
              </p>
            </Card>

            <Card variant="golden" interactive>
              <h4 className="text-base font-bold text-[#2C1E14]">Golden Border Variant</h4>
              <p className="text-xs text-[#8A7662] mt-1">
                Highlighted with warm golden yellow border and subtle top-right ambient aura.
              </p>
            </Card>

            <Card variant="olive">
              <h4 className="text-base font-bold text-white">Deep Olive Card</h4>
              <p className="text-xs text-white/80 mt-1">
                Used for executive highlights, summary metrics, and dark contrast sections.
              </p>
            </Card>
          </div>
        </section>

        {/* ================= 5. BADGES & BEST PRICE ================= */}
        <section className="space-y-4">
          <SectionHeading
            title="5. Badges & Price Badges"
            serifAccent="& Mandi Status"
            subtitle="Semantic alerts for best prices, cautions, and mandi types."
          />
          <Card variant="default" className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <BestPriceBadge variant="solid" savingsPercent={16} />
              <BestPriceBadge variant="subtle" savingsAmount={55} />
              <Badge variant="success">Daily Delivery SLA</Badge>
              <Badge variant="golden">Verified Mandi Partner</Badge>
              <Badge variant="caution">Seasonal Price Rise</Badge>
              <Badge variant="danger">Budget Variance +12%</Badge>
              <Badge variant="olive">Grade A+ Certified</Badge>
            </div>
          </Card>
        </section>

        {/* ================= 6. FORM INPUTS & SELECTS ================= */}
        <section className="space-y-4">
          <SectionHeading
            title="6. Form Inputs & Selects"
            serifAccent="& Controls"
            subtitle="Touch-friendly inputs with warm golden focus halos."
          />
          <Card variant="default">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Ingredient Name"
                placeholder="e.g. Kashmiri Chili Whole"
                helperText="Enter raw culinary item"
              />
              <Input
                label="Search Mandi Supplies"
                placeholder="Search..."
                leftIcon={<Search className="w-4 h-4" />}
              />
              <Select
                label="City Mandi Benchmark"
                options={[
                  { label: 'Delhi NCR (Azadpur & Ghazipur)', value: 'delhi' },
                  { label: 'Mumbai (Vashi APMC)', value: 'mumbai' },
                  { label: 'Bengaluru (Yeshwanthpur)', value: 'bengaluru' },
                ]}
              />
            </div>
          </Card>
        </section>

        {/* ================= 7. STEPPER & SEGMENTED CONTROLS ================= */}
        <section className="space-y-4">
          <SectionHeading
            title="7. Steppers, Tabs & Segmented Controls"
            serifAccent="& Navigation"
            subtitle="Smooth interactive state switchers."
          />
          <Card variant="default" className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase text-[#8A7662] block mb-2">
                Multistep Onboarding Stepper (Click to test)
              </span>
              <Stepper
                currentStep={stepperStep}
                onStepClick={(s) => setStepperStep(s)}
                steps={[
                  { id: 1, label: 'Restaurant Profile' },
                  { id: 2, label: 'Menu Upload' },
                  { id: 3, label: 'AI Ingredient Match' },
                  { id: 4, label: 'Savings Unlocked' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <span className="text-xs font-bold uppercase text-[#8A7662] block mb-2">
                  Segmented Control
                </span>
                <SegmentedControl
                  value={segmentedVal}
                  onChange={setSegmentedVal}
                  options={[
                    { value: 'daily', label: 'Daily Spot' },
                    { value: 'weekly', label: 'Weekly Lock' },
                    { value: 'monthly', label: 'Monthly Contract' },
                  ]}
                />
              </div>

              <div>
                <span className="text-xs font-bold uppercase text-[#8A7662] block mb-2">
                  Filter Chips (Removable)
                </span>
                <div className="flex flex-wrap gap-2">
                  {chips.map((c) => (
                    <Chip key={c} label={c} onRemove={() => removeChip(c)} />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold uppercase text-[#8A7662] block mb-2">
                Tab Component
              </span>
              <Tabs
                activeTab={activeTab}
                onChange={setActiveTab}
                tabs={[
                  { id: 'all', label: 'All Items', count: 27 },
                  { id: 'dairy', label: 'Dairy & Paneer', count: 4 },
                  { id: 'poultry', label: 'Poultry & Meat', count: 3 },
                  { id: 'produce', label: 'Vegetables', count: 6 },
                ]}
              />
            </div>
          </Card>
        </section>

        {/* ================= 8. ACCORDION & MODALS ================= */}
        <section className="space-y-4">
          <SectionHeading
            title="8. Accordion & Responsive Modal"
            serifAccent="& Bottom Sheet"
            subtitle="Modal opens as a centered dialog on desktop and becomes a bottom sheet on mobile."
          />
          <Card variant="default" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#2C1E14]">Bottom Sheet / Modal Demo</h4>
                <p className="text-xs text-[#8A7662]">Test responsiveness at 360px and 1440px.</p>
              </div>
              <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
                Open Modal / Bottom Sheet
              </Button>
            </div>

            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Supplier Agreement & Price Lock"
              description="Confirming direct supply contract with Verka Mandi Dairy Wholesaler."
            >
              <div className="space-y-4 pt-2">
                <div className="p-3 bg-cream-50 rounded-xl border border-[#EBE1CF]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8A7662]">Product</span>
                    <span className="font-bold">Fresh Malai Paneer</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-[#8A7662]">Locked Price</span>
                    <span className="font-bold text-[#315B42]">₹285/kg (Save ₹55/kg)</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="primary" fullWidth onClick={() => setModalOpen(false)}>
                    Confirm Lock
                  </Button>
                  <Button variant="ghost" fullWidth onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal>

            <div>
              <span className="text-xs font-bold uppercase text-[#8A7662] block mb-2">
                Accordion Component
              </span>
              <Accordion
                items={[
                  {
                    id: 'acc-1',
                    title: 'How does Food Market Hub guarantee lower mandi prices?',
                    subtitle: 'Wholesale arbitrage & APMC direct routing',
                    children:
                      'We ingest daily wholesale mandi prices directly from Azadpur APMC, Ghazipur, and registered B2B distributors. By aggregating order volumes across dozens of independent restaurants in your city, suppliers offer tier-1 pricing.',
                    defaultOpen: true,
                  },
                  {
                    id: 'acc-2',
                    title: 'Can my chefs continue using their custom recipes?',
                    subtitle: 'Portion level ingredient fidelity',
                    children:
                      'Yes! The AI agent extracts raw ingredients per portion without altering your recipe weights, flavor profile, or marinade secrets.',
                  },
                ]}
              />
            </div>
          </Card>
        </section>

        {/* ================= 9. METRICS, SPARKLINE & CONFIDENCE ================= */}
        <section className="space-y-4">
          <SectionHeading
            title="9. Price Tags, Sparklines & AI Confidence"
            serifAccent="& Indian Rupee Formatting"
            subtitle="en-IN currency formatting (₹62,500), SVG price trends, and confidence dots."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Card variant="default" className="space-y-3">
              <span className="text-xs font-bold uppercase text-[#8A7662]">Indian Rupee PriceTag</span>
              <div>
                <PriceTag amount={285} originalAmount={340} unit="kg" size="lg" showSavings />
              </div>
              <p className="text-xs text-[#8A7662]">Formatted via Intl en-IN grouping.</p>
            </Card>

            <Card variant="default" className="space-y-3">
              <span className="text-xs font-bold uppercase text-[#8A7662]">Price Trend Sparkline</span>
              <div className="flex items-center gap-3">
                <Sparkline data={[42, 39, 36, 38, 33, 30, 28]} width={100} height={32} />
                <span className="text-xs font-bold text-[#315B42]">-33% vs 30 days</span>
              </div>
              <p className="text-xs text-[#8A7662]">Inline SVG price trend indicator.</p>
            </Card>

            <Card variant="default" className="space-y-3">
              <span className="text-xs font-bold uppercase text-[#8A7662]">AI Confidence Dots</span>
              <div className="space-y-2">
                <ConfidenceDots score={98} />
                <ConfidenceDots score={76} />
                <ConfidenceDots score={45} />
              </div>
            </Card>
          </div>
        </section>

        {/* ================= 10. TOAST & SKELETON ================= */}
        <section className="space-y-4">
          <SectionHeading
            title="10. Toasts & Skeletons"
            serifAccent="& Loading States"
            subtitle="Warm beige pulsing skeletons and contextual alert toasts."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-3">
              <Toast
                id="t-1"
                type="success"
                title="Best Price Locked"
                message="Switched Paneer to Verka Mandi. ₹13,200 saved per month."
              />
              <Toast
                id="t-2"
                type="warning"
                title="Mandi Price Alert"
                message="Onion rates expected to spike due to unseasonal rain."
              />
            </div>

            <Card variant="default" className="space-y-3">
              <span className="text-xs font-bold uppercase text-[#8A7662]">Warm Beige Skeletons</span>
              <div className="space-y-2.5">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-9 w-24 rounded-lg" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ================= 11. MASCOT & AVATAR EXPRESSIONS ================= */}
        <section className="space-y-4">
          <SectionHeading
            title="11. Mascot Assistant"
            serifAccent="& Expressions"
            subtitle="The floating assistant avatar faithfully matching the hero screenshot, with multiple expressions & speech bubbles."
          />
          <Card variant="golden" className="space-y-6">
            <div className="flex flex-wrap items-center gap-8">
              <Mascot
                role="assistant"
                expression="happy"
                size={58}
                message="I found ₹62,500 monthly savings for Dawat-e-Khaas!"
              />
              <Mascot
                role="assistant"
                expression="thinking"
                size={58}
                message="Comparing 4 suppliers for Malai Paneer..."
              />
              <Mascot
                role="assistant"
                expression="alert"
                size={58}
                message="Price drop detected in Azadpur APMC!"
              />
            </div>
          </Card>
        </section>

        {/* ================= 12. ILLUSTRATION KIT GALLERY ================= */}
        <section className="space-y-4">
          <SectionHeading
            title="12. Complete Illustration Kit"
            serifAccent="& Empty States"
            subtitle="Single-weight brown line illustrations with golden-yellow accents for tasteful empty states and mascots."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card variant="default" className="flex flex-col items-center text-center p-4">
              <ChefHatIllustration size={64} />
              <span className="text-xs font-bold text-[#2C1E14] mt-3">Chef Hat</span>
              <span className="text-[10px] text-[#8A7662]">Brand & Setup</span>
            </Card>

            <Card variant="default" className="flex flex-col items-center text-center p-4">
              <VegetableBasketIllustration size={64} />
              <span className="text-xs font-bold text-[#2C1E14] mt-3">Veg Basket</span>
              <span className="text-[10px] text-[#8A7662]">Ingredients</span>
            </Card>

            <Card variant="default" className="flex flex-col items-center text-center p-4">
              <GroceryBagIllustration size={64} />
              <span className="text-xs font-bold text-[#2C1E14] mt-3">Grocery Bag</span>
              <span className="text-[10px] text-[#8A7662]">Shopping List</span>
            </Card>

            <Card variant="default" className="flex flex-col items-center text-center p-4">
              <ServingTrayIllustration size={64} />
              <span className="text-xs font-bold text-[#2C1E14] mt-3">Serving Tray</span>
              <span className="text-[10px] text-[#8A7662]">City Prices</span>
            </Card>

            <Card variant="default" className="flex flex-col items-center text-center p-4">
              <MenuCardIllustration size={64} />
              <span className="text-xs font-bold text-[#2C1E14] mt-3">Menu Card</span>
              <span className="text-[10px] text-[#8A7662]">Recipes & Dishes</span>
            </Card>

            <Card variant="default" className="flex flex-col items-center text-center p-4">
              <ChefIllustration size={64} />
              <span className="text-xs font-bold text-[#2C1E14] mt-3">Chef Character</span>
              <span className="text-[10px] text-[#8A7662]">Kitchen & Prep</span>
            </Card>

            <Card variant="default" className="flex flex-col items-center text-center p-4">
              <WaiterIllustration size={64} />
              <span className="text-xs font-bold text-[#2C1E14] mt-3">Waiter Character</span>
              <span className="text-[10px] text-[#8A7662]">Settings & Service</span>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
