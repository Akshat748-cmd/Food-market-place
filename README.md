# Food Market Hub 🥗📊

> **Because your cost matters.**  
> A premium restaurant-tech web platform helping culinary businesses improve margins with smart ordering, AI ingredient extraction, and direct wholesale mandi price discovery.

---

## 🌟 Overview

**Food Market Hub** connects restaurant recipes directly to local wholesale mandi commodity prices. Kitchens can curate or upload their menus, automatically extract and normalize raw ingredient requirements, discover the cheapest verified vendors across 12 Indian agricultural hubs, and generate actionable savings bills and digital procurement slips.

Built with an international restaurant brand identity: cream background (`#FFF9EF`), warm white cards, deep olive and forest greens (`#263D2D`, `#315B42`), golden yellow accents (`#F8C45C`), Outfit geometric headings, and Fraunces editorial serif accents.

---

## ✨ Key Features

### 1. 🍽️ Premium Landing Experience
- Exact approved visual identity with locked hero section.
- 11 comprehensive below-the-fold sections: Bento Grid Features, Connected Agent Workflow, Interactive Savings Calculator, Real-Time City Price Comparison, Verified Mandi Suppliers Rail, Dish Profitability Simulator, Customer Testimonials, Interactive FAQ, Kitchen Tech Blog, and Full Footer.

### 2. 📋 Interactive Onboarding & Simulation
- **4-Step Wizard**: Setup restaurant name, business model, cuisine tags, outlet branches, and monthly portion volume.
- **AI Processing Pipeline**: Simulated 5-stage agentic workflow (Menu Parser &rarr; Ingredient Agent &rarr; Normalizer Agent &rarr; Sourcing Agent &rarr; Savings Advisor) with streaming terminal logs.

### 3. 📖 Advanced Menu Management & Recipe Ledger
- **Structured Categories**: 3 core groups (Food, Desserts, Beverages) mapped to comprehensive subcategories (Tandoor & Kebabs, Main Course, Biryani, Breads, Thalis, Desi Coolers, etc.).
- **Indian Food Classification**: Standard green Veg, amber Egg, and red Non-Veg markers, plus strict **Jain** (no root vegetables) tagging.
- **Expandable Recipe Ledger**: Click any dish to expand its raw ingredient breakdown, portion weights, unit demand, and monthly requirements.
- **Master Ingredient Ledger**: Unified view of all raw kitchen commodities, total monthly demand, and price benchmarking.

### 4. 🏪 Wholesale Mandi Supplier Discovery & Price Comparison
- **Live Mandi Benchmark**: Real-time comparison across shared wholesale suppliers (APMC Mandis, Dairy Wholesalers, Meat Hubs, Cold-Chain B2B, Retail Supermarkets).
- **Landed Pricing**: Incorporates vendor delivery fees and dispatch frequencies to compute real unit landed rates.
- **3 Distinct Views**:
  - **Best Prices**: Ranked accordion with horizontal price bars, MOQ compatibility checks, and inline editable current prices.
  - **Side-by-Side Matrix**: Full cross-vendor comparison matrix with sticky ingredient columns and rate highlights.
  - **By Supplier / Smart Mix**: Shows savings optimization comparing a multi-vendor mandi mix vs single-supplier or retail purchasing.
- **Raw Ingredient Visuals**: Pure raw commodity imagery and hand-drawn line-art tiles (no cooked food imagery).

### 5. 💰 Cost & Savings Analytics
- **Monthly Savings Bill**: Fraunces-styled perforated paper receipt highlighting net monthly savings (~₹62,500/mo for Delhi flagship).
- **Visual Analytics**: Interactive Recharts donut chart for food cost breakdown and 6-month historical savings bar chart.
- **Dish Profitability**: Target 30% food cost threshold progress bars flagging margin leakage.
- **Smart Substitutions & Spoilage Logs**: Track and log kitchen waste loss with actionable preventative tips.

### 6. 🤖 Chef Hub AI Copilot & Digital Order Slip
- **Contextual Assistant**: Scripted natural-language and Hinglish intent matching for mandi inquiries, substitutions, and supplier lookups.
- **Digital Grocery Slip**: Perforated printable order slip grouped by vendor with quantity steppers, WhatsApp sharing, and PDF export.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Static Export ready)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with localStorage persistence
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/) (SSR-safe dynamic loading)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js 18+ and npm installed.

### Installation

```bash
# Clone the repository
git clone https://github.com/Akshat748-cmd/Food-market-place.git

# Navigate into the project directory
cd Food-market-place

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build

```bash
# Compile and build the production bundle
npm run build

# Start the production server
npm run start
```

---

## 📱 Mobile Responsiveness & Polish

- Full-bleed cream palette with single window scrolling (no nested vertical scroll traps).
- Background scroll lock hook (`useScrollLock`) across all drawers, bottom sheets, and modals.
- Fixed 264px desktop sidebar with bottom-pinned restaurant profile and 44px touch targets.
- 56px floating Chef Hub copilot button with hover tooltip and reserved clearance.

---

## 📄 License

This project is licensed under the MIT License.
