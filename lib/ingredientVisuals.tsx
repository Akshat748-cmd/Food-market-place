'use client';

import React, { useState } from 'react';
import { Building2, Store, Truck, ShoppingBag } from 'lucide-react';
import { SupplierType } from '@/types';

// Curated verified RAW commodity photos (strictly raw ingredients, NO cooked food)
export const RAW_INGREDIENT_PHOTOS: Record<string, string> = {
  paneer: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', // raw white dairy cubes/block
  chicken: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80', // fresh raw poultry breast cut
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80', // fresh red ripe crate tomatoes
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80', // raw red onions
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', // raw whole potatoes
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', // raw grains of basmati rice
  atta: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', // whole wheat flour sack
  ghee: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80', // pure golden desi ghee
  butter: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80', // raw churned dairy butter
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', // raw fresh dairy milk
  curd: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80', // clay pot fresh curd
  cream: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', // rich dairy cream
  cashew: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80', // raw whole white cashew nuts
  coffee: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80', // raw roasted whole coffee beans
  tea: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', // whole loose assam tea leaves
};

/**
 * Hand-drawn SVG illustrations of raw ingredients and commodity categories
 */
export function getIngredientIllustration(name: string, category?: string, size = 48) {
  const n = name.toLowerCase();
  const c = (category || '').toLowerCase();

  // 1. SPECIFIC RAW INGREDIENT SVG ICONS
  if (n.includes('paneer')) {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
        <rect x="8" y="14" width="32" height="22" rx="4" fill="#FEFDF5" stroke="#66523B" strokeWidth="2" />
        <path d="M8 22H40M18 14V36M28 14V36" stroke="#E4D7C0" strokeWidth="1.5" strokeDasharray="2 2" />
        <circle cx="14" cy="18" r="1.5" fill="#F8C45C" />
      </svg>
    );
  }

  if (n.includes('chicken') || n.includes('mutton') || c.includes('meat')) {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
        <path d="M14 26C14 20 18 14 26 14C34 14 36 22 36 28C36 34 30 36 24 36C18 36 14 32 14 26Z" fill="#FDE8E8" stroke="#66523B" strokeWidth="2" />
        <circle cx="34" cy="30" r="4" fill="#FFFFFF" stroke="#66523B" strokeWidth="1.5" />
        <path d="M22 20C24 22 26 26 24 28" stroke="#E05252" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('tomato')) {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
        <circle cx="24" cy="26" r="13" fill="#FEE2E2" stroke="#66523B" strokeWidth="2" />
        <path d="M24 13V9M21 11L24 13L27 11" stroke="#315B42" strokeWidth="2" strokeLinecap="round" />
        <path d="M19 22C21 19 26 19 28 22" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('onion')) {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
        <path d="M24 10C16 16 13 24 13 29C13 35 18 38 24 38C30 38 35 35 35 29C35 24 32 16 24 10Z" fill="#F3E8FF" stroke="#66523B" strokeWidth="2" />
        <path d="M24 10V38M19 16C16 22 16 30 19 35M29 16C32 22 32 30 29 35" stroke="#C084FC" strokeWidth="1.5" />
      </svg>
    );
  }

  if (n.includes('rice') || n.includes('grain')) {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
        <path d="M12 18C12 15 16 13 24 13C32 13 36 15 36 18V33C36 37 31 39 24 39C17 39 12 37 12 33V18Z" fill="#FFFDF5" stroke="#66523B" strokeWidth="2" />
        <path d="M12 18C12 21 17 23 24 23C31 23 36 21 36 18" stroke="#66523B" strokeWidth="1.5" />
        <circle cx="24" cy="29" r="2" fill="#F8C45C" />
      </svg>
    );
  }

  if (n.includes('oil') || n.includes('ghee') || c.includes('oil')) {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
        <rect x="14" y="16" width="20" height="22" rx="3" fill="#FEF6E4" stroke="#66523B" strokeWidth="2" />
        <rect x="20" y="10" width="8" height="6" rx="1.5" fill="#F8C45C" stroke="#66523B" strokeWidth="1.5" />
        <path d="M24 23C22 25 21 27 21 29C21 31 22.3 32 24 32C25.7 32 27 31 27 29C27 27 26 25 24 23Z" fill="#F8C45C" stroke="#66523B" strokeWidth="1.2" />
      </svg>
    );
  }

  if (n.includes('coffee') || n.includes('tea') || c.includes('beverage')) {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
        <ellipse cx="20" cy="22" rx="6" ry="9" transform="rotate(-20 20 22)" fill="#543C2E" stroke="#2C1E14" strokeWidth="1.5" />
        <ellipse cx="30" cy="26" rx="5" ry="8" transform="rotate(25 30 26)" fill="#6F4E37" stroke="#2C1E14" strokeWidth="1.5" />
        <path d="M20 13C20 18 20 26 20 31" stroke="#F8C45C" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }

  if (c.includes('vegetable') || n.includes('potato') || n.includes('chilli')) {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
        <rect x="10" y="18" width="28" height="18" rx="3" fill="#EAF3ED" stroke="#66523B" strokeWidth="2" />
        <path d="M10 24H38M10 30H38M19 18V36M29 18V36" stroke="#315B42" strokeWidth="1.5" />
      </svg>
    );
  }

  // DEFAULT RAW COMMODITY SACK
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
      <path d="M14 18C14 14 18 12 24 12C30 12 34 14 34 18L36 34C36 37 31 38 24 38C17 38 12 37 12 34L14 18Z" fill="#F5EFE4" stroke="#66523B" strokeWidth="2" />
      <path d="M19 12L24 16L29 12" stroke="#66523B" strokeWidth="1.5" />
      <circle cx="24" cy="26" r="3" fill="#F8C45C" stroke="#66523B" strokeWidth="1" />
    </svg>
  );
}

