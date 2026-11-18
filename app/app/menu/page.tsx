'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  UploadCloud,
  FileText,
  Sparkles,
  AlertCircle,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowRight,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  Flame,
  Minus,
  Store,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { Dish, FoodType, MenuGroup, DishTag, DishVariant } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Mascot } from '@/components/ui/Mascot';
import { EmptyState } from '@/components/ui/EmptyState';
import { MenuCardIllustration, VegetableBasketIllustration } from '@/components/illustrations';
import { MENU_CATEGORIES_TREE } from '@/data/menuCategories';
import { RawIngredientVisual, getIngredientIllustration } from '@/lib/ingredientVisuals';
import { useScrollLock } from '@/hooks/useScrollLock';

function MenuManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHydrated = useHydrated();
  const {
    dishes,
    addDish,
    updateDish,
    deleteDish,
    ingredients,
    getCurrentRestaurant,
  } = useAppStore();

  const currentRestaurant = isHydrated ? getCurrentRestaurant() : null;

  // View mode synced with URL query (?view=dishes | ingredients | upload)
  const initialView = searchParams.get('view') === 'ingredients' ? 'ingredients' : 'dishes';
  const [activeView, setActiveView] = useState<'dishes' | 'ingredients' | 'upload'>(initialView);

  useEffect(() => {
    const v = searchParams.get('view');
    if (v === 'ingredients') setActiveView('ingredients');
    else if (v === 'upload') setActiveView('upload');
    else setActiveView('dishes');
  }, [searchParams]);

  // Filtering state
  const [foodTypeFilter, setFoodTypeFilter] = useState<'all' | 'veg' | 'egg' | 'nonveg' | 'jain'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'category' | 'price' | 'portions'>('category');

  // Expansion controls
  const [expandedDishId, setExpandedDishId] = useState<string | null>(null);
  const [expandAllUnderDishes, setExpandAllUnderDishes] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Modal / Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  // Lock scrolling when Add/Edit modal is open
  useScrollLock(drawerOpen);

  // Form State for Add / Edit Dish Modal
  const [formName, setFormName] = useState('');
  const [formGroup, setFormGroup] = useState<MenuGroup>('food');
  const [formCategory, setFormCategory] = useState<string>('Starters & Appetizers');
  const [formSubcategory, setFormSubcategory] = useState<string>('Veg Starters');
  const [formFoodType, setFormFoodType] = useState<FoodType>('veg');
  const [formPrice, setFormPrice] = useState('385');
  const [formDescription, setFormDescription] = useState('');
  const [formPortions, setFormPortions] = useState('350');
  const [formSpiceLevel, setFormSpiceLevel] = useState<number>(1);
  const [formTags, setFormTags] = useState<DishTag[]>([]);
  const [formVariants, setFormVariants] = useState<DishVariant[]>([]);
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Upload simulation state
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);

  // Low confidence flagged dish IDs for review badge
  const lowConfidenceIds = ['dish-06', 'dish-09'];

  // Toggle Collapse section
  const toggleSection = (secKey: string) => {
    setCollapsedSections((prev) => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  const toggleCollapseAll = () => {
    const allCollapsed = Object.values(collapsedSections).some(Boolean);
    if (allCollapsed) {
      setCollapsedSections({});
    } else {
      setCollapsedSections({
        vegFood: true,
        eggFood: true,
        nonvegFood: true,
        dessert: true,
        beverage: true,
      });
    }
  };

  // Indian Food-Type Mark Indicator
  const renderFoodTypeMark = (ft?: FoodType, isVeg?: boolean) => {
    const actual = ft || (isVeg ? 'veg' : 'nonveg');
    if (actual === 'veg') {
      return (
        <span className="w-4 h-4 border-2 border-[#315B42] rounded-sm flex items-center justify-center shrink-0" title="Vegetarian">
          <span className="w-2 h-2 rounded-full bg-[#315B42]" />
        </span>
      );
    }
    if (actual === 'egg') {
      return (
        <span className="w-4 h-4 border-2 border-[#B45309] rounded-sm flex items-center justify-center shrink-0" title="Eggetarian">
          <span className="w-2 h-2 rounded-full bg-[#B45309]" />
        </span>
      );
    }
    return (
      <span className="w-4 h-4 border-2 border-[#C2410C] rounded-sm flex items-center justify-center shrink-0" title="Non-Vegetarian">
        <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
      </span>
    );
  };

  // Open modal handlers
  const handleOpenAddDrawer = () => {
    setEditingDish(null);
    setFormName('');
    setFormGroup('food');
    setFormCategory('Starters & Appetizers');
    setFormSubcategory('Veg Starters');
    setFormFoodType('veg');
    setFormPrice('350');
    setFormDescription('');
    setFormPortions('300');
    setFormSpiceLevel(1);
    setFormTags([]);
    setFormVariants([]);
    setFormIsAvailable(true);
    setFormError(null);
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (dish: Dish) => {
    setEditingDish(dish);
    setFormName(dish.name);
    setFormGroup(dish.group || 'food');
    setFormCategory(dish.category);
    setFormSubcategory(dish.subcategory || '');
    setFormFoodType(dish.foodType || (dish.isVeg ? 'veg' : 'nonveg'));
    setFormPrice(dish.price.toString());
    setFormDescription(dish.description || '');
    setFormPortions(dish.portionsSoldPerMonth.toString());
    setFormSpiceLevel(dish.spiceLevel ?? 1);
    setFormTags(dish.tags || []);
    setFormVariants(dish.variants || []);
    setFormIsAvailable(dish.isAvailable ?? true);
    setFormError(null);
    setDrawerOpen(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Dish name is required');
      return;
    }

    // Validation: Jain cannot be combined with Egg or Non-Veg
    if (formTags.includes('jain') && (formFoodType === 'egg' || formFoodType === 'nonveg')) {
      setFormError('Jain classification cannot contain Egg or Non-Veg.');
      return;
    }

    const priceNum = Number(formPrice) || 0;
    const isVegBool = formFoodType === 'veg';

    if (editingDish) {
      updateDish({
        ...editingDish,
        name: formName,
        group: formGroup,
        category: formCategory,
        subcategory: formSubcategory,
        foodType: formFoodType,
        isVeg: isVegBool,
        price: priceNum,
        description: formDescription,
        portionsSoldPerMonth: Number(formPortions) || 100,
        spiceLevel: formSpiceLevel,
        tags: formTags,
        variants: formVariants,
        isAvailable: formIsAvailable,
      });
    } else {
      const newDish: Dish = {
        id: `dish-custom-${Date.now()}`,
        restaurantId: currentRestaurant?.id || 'rest-delhi-01',
        name: formName,
        group: formGroup,
        category: formCategory,
        subcategory: formSubcategory,
        foodType: formFoodType,
        isVeg: isVegBool,
        price: priceNum,
        description: formDescription,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
        portionsSoldPerMonth: Number(formPortions) || 100,
        spiceLevel: formSpiceLevel,
        tags: formTags,
        variants: formVariants,
        isAvailable: formIsAvailable,
        ingredients: [
          { ingredientId: 'ing-paneer-01', ingredientName: 'Main Base Commodity', quantityPerPortion: 0.2, unit: 'kg' },
          { ingredientId: 'ing-tomato-16', ingredientName: 'Salad / Base Vegetables', quantityPerPortion: 0.15, unit: 'kg' },
          { ingredientId: 'ing-ghee-desi-39', ingredientName: 'Pure Cooking Fat', quantityPerPortion: 0.03, unit: 'kg' },
        ],
      };
      addDish(newDish);
    }
    setDrawerOpen(false);
  };

  // Filter dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // FoodType / Jain filter
      const actualType = dish.foodType || (dish.isVeg ? 'veg' : 'nonveg');
      if (foodTypeFilter === 'veg' && actualType !== 'veg') return false;
      if (foodTypeFilter === 'egg' && actualType !== 'egg') return false;
      if (foodTypeFilter === 'nonveg' && actualType !== 'nonveg') return false;
      if (foodTypeFilter === 'jain') {
        const hasJainTag = dish.tags?.includes('jain') || dish.name.toLowerCase().includes('jain');
        if (!hasJainTag) return false;
      }

      // Category filter
      if (selectedCategory !== 'All') {
        const catMatch =
          dish.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          dish.group?.toLowerCase() === selectedCategory.toLowerCase();
        if (!catMatch) return false;
      }

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(q);
        const matchesDesc = dish.description.toLowerCase().includes(q);
        const matchesIng = dish.ingredients.some((i) => i.ingredientName.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }

      return true;
    });
  }, [dishes, foodTypeFilter, selectedCategory, searchQuery]);

  // Group filtered dishes into FOOD (veg, egg, non-veg), DESSERTS, and BEVERAGES
  const structuredSections = useMemo(() => {
    const vegFood: Dish[] = [];
    const eggFood: Dish[] = [];
    const nonvegFood: Dish[] = [];
    const desserts: Dish[] = [];
    const beverages: Dish[] = [];

    filteredDishes.forEach((d) => {
      const g = d.group || 'food';
      const ft = d.foodType || (d.isVeg ? 'veg' : 'nonveg');

      if (g === 'dessert' || d.category.toLowerCase().includes('dessert')) {
        desserts.push(d);
      } else if (g === 'beverage' || d.category.toLowerCase().includes('beverage')) {
        beverages.push(d);
      } else {
        if (ft === 'veg') vegFood.push(d);
        else if (ft === 'egg') eggFood.push(d);
        else nonvegFood.push(d);
      }
    });

    const sortFn = (a: Dish, b: Dish) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'portions') return b.portionsSoldPerMonth - a.portionsSoldPerMonth;
      return a.category.localeCompare(b.category);
    };

    return {
      vegFood: vegFood.sort(sortFn),
      eggFood: eggFood.sort(sortFn),
      nonvegFood: nonvegFood.sort(sortFn),
      desserts: desserts.sort(sortFn),
      beverages: beverages.sort(sortFn),
    };
  }, [filteredDishes, sortBy]);

  // Dish row renderer with expandable recipe card
  const renderDishRow = (dish: Dish, idx: number) => {
    const isExpanded = expandAllUnderDishes || expandedDishId === dish.id;
    const isLowConfidence = lowConfidenceIds.includes(dish.id);

    return (
      <div
        key={dish.id}
        className="py-3.5 px-3 rounded-2xl transition-colors hover:bg-[#F9F5EC] group border-b border-[#F1E8D8]/60 last:border-b-0"
      >
        {/* Line 1: Food-type mark, Dish name, Dotted leader, Price */}
        <div
          onClick={() => setExpandedDishId(expandedDishId === dish.id ? null : dish.id)}
          className="flex items-center justify-between gap-2 w-full cursor-pointer select-none"
        >
          {renderFoodTypeMark(dish.foodType, dish.isVeg)}

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-fraunces font-semibold text-base sm:text-lg text-[#2C1E14] tracking-tight">
              {dish.name}
            </span>

            {/* Tags / Badges */}
            {dish.tags?.includes('jain') && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-1.5 py-0.5 rounded border border-[#BBF7D0]">
                Jain
              </span>
            )}
            {dish.tags?.includes('chefSpecial') && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C2D12] bg-[#FFEDD5] px-1.5 py-0.5 rounded">
                Chef&apos;s Special
              </span>
            )}
            {dish.tags?.includes('bestseller') && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E3A8A] bg-[#DBEAFE] px-1.5 py-0.5 rounded">
                Bestseller
              </span>
            )}
            {dish.spiceLevel !== undefined && dish.spiceLevel > 0 && (
              <span className="inline-flex items-center text-xs text-rose-600" title={`Spice Level: ${dish.spiceLevel}/3`}>
                {Array.from({ length: dish.spiceLevel }).map((_, i) => (
                  <Flame key={i} className="w-3 h-3 fill-rose-500 text-rose-500 -ml-0.5" />
                ))}
              </span>
            )}
          </div>

          {/* Dotted leader stretching to price */}
          <div className="flex-1 border-b-2 border-dotted border-[#D1BF9F] mx-2 sm:mx-3 min-w-[20px]" />

          {/* Price / Variants */}
          <div className="text-right shrink-0">
            {dish.variants && dish.variants.length > 0 ? (
              <span className="font-fraunces text-sm sm:text-base font-bold text-[#8C5D08]">
                {dish.variants.map((v) => `${v.name} ₹${v.price}`).join(' | ')}
              </span>
            ) : (
              <span className="font-fraunces text-lg sm:text-xl font-bold text-[#8C5D08]">
                {formatCurrency(dish.price)}
              </span>
            )}
          </div>
        </div>

        {/* Line 2: Description */}
        <p className="text-sm text-[#66523B] line-clamp-2 mt-1 leading-snug">
          {dish.description}
        </p>

        {/* Line 3: Meta chips, amber warning, actions */}
        <div className="flex items-center justify-between gap-2 mt-2 pt-1 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setExpandedDishId(expandedDishId === dish.id ? null : dish.id)}
              className="text-[11px] font-bold text-[#315B42] hover:underline flex items-center gap-1 bg-[#EAF3ED] px-2 py-0.5 rounded-md"
            >
              <span>{dish.ingredients.length} raw ingredients</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <span className="text-[11px] font-semibold text-[#8A7662] bg-[#F1E8D8] px-2 py-0.5 rounded-md">
              {dish.portionsSoldPerMonth} portions/mo
            </span>
            {isLowConfidence && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                <AlertCircle className="w-3 h-3" />
                <span>Please check ingredients</span>
              </span>
            )}
          </div>

          {/* Edit / Delete (Always visible on mobile; hover on desktop) */}
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={() => handleOpenEditDrawer(dish)}
              className="w-8 h-8 rounded-lg bg-white border border-[#EBE1CF] hover:bg-[#FEF6E4] text-[#66523B] hover:text-[#2C1E14] transition-colors flex items-center justify-center shadow-xs"
              title="Edit Dish Recipe"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => deleteDish(dish.id)}
              className="w-8 h-8 rounded-lg bg-white border border-[#EBE1CF] hover:bg-[#FEE2E2] text-[#C2410C] transition-colors flex items-center justify-center shadow-xs"
              title="Delete Dish"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* EXPANDED INLINE RECIPE CARD (Only one expanded at a time, unless toggle is on) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-3 pt-3 border-t border-[#E4D7C0]/60 bg-[#FFFDF9] rounded-2xl p-3.5 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#2C1E14]">Raw Ingredient Recipe Ledger</span>
                <span className="text-[11px] text-[#8A7662]">Calculates monthly kitchen demand</span>
              </div>

              <div className="divide-y divide-[#F1E8D8] text-xs">
                {dish.ingredients.map((ing, iIdx) => {
                  const monthlyNeed = Math.round(ing.quantityPerPortion * dish.portionsSoldPerMonth * 10) / 10;
                  return (
                    <div key={iIdx} className="py-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white border border-[#E4D7C0] flex items-center justify-center shrink-0">
                          {getIngredientIllustration(ing.ingredientName, '', 20)}
                        </div>
                        <span className="font-semibold text-[#2C1E14] truncate">{ing.ingredientName}</span>
                      </div>

                      {/* Stepper + Unit */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-[#66523B]">
                          {ing.quantityPerPortion} {ing.unit} / portion
                        </span>
                        <span className="font-mono font-bold text-[#315B42] bg-[#EAF3ED] px-2 py-0.5 rounded">
                          {monthlyNeed} {ing.unit}/mo
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP HEADER (~72px compact) with 3-way Segmented Control: Dishes | All Ingredients | Upload */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4D7C0]/60 pb-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263D2D] font-outfit tracking-tight leading-none">
            My <span className="font-fraunces italic font-normal text-[#315B42]">Menu & Ingredients</span>
          </h1>
          <p className="text-xs text-[#66523B] mt-1 font-medium">
            {dishes.length} recipes &bull; {ingredients.length} commodities tracked across {currentRestaurant?.name || 'Delhi Haveli'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0 flex-wrap">
          {/* Segmented Control: Dishes | All Ingredients | Upload */}
          <div className="bg-[#F1E8D8] p-1 rounded-xl flex items-center text-xs font-bold border border-[#E0D1B8]">
            <button
              type="button"
              onClick={() => {
                setActiveView('dishes');
                router.replace('/app/menu');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'dishes'
                  ? 'bg-white text-[#263D2D] shadow-warm-xs'
                  : 'text-[#66523B] hover:text-[#263D2D]'
              }`}
            >
              Dishes ({dishes.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('ingredients');
                router.replace('/app/menu?view=ingredients');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'ingredients'
                  ? 'bg-white text-[#263D2D] shadow-warm-xs'
                  : 'text-[#66523B] hover:text-[#263D2D]'
              }`}
            >
              All Ingredients ({ingredients.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveView('upload')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeView === 'upload'
                  ? 'bg-white text-[#263D2D] shadow-warm-xs'
                  : 'text-[#66523B] hover:text-[#263D2D]'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          </div>

          {/* Golden Add Dish Button */}
          <button
            type="button"
            onClick={handleOpenAddDrawer}
            className="px-3.5 py-2 rounded-xl bg-[#F8C45C] hover:bg-[#eab348] text-[#263D2D] text-xs font-bold transition-all shadow-warm-xs flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add dish</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DISHES (Comprehensive structured layout) */}
      {activeView === 'dishes' && (
        <div className="space-y-4">
          {/* STICKY FILTER BAR (Sticky below 64px top bar) */}
          <div className="sticky top-16 z-10 bg-[#FFF9EF]/95 backdrop-blur-md py-2.5 border-b border-[#E4D7C0]/80 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 space-y-2">
            {/* Row 1: Food-type Segmented (All, Veg, Egg, Non-Veg, Jain) + Search + Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="bg-[#F1E8D8] p-1 rounded-xl flex items-center text-xs font-bold border border-[#E0D1B8] overflow-x-auto no-scrollbar">
                {(['all', 'veg', 'egg', 'nonveg', 'jain'] as const).map((t) => {
                  const label =
                    t === 'all'
                      ? `All (${dishes.length})`
                      : t === 'veg'
                      ? `Veg (${dishes.filter((d) => d.foodType === 'veg' || d.isVeg).length})`
                      : t === 'egg'
                      ? `Egg (${dishes.filter((d) => d.foodType === 'egg').length})`
                      : t === 'nonveg'
                      ? `Non-Veg (${dishes.filter((d) => d.foodType === 'nonveg' || (!d.isVeg && d.foodType !== 'egg')).length})`
                      : `Jain (${dishes.filter((d) => d.tags?.includes('jain')).length})`;

                  return (
                    <button
                      key={t}
                      onClick={() => setFoodTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-lg transition-all capitalize whitespace-nowrap ${
                        foodTypeFilter === t
                          ? 'bg-[#263D2D] text-white shadow-warm-xs'
                          : 'text-[#66523B] hover:text-[#2C1E14]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                {/* Search Box */}
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-[#8A7662] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search dishes or ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E4D7C0] bg-white text-xs text-[#2C1E14] focus:outline-none"
                  />
                </div>

                {/* Sort Select */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-[#E4D7C0] text-xs font-semibold text-[#2C1E14] py-1.5 px-2.5 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="category">Sort: Category</option>
                  <option value="price">Sort: Price (High to Low)</option>
                  <option value="portions">Sort: Volume</option>
                </select>

                {/* Show all ingredients toggle */}
                <button
                  type="button"
                  onClick={() => setExpandAllUnderDishes(!expandAllUnderDishes)}
                  className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                    expandAllUnderDishes
                      ? 'bg-[#263D2D] text-white border-[#263D2D]'
                      : 'bg-white text-[#66523B] border-[#E4D7C0]'
                  }`}
                  title="Toggle all recipes inline"
                >
                  {expandAllUnderDishes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Row 2: Horizontally scrollable Category Chips from Tree */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <Filter className="w-3.5 h-3.5 text-[#8A7662] shrink-0" />
              {['All', ...MENU_CATEGORIES_TREE.map((c) => c.name)].map((cat) => {
                const count =
                  cat === 'All'
                    ? dishes.length
                    : dishes.filter((d) => d.category.toLowerCase().includes(cat.toLowerCase()) || d.group === cat.toLowerCase()).length;

                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#263D2D] text-white shadow-warm-xs'
                        : 'bg-white border border-[#EBE1CF] text-[#66523B] hover:bg-[#F1E8D8]/60 hover:text-[#2C1E14]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F1E8D8] text-[#66523B]'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Summary line */}
          <div className="flex items-center justify-between text-xs text-[#8A7662] px-1">
            <span>Showing {filteredDishes.length} dishes matching criteria</span>
            <button onClick={toggleCollapseAll} className="hover:underline font-semibold">
              Collapse / Expand Sections
            </button>
          </div>

          {/* 2. BODY ORGANIZED IN EXACT REQUIRED STRUCTURE:
              1. FOOD: Vegetarian, Eggetarian, Non-Vegetarian
              2. DESSERTS
              3. BEVERAGES
          */}
          <div className="space-y-6">
            {/* SECTION 1A: VEGETARIAN FOOD */}
            {structuredSections.vegFood.length > 0 && (
              <div className="bg-[#FFFDF9] border border-[#E0D1B8] rounded-3xl p-5 sm:p-7 shadow-warm-xs space-y-4">
                <div
                  onClick={() => toggleSection('vegFood')}
                  className="flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 border-2 border-[#315B42] rounded-sm flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#315B42]" />
                    </span>
                    <h2 className="font-fraunces text-xl font-bold text-[#2C1E14]">
                      Vegetarian Cuisine
                    </h2>
                  </div>
                  <div className="flex-1 h-[1px] bg-[#E4D7C0] mx-3 hidden sm:block" />
                  <span className="text-xs font-bold text-[#8A7662] shrink-0">
                    {structuredSections.vegFood.length} dishes
                  </span>
                </div>

                {!collapsedSections['vegFood'] && (
                  <div className="divide-y divide-[#F1E8D8]">
                    {structuredSections.vegFood.map((dish, i) => renderDishRow(dish, i))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 1B: EGGETARIAN FOOD (Shown only if present) */}
            {structuredSections.eggFood.length > 0 && (
              <div className="bg-[#FFFDF9] border border-[#E0D1B8] rounded-3xl p-5 sm:p-7 shadow-warm-xs space-y-4">
                <div
                  onClick={() => toggleSection('eggFood')}
                  className="flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 border-2 border-[#B45309] rounded-sm flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#B45309]" />
                    </span>
                    <h2 className="font-fraunces text-xl font-bold text-[#2C1E14]">
                      Eggetarian Delicacies
                    </h2>
                  </div>
                  <div className="flex-1 h-[1px] bg-[#E4D7C0] mx-3 hidden sm:block" />
                  <span className="text-xs font-bold text-[#8A7662] shrink-0">
                    {structuredSections.eggFood.length} dishes
                  </span>
                </div>

                {!collapsedSections['eggFood'] && (
                  <div className="divide-y divide-[#F1E8D8]">
                    {structuredSections.eggFood.map((dish, i) => renderDishRow(dish, i))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 1C: NON-VEGETARIAN FOOD */}
            {structuredSections.nonvegFood.length > 0 && (
              <div className="bg-[#FFFDF9] border border-[#E0D1B8] rounded-3xl p-5 sm:p-7 shadow-warm-xs space-y-4">
                <div
                  onClick={() => toggleSection('nonvegFood')}
                  className="flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 border-2 border-[#C2410C] rounded-sm flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
                    </span>
                    <h2 className="font-fraunces text-xl font-bold text-[#2C1E14]">
                      Non-Vegetarian & Mughlai
                    </h2>
                  </div>
                  <div className="flex-1 h-[1px] bg-[#E4D7C0] mx-3 hidden sm:block" />
                  <span className="text-xs font-bold text-[#8A7662] shrink-0">
                    {structuredSections.nonvegFood.length} dishes
                  </span>
                </div>

                {!collapsedSections['nonvegFood'] && (
                  <div className="divide-y divide-[#F1E8D8]">
                    {structuredSections.nonvegFood.map((dish, i) => renderDishRow(dish, i))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 2: DESSERTS */}
            {structuredSections.desserts.length > 0 && (
              <div className="bg-[#FFFDF9] border border-[#E0D1B8] rounded-3xl p-5 sm:p-7 shadow-warm-xs space-y-4">
                <div
                  onClick={() => toggleSection('dessert')}
                  className="flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <h2 className="font-fraunces text-xl font-bold text-[#2C1E14]">
                    Mithai, Sweets & Desserts
                  </h2>
                  <div className="flex-1 h-[1px] bg-[#E4D7C0] mx-3 hidden sm:block" />
                  <span className="text-xs font-bold text-[#8A7662] shrink-0">
                    {structuredSections.desserts.length} items
                  </span>
                </div>

                {!collapsedSections['dessert'] && (
                  <div className="divide-y divide-[#F1E8D8]">
                    {structuredSections.desserts.map((dish, i) => renderDishRow(dish, i))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: BEVERAGES (Shown once, not split by veg/non-veg) */}
            {structuredSections.beverages.length > 0 && (
              <div className="bg-[#FFFDF9] border border-[#E0D1B8] rounded-3xl p-5 sm:p-7 shadow-warm-xs space-y-4">
                <div
                  onClick={() => toggleSection('beverage')}
                  className="flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <h2 className="font-fraunces text-xl font-bold text-[#2C1E14]">
                    Beverages & Coolers
                  </h2>
                  <div className="flex-1 h-[1px] bg-[#E4D7C0] mx-3 hidden sm:block" />
                  <span className="text-xs font-bold text-[#8A7662] shrink-0">
                    {structuredSections.beverages.length} items
                  </span>
                </div>

                {!collapsedSections['beverage'] && (
                  <div className="divide-y divide-[#F1E8D8]">
                    {structuredSections.beverages.map((dish, i) => renderDishRow(dish, i))}
                  </div>
                )}
              </div>
            )}

            {filteredDishes.length === 0 && (
              <EmptyState
                illustration={<MenuCardIllustration size={72} />}
                title="No dishes found"
                description="Try clearing your category or food-type filters to view the full menu."
                actionLabel="Reset Filters"
                onAction={() => {
                  setFoodTypeFilter('all');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: ALL INGREDIENTS (Merged Consolidated View) */}
      {activeView === 'ingredients' && (
        <div className="space-y-5">
          <div className="bg-[#FFFDF9] border border-[#E0D1B8] rounded-3xl p-5 sm:p-7 shadow-warm-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4D7C0] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#2C1E14] font-outfit">
                  Master Ingredient Ledger
                </h3>
                <p className="text-xs text-[#66523B]">
                  Consolidated monthly demand across all recipes and cheapest mandi rates
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/app/suppliers')}
                leftIcon={<Store className="w-4 h-4 text-[#2C1E14]" />}
              >
                Find Cheapest Suppliers &rarr;
              </Button>
            </div>

            {/* Ingredient Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ingredients.map((ing) => {
                const numDishesUsing = dishes.filter((d) =>
                  d.ingredients.some((di) => di.ingredientId === ing.id || di.ingredientName.toLowerCase().includes(ing.name.toLowerCase()))
                ).length;

                return (
                  <div
                    key={ing.id}
                    className="p-4 rounded-2xl bg-[#FFF9EF] border border-[#E4D7C0] hover:border-[#F8C45C] transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E4D7C0] flex items-center justify-center shrink-0">
                        {getIngredientIllustration(ing.name, ing.category, 28)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-[#2C1E14] truncate">{ing.name}</h4>
                        <span className="text-[10px] text-[#8A7662] block truncate">{ing.category}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-[#66523B] border-t border-[#E4D7C0]/60 pt-2">
                      <div className="flex justify-between">
                        <span>Used In:</span>
                        <strong className="text-[#2C1E14]">{numDishesUsing || 3} recipes</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Need:</span>
                        <strong className="text-[#2C1E14] font-mono">{ing.monthlyUsageQuantity} {ing.standardUnit}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Best Mandi Rate:</span>
                        <strong className="text-[#315B42] font-mono font-bold">₹{ing.bestCityPrice}/{ing.standardUnit}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/app/suppliers`)}
                      className="w-full py-1.5 rounded-xl bg-white border border-[#E4D7C0] hover:bg-[#F9F5EC] text-xs font-semibold text-[#2C1E14] transition-colors"
                    >
                      Compare Vendors
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: UPLOAD WORKSPACE */}
      {activeView === 'upload' && (
        <div className="bg-[#FFFDF9] border-2 border-dashed border-[#E0D1B8] hover:border-[#F8C45C] rounded-3xl p-6 sm:p-10 text-center transition-all shadow-warm-xs relative my-2">
          {isParsing ? (
            <div className="py-6 space-y-4 max-w-md mx-auto">
              <Mascot role="assistant" expression="thinking" size={60} />
              <h4 className="text-lg font-bold text-[#2C1E14]">AI Agent Parsing Menu Items...</h4>
              <p className="text-xs text-[#8A7662]">
                Extracting item names, portion weights, category tags, and ingredient associations.
              </p>
              <div className="w-full bg-[#F1E8D8] h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#315B42] transition-all duration-300 rounded-full"
                  style={{ width: `${parsingProgress}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-[#315B42]">{parsingProgress}% complete</span>
            </div>
          ) : (
            <div className="space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-full bg-[#FEF6E4] border border-[#F8C45C]/50 flex items-center justify-center text-[#8C5D08] mx-auto shadow-warm-xs">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2C1E14]">Upload Menu (PDF / Image / Excel)</h3>
                <p className="text-xs text-[#8A7662] mt-1">
                  Accepts printed menu photos, spreadsheets (XLSX, CSV), or high-res PDFs.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#263D2D] hover:bg-[#1C2E22] text-white text-xs font-bold transition-all shadow-warm-xs min-h-[44px] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#F8C45C]" />
                  <span>Browse Computer Files</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv"
                    className="hidden"
                    onChange={() => {
                      setIsParsing(true);
                      setTimeout(() => {
                        setIsParsing(false);
                        setActiveView('dishes');
                      }, 1800);
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setIsParsing(true);
                    setTimeout(() => {
                      setIsParsing(false);
                      setActiveView('dishes');
                    }, 1800);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#F8C45C] bg-[#FEF6E4] hover:bg-[#FDE9BE] text-[#8C5D08] text-xs font-bold transition-all min-h-[44px] flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Parse Sample Menu</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. STICKY PAGE ACTION BAR (96px right padding reserved) */}
      <div className="fixed bottom-20 lg:bottom-4 left-0 lg:left-[264px] right-0 z-30 pointer-events-none flex justify-center px-4">
        <div className="pointer-events-auto max-w-[760px] w-full bg-[#FFFDF9]/95 backdrop-blur-md border border-[#F8C45C] rounded-full shadow-warm-lg p-2.5 sm:p-3 pr-4 sm:pr-24 lg:pr-28 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#263D2D] text-white flex items-center justify-center text-xs font-black shrink-0">
              {activeView === 'ingredients' ? ingredients.length : dishes.length}
            </div>
            <div className="truncate">
              <span className="text-xs sm:text-sm font-bold text-[#263D2D] block leading-tight truncate">
                {activeView === 'ingredients'
                  ? `${ingredients.length} Commodities Mapped to Mandis`
                  : `${dishes.length} Dishes Ready for AI Sourcing`}
              </span>
              <span className="text-[11px] text-[#8A7662] hidden sm:block">
                Direct mandi price matching across Delhi APMC
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (activeView === 'ingredients') router.push('/app/suppliers');
              else router.push('/app/processing');
            }}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="shrink-0 font-bold"
          >
            {activeView === 'ingredients' ? 'Find Cheapest Suppliers' : 'Analyse with AI'}
          </Button>
        </div>
      </div>

      {/* 4. UPGRADED ADD / EDIT DISH MODAL (2-column desktop, bottom sheet mobile, locked with useScrollLock) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-[#2C1E14]/50 backdrop-blur-sm" />

          <div className="relative z-10 w-full sm:max-w-2xl bg-white border border-[#E4D7C0] rounded-t-[28px] sm:rounded-3xl shadow-warm-xl flex flex-col max-h-[90dvh] overflow-hidden">
            {/* Sticky Header */}
            <div className="p-4 sm:p-5 border-b border-[#F1E8D8] flex items-center justify-between bg-white shrink-0">
              <h3 className="text-lg font-bold text-[#2C1E14]">
                {editingDish ? 'Edit Dish & Recipe' : 'Add New Restaurant Dish'}
              </h3>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1E8D8] flex items-center justify-center text-[#66523B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body Only */}
            <form id="dish-form" onSubmit={handleSaveDish} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <Input
                label="Dish Name"
                required
                placeholder="e.g. Paneer Butter Masala"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />

              {/* 2-Column Grid for Category, Group, Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                  label="Menu Group"
                  value={formGroup}
                  onChange={(e) => setFormGroup(e.target.value as MenuGroup)}
                  options={[
                    { label: 'Food', value: 'food' },
                    { label: 'Dessert', value: 'dessert' },
                    { label: 'Beverage', value: 'beverage' },
                  ]}
                />

                <Select
                  label="Category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  options={MENU_CATEGORIES_TREE.filter((c) => c.group === formGroup).map((c) => ({
                    label: c.name,
                    value: c.name,
                  }))}
                />

                <Input
                  label="Subcategory"
                  placeholder="e.g. Tandoor & Kebabs"
                  value={formSubcategory}
                  onChange={(e) => setFormSubcategory(e.target.value)}
                />
              </div>

              {/* 3-way Food Type Selector: Veg | Egg | Non-Veg */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7662] mb-1.5">
                  Food Classification (Indian Standard)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormFoodType('veg');
                      setFormError(null);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 min-h-[44px] ${
                      formFoodType === 'veg'
                        ? 'bg-[#EAF3ED] border-[#315B42] text-[#315B42]'
                        : 'bg-white border-[#E4D7C0] text-[#8A7662]'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 border-2 border-[#315B42] rounded-sm flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#315B42]" />
                    </span>
                    <span>Veg</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormFoodType('egg');
                      setFormTags(formTags.filter((t) => t !== 'jain'));
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 min-h-[44px] ${
                      formFoodType === 'egg'
                        ? 'bg-[#FEF3C7] border-[#B45309] text-[#B45309]'
                        : 'bg-white border-[#E4D7C0] text-[#8A7662]'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 border-2 border-[#B45309] rounded-sm flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
                    </span>
                    <span>Egg</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormFoodType('nonveg');
                      setFormTags(formTags.filter((t) => t !== 'jain'));
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 min-h-[44px] ${
                      formFoodType === 'nonveg'
                        ? 'bg-[#FEE2E2] border-[#C2410C] text-[#C2410C]'
                        : 'bg-white border-[#E4D7C0] text-[#8A7662]'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 border-2 border-[#C2410C] rounded-sm flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
                    </span>
                    <span>Non-Veg</span>
                  </button>
                </div>
              </div>

              {/* Tag Toggles */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8A7662] mb-1.5">
                  Special Badges & Dietary Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'jain', label: 'Jain (No Root Veg)' },
                    { id: 'vegan', label: 'Vegan' },
                    { id: 'glutenFree', label: 'Gluten Free' },
                    { id: 'chefSpecial', label: "Chef's Special" },
                    { id: 'bestseller', label: 'Bestseller' },
                    { id: 'seasonal', label: 'Seasonal' },
                  ].map((tag) => {
                    const isSelected = formTags.includes(tag.id as DishTag);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          if (tag.id === 'jain' && (formFoodType === 'egg' || formFoodType === 'nonveg')) {
                            setFormError('Cannot mark non-veg or egg dishes as Jain.');
                            return;
                          }
                          setFormTags(
                            isSelected ? formTags.filter((t) => t !== tag.id) : [...formTags, tag.id as DishTag]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl border font-semibold text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#263D2D] text-white border-[#263D2D]'
                            : 'bg-white text-[#66523B] border-[#E4D7C0]'
                        }`}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price & Monthly portions */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Selling Price (₹)"
                  type="number"
                  required
                  placeholder="385"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                />

                <Input
                  label="Monthly Portions Sold"
                  type="number"
                  placeholder="400"
                  value={formPortions}
                  onChange={(e) => setFormPortions(e.target.value)}
                />
              </div>

              <Input
                label="Description & Recipe Notes"
                placeholder="e.g. Marinated cottage cheese in satin gravy"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </form>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-[#F1E8D8] bg-[#FFFDF9] flex items-center justify-end gap-3 shrink-0">
              <Button variant="ghost" size="md" type="button" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" form="dish-form">
                {editingDish ? 'Save Changes' : 'Add Dish to Menu'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#66523B]">Loading Menu & Ingredients Ledger...</div>}>
      <MenuManagementContent />
    </Suspense>
  );
}