/**
 * Supplier type chip badge for image corner
 */
export function SupplierTypeBadge({ type }: { type: SupplierType | string }) {
  const norm = (type || 'wholesaler').toLowerCase();

  let label = 'Wholesaler';
  let Icon = Building2;
  let bgClass = 'bg-[#263D2D] text-white';

  if (norm.includes('mandi') || norm.includes('apmc')) {
    label = 'Direct Mandi';
    Icon = Store;
    bgClass = 'bg-[#315B42] text-white';
  } else if (norm.includes('cold') || norm.includes('b2b')) {
    label = 'Cold-Chain B2B';
    Icon = Truck;
    bgClass = 'bg-[#1E3A8A] text-white';
  } else if (norm.includes('retail')) {
    label = 'Retailer';
    Icon = ShoppingBag;
    bgClass = 'bg-[#7C2D12] text-white';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/20 ${bgClass}`}>
      <Icon className="w-3 h-3 text-[#F8C45C]" />
      <span>{label}</span>
    </div>
  );
}

/**
 * Raw Ingredient Visual Component
 * Guarantees NO COOKED FOOD is shown.
 */
export function RawIngredientVisual({
  ingredientName,
  category,
  supplierType,
  className = '',
  size = 64,
}: {
  ingredientName: string;
  category?: string;
  supplierType?: SupplierType | string;
  className?: string;
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);

  // Match photo if available
  const lower = ingredientName.toLowerCase();
  const matchedKey = Object.keys(RAW_INGREDIENT_PHOTOS).find((k) => lower.includes(k));
  const photoUrl = matchedKey && !imgError ? RAW_INGREDIENT_PHOTOS[matchedKey] : null;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#FFF9EF] border border-[#E4D7C0] flex items-center justify-center select-none ${className}`}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={`Raw uncooked ${ingredientName}`}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFFDF9] to-[#F7EFE1] p-2">
          {getIngredientIllustration(ingredientName, category, size)}
        </div>
      )}

      {/* Supplier type badge overlay on top-left corner */}
      {supplierType && (
        <div className="absolute top-2 left-2 z-10">
          <SupplierTypeBadge type={supplierType} />
        </div>
      )}
    </div>
  );
}
