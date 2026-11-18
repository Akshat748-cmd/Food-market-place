'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  UploadCloud,
  Search,
  Filter,
  Sparkles,
  X,
  Trash2,
  ArrowRight,
  Check,
  AlertCircle,
  Flame,
  Store,
  Layers,
  ChefHat,
  FileText,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';
import { Dish, FoodType, MenuGroup, DishTag, DishIngredient } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Mascot } from '@/components/ui/Mascot';
import { EmptyState } from '@/components/ui/EmptyState';
import { MenuCardIllustration } from '@/components/illustrations';
import { RawIngredientVisual, getIngredientIllustration } from '@/lib/ingredientVisuals';
import { useScrollLock } from '@/hooks/useScrollLock';

// Preset categories for clean single-row navigation
const MENU_CATEGORIES = [
  'All',
  'Starters',
  'Soups',
  'Main Course',
  'Rice & Biryani',
  'Indian Breads',
  'Desserts',
  'Beverages',
] as const;

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
    updateDishIngredientQuantity,
    addDishIngredient,
    removeDishIngredient,
    getCurrentRestaurant,
    menuFilter,
    setMenuFilter,
  } = useAppStore();

  const currentRestaurant = isHydrated ? getCurrentRestaurant() : null;

  // Primary navigation: 'dishes' | 'ingredients'
  const [activeTab, setActiveTab] = useState<'dishes' | 'ingredients'>(
    searchParams.get('tab') === 'ingredients' ? 'ingredients' : 'dishes'
  );

  // Category filter: single row
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Advanced Filter Popover state
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [foodTypeFilter, setFoodTypeFilter] = useState<'all' | 'veg' | 'egg' | 'nonveg' | 'jain'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price_desc' | 'price_asc' | 'portions_desc'>('name');

  // Right-side Ingredient Drawer state
  const [selectedDishForDrawer, setSelectedDishForDrawer] = useState<Dish | null>(null);

  // New Ingredient form state inside drawer
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [selectedIngredientToAdd, setSelectedIngredientToAdd] = useState(ingredients[0]?.id || '');
  const [newIngredientQty, setNewIngredientQty] = useState('0.15');

  // Modals state
  const [addDishModalOpen, setAddDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);

  // Lock scroll when modals or drawer are open
  useScrollLock(addDishModalOpen || uploadModalOpen || Boolean(selectedDishForDrawer));

  // Dish Form state
  const [formName, setFormName] = useState('');
  const [formGroup, setFormGroup] = useState<MenuGroup>('food');
  const [formCategory, setFormCategory] = useState('Main Course');
  const [formFoodType, setFormFoodType] = useState<FoodType>('veg');
  const [formPrice, setFormPrice] = useState('350');
  const [formDescription, setFormDescription] = useState('');
  const [formPortions, setFormPortions] = useState('300');
  const [formSpiceLevel, setFormSpiceLevel] = useState<number>(1);
  const [formTags, setFormTags] = useState<DishTag[]>([]);
  const [formImage, setFormImage] = useState(
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80'
  );

  // Helper to compute dish food cost percentage from raw ingredients
  const getDishFoodCostPercent = (dish: Dish) => {
    let recipeCost = 0;
    (dish.ingredients || []).forEach((di) => {
      const ing = ingredients.find((i) => i.id === di.ingredientId);
      const unitPrice = ing ? ing.bestCityPrice : 280;
      recipeCost += di.quantityPerPortion * unitPrice;
    });
    if (recipeCost === 0) {
      recipeCost = dish.price * 0.28;
    }
    return (recipeCost / Math.max(1, dish.price)) * 100;
  };

  // Keep drawer in sync with updated store dish
  const activeDrawerDish = useMemo(() => {
    if (!selectedDishForDrawer) return null;
    return dishes.find((d) => d.id === selectedDishForDrawer.id) || selectedDishForDrawer;
  }, [dishes, selectedDishForDrawer]);

  // Filtered and sorted dishes (respects both sidebar expandable filters and page controls)
  const filteredDishes = useMemo(() => {
    return dishes
      .filter((dish) => {
        // 1. Check Sidebar Menu Filters
        if (menuFilter?.activeKey === 'bestsellers') {
          if (!dish.tags?.includes('bestseller')) return false;
        } else if (menuFilter?.activeKey === 'category') {
          if (menuFilter.categoryValue && menuFilter.categoryValue !== 'All') {
            const cat = (dish.category || '').toLowerCase();
            const target = menuFilter.categoryValue.toLowerCase();
            const match =
              cat.includes(target) ||
              (target.includes('starter') && cat.includes('starter')) ||
              (target.includes('main') && cat.includes('main')) ||
              (target.includes('rice') && (cat.includes('rice') || cat.includes('biryani') || cat.includes('pulao'))) ||
              (target.includes('bread') && (cat.includes('bread') || cat.includes('roti') || cat.includes('naan'))) ||
              (target.includes('dessert') && (cat.includes('dessert') || cat.includes('sweet'))) ||
              (target.includes('beverage') && (cat.includes('beverage') || cat.includes('drink') || cat.includes('shake')));
            if (!match) return false;
          }
        } else if (menuFilter?.activeKey === 'ingredient_count') {
          const count = dish.ingredients?.length || 0;
          if (menuFilter.ingredientCountValue === '<=3' && count > 3) return false;
          if (menuFilter.ingredientCountValue === '4-6' && (count < 4 || count > 6)) return false;
          if (menuFilter.ingredientCountValue === '7+' && count < 7) return false;
        } else if (menuFilter?.activeKey === 'food_cost') {
          const fc = getDishFoodCostPercent(dish);
          if (menuFilter.foodCostValue === 'low' && fc >= 25) return false;
          if (menuFilter.foodCostValue === 'target' && (fc < 25 || fc > 30)) return false;
          if (menuFilter.foodCostValue === 'high' && fc <= 30) return false;
        } else if (menuFilter?.activeKey === 'status') {
          if (menuFilter.statusValue === 'inactive') return false;
        }

        // 2. In-page Category filter
        if (selectedCategory !== 'All') {
          const cat = dish.category.toLowerCase();
          const target = selectedCategory.toLowerCase();
          const match =
            cat.includes(target) ||
            (target === 'starters' && (cat.includes('starter') || cat.includes('appetizer'))) ||
            (target === 'soups' && cat.includes('soup')) ||
            (target === 'main course' && cat.includes('main')) ||
            (target === 'rice & biryani' && (cat.includes('rice') || cat.includes('biryani') || cat.includes('pulao'))) ||
            (target === 'indian breads' && (cat.includes('bread') || cat.includes('roti') || cat.includes('naan'))) ||
            (target === 'desserts' && (cat.includes('dessert') || cat.includes('sweet') || cat.includes('mithai'))) ||
            (target === 'beverages' && (cat.includes('beverage') || cat.includes('drink') || cat.includes('cooler')));
          if (!match) return false;
        }

        // 3. In-page Food classification filter (inside popover)
        const actualType = dish.foodType || (dish.isVeg ? 'veg' : 'nonveg');
        if (foodTypeFilter === 'veg' && actualType !== 'veg') return false;
        if (foodTypeFilter === 'egg' && actualType !== 'egg') return false;
        if (foodTypeFilter === 'nonveg' && actualType !== 'nonveg') return false;
        if (foodTypeFilter === 'jain') {
          const hasJain = dish.tags?.includes('jain') || dish.name.toLowerCase().includes('jain');
          if (!hasJain) return false;
        }

        // 4. In-page Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = dish.name.toLowerCase().includes(q);
          const matchDesc = dish.description.toLowerCase().includes(q);
          const matchIng = dish.ingredients.some((i) => i.ingredientName.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchIng) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'portions_desc') return b.portionsSoldPerMonth - a.portionsSoldPerMonth;
        return a.name.localeCompare(b.name);
      });
  }, [dishes, menuFilter, selectedCategory, foodTypeFilter, searchQuery, sortBy, ingredients]);

  // Active filter label description
  const activeSidebarFilterLabel = useMemo(() => {
    if (!menuFilter || menuFilter.activeKey === 'all') return null;
    if (menuFilter.activeKey === 'bestsellers') return 'Bestsellers';
    if (menuFilter.activeKey === 'category') return `Category: ${menuFilter.categoryValue || 'All'}`;
    if (menuFilter.activeKey === 'ingredient_count') {
      if (menuFilter.ingredientCountValue === '<=3') return '1 to 3 Ingredients';
      if (menuFilter.ingredientCountValue === '4-6') return '4 to 6 Ingredients';
      return '7+ Ingredients';
    }
    if (menuFilter.activeKey === 'food_cost') {
      if (menuFilter.foodCostValue === 'low') return 'Low Food Cost (< 25%)';
      if (menuFilter.foodCostValue === 'target') return 'Target Food Cost (25% - 30%)';
      return 'High Food Cost (> 30%)';
    }
    if (menuFilter.activeKey === 'status') {
      return menuFilter.statusValue === 'inactive' ? 'Archived / Seasonal' : 'Active Dishes';
    }
    return null;
  }, [menuFilter]);

  // Open Edit Dish Modal
  const handleOpenEditModal = (dish: Dish, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingDish(dish);
    setFormName(dish.name);
    setFormGroup(dish.group || 'food');
    setFormCategory(dish.category);
    setFormFoodType(dish.foodType || (dish.isVeg ? 'veg' : 'nonveg'));
    setFormPrice(String(dish.price));
    setFormDescription(dish.description || '');
    setFormPortions(String(dish.portionsSoldPerMonth || 200));
    setFormSpiceLevel(dish.spiceLevel || 1);
    setFormTags(dish.tags || []);
    setFormImage(
      dish.image ||
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
    );
    setAddDishModalOpen(true);
  };

  // Open Add Dish Modal
  const handleOpenAddModal = () => {
    setEditingDish(null);
    setFormName('');
    setFormGroup('food');
    setFormCategory('Main Course');
    setFormFoodType('veg');
    setFormPrice('320');
    setFormDescription('');
    setFormPortions('300');
    setFormSpiceLevel(1);
    setFormTags([]);
    setFormImage(
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
    );
    setAddDishModalOpen(true);
  };

  // Save Dish Form
  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const priceNum = Number(formPrice) || 250;
    const isVegBool = formFoodType === 'veg';

    if (editingDish) {
      updateDish({
        ...editingDish,
        name: formName.trim(),
        group: formGroup,
        category: formCategory,
        foodType: formFoodType,
        isVeg: isVegBool,
        price: priceNum,
        description: formDescription.trim(),
        portionsSoldPerMonth: Number(formPortions) || 200,
        spiceLevel: formSpiceLevel,
        tags: formTags,
        image: formImage,
      });
    } else {
      const newDish: Dish = {
        id: `dish-custom-${Date.now()}`,
        restaurantId: currentRestaurant?.id || 'rest-delhi-01',
        name: formName.trim(),
        group: formGroup,
        category: formCategory,
        foodType: formFoodType,
        isVeg: isVegBool,
        price: priceNum,
        description: formDescription.trim(),
        image: formImage,
        portionsSoldPerMonth: Number(formPortions) || 200,
        spiceLevel: formSpiceLevel,
        tags: formTags,
        ingredients: [
          {
            ingredientId: 'ing-paneer-01',
            ingredientName: 'Fresh Malai Paneer',
            quantityPerPortion: 0.18,
            unit: 'kg',
          },
          {
            ingredientId: 'ing-tomato-16',
            ingredientName: 'Salad Tomatoes',
            quantityPerPortion: 0.12,
            unit: 'kg',
          },
          {
            ingredientId: 'ing-ghee-desi-39',
            ingredientName: 'Pure Desi Ghee',
            quantityPerPortion: 0.02,
            unit: 'kg',
          },
        ],
      };
      addDish(newDish);
    }
    setAddDishModalOpen(false);
  };

  // Add ingredient to active drawer dish
  const handleAddIngredientToDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDrawerDish) return;
    const targetIng = ingredients.find((i) => i.id === selectedIngredientToAdd);
    if (!targetIng) return;

    const qty = parseFloat(newIngredientQty) || 0.1;
    addDishIngredient(activeDrawerDish.id, {
      ingredientId: targetIng.id,
      ingredientName: targetIng.name,
      quantityPerPortion: qty,
      unit: targetIng.standardUnit,
    });
    setIsAddingIngredient(false);
  };

  return (
    <div className="space-y-4 w-full max-w-[1600px] mx-auto pb-12">
      {/* 1. CLEAN HEADER (Heading, Subtitle, Summary Counters & Primary Action Buttons) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E4D7C0]/70 pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold font-fraunces text-[#2C1E14] tracking-tight">
              My Menu
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EAF3ED] border border-[#315B42]/20 text-[#315B42] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#315B42]" />
              {dishes.length} Dishes &bull; {ingredients.length} Ingredients
            </span>
          </div>
          <p className="text-xs text-[#66523B] mt-0.5 font-normal">
            Manage your restaurant dishes, recipes and ingredients.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          {/* Upload Menu Button (Prominent, Separate) */}
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#315B42]/30 bg-[#EAF3ED] hover:bg-[#d8ebd8] text-[#1D432B] text-xs font-bold transition-all shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#315B42]" />
            <span>Upload Menu</span>
          </button>

          {/* Add Dish Button (Golden Primary, Separate) */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F8C45C] hover:bg-[#eab348] text-[#263D2D] text-xs font-bold transition-all shadow-warm-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dish</span>
          </button>
        </div>
      </div>

      {/* 2. PRIMARY NAVIGATION (All Dishes vs All Ingredients) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="bg-[#F1E8D8] p-0.5 rounded-lg inline-flex items-center text-xs font-bold border border-[#E0D1B8] w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('dishes')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'dishes'
                ? 'bg-white text-[#263D2D] shadow-warm-xs'
                : 'text-[#66523B] hover:text-[#263D2D]'
            }`}
          >
            All Dishes ({dishes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ingredients')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'ingredients'
                ? 'bg-white text-[#263D2D] shadow-warm-xs'
                : 'text-[#66523B] hover:text-[#263D2D]'
            }`}
          >
            All Ingredients ({ingredients.length})
          </button>
        </div>

        {/* Search Bar + Advanced Filters Popover Trigger */}
        {activeTab === 'dishes' && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#8A7662] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search dishes or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E4D7C0] bg-white text-xs text-[#2C1E14] focus:outline-none focus:border-[#315B42] h-8"
              />
            </div>

            {/* Filter Popover Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterPopoverOpen(!filterPopoverOpen)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 h-8 transition-colors ${
                  foodTypeFilter !== 'all' || sortBy !== 'name'
                    ? 'bg-[#263D2D] text-white border-[#263D2D]'
                    : 'bg-white border-[#E4D7C0] text-[#66523B] hover:text-[#2C1E14]'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
                {foodTypeFilter !== 'all' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F8C45C]" />
                )}
              </button>

              {/* Advanced Filter Popover */}
              {filterPopoverOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white border border-[#E4D7C0] rounded-xl shadow-warm-xl p-3 z-30 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#F1E8D8]">
                    <span className="text-xs font-bold text-[#2C1E14]">Filter & Sort</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFoodTypeFilter('all');
                        setSortBy('name');
                      }}
                      className="text-[10px] text-[#315B42] font-semibold hover:underline"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Dietary Classification */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8A7662] mb-1">
                      Dietary Classification
                    </label>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      {[
                        { id: 'all', label: 'All Items' },
                        { id: 'veg', label: 'Vegetarian' },
                        { id: 'egg', label: 'Egg Only' },
                        { id: 'nonveg', label: 'Non-Veg' },
                        { id: 'jain', label: 'Jain Friendly' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFoodTypeFilter(item.id as any)}
                          className={`px-2 py-1 rounded text-left font-medium transition-colors ${
                            foodTypeFilter === item.id
                              ? 'bg-[#263D2D] text-white'
                              : 'bg-[#FFF9EF] text-[#66523B] hover:bg-[#F1E8D8]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#8A7662] mb-1">
                      Sort Dishes
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full bg-[#FFF9EF] border border-[#E4D7C0] rounded-lg p-1.5 text-xs text-[#2C1E14] font-medium focus:outline-none"
                    >
                      <option value="name">Alphabetical (A - Z)</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="portions_desc">Monthly Volume Sold</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFilterPopoverOpen(false)}
                    className="w-full py-1.5 rounded-lg bg-[#F8C45C] text-[#263D2D] text-xs font-bold hover:bg-[#eab348]"
                  >
                    Apply Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. CATEGORY NAVIGATION (Clean Single Row of Chips, No Stacking) */}
      {activeTab === 'dishes' && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {MENU_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#263D2D] text-white shadow-xs'
                    : 'bg-white border border-[#EBE1CF] text-[#66523B] hover:bg-[#F1E8D8]/60 hover:text-[#2C1E14]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Active Sidebar Filter notification */}
      {activeSidebarFilterLabel && activeTab === 'dishes' && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#FFF8E7] border border-[#F8C45C]/70 shadow-warm-xs text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
            <span className="font-medium text-[#66523B]">Sidebar Filter Applied:</span>
            <span className="font-bold text-[#263D2D] bg-white px-2 py-0.5 rounded-md border border-[#E4D7C0] shadow-2xs">
              {activeSidebarFilterLabel}
            </span>
            <span className="text-[#8A7662]">({filteredDishes.length} dishes matched)</span>
          </div>
          <button
            type="button"
            onClick={() => setMenuFilter({ activeKey: 'all', categoryValue: 'All' })}
            className="text-[11px] font-bold text-[#315B42] hover:text-[#1D432B] hover:underline shrink-0 ml-2"
          >
            Clear Filter &times;
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW A: ALL DISHES (Responsive 2/3-Column Card Grid — Clean & Uncluttered) */}
      {/* ========================================================================= */}
      {activeTab === 'dishes' && (
        <>
          {filteredDishes.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#E0D1B8] text-center">
              <EmptyState
                illustration={<MenuCardIllustration size={64} />}
                title="No dishes found"
                description="Try clearing your category or dietary filters to view the full menu."
                actionLabel="Reset Filters"
                onAction={() => {
                  setSelectedCategory('All');
                  setFoodTypeFilter('all');
                  setSearchQuery('');
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredDishes.map((dish) => {
                return (
                  <div
                    key={dish.id}
                    onClick={() => setSelectedDishForDrawer(dish)}
                    className="bg-white border border-[#E4D7C0] rounded-2xl p-4 hover:border-[#315B42]/50 hover:shadow-warm-xs transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* First row: Dish name and Bestseller badge on left, Price aligned to right */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-wrap">
                          <h3 className="font-bold text-sm sm:text-[15px] text-[#2C1E14] group-hover:text-[#315B42] transition-colors leading-snug">
                            {dish.name}
                          </h3>
                          {dish.tags?.includes('bestseller') && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full shrink-0">
                              Bestseller
                            </span>
                          )}
                        </div>
                        <span className="font-sans font-bold text-sm sm:text-base text-[#2C1E14] shrink-0">
                          {formatCurrency(dish.price)}
                        </span>
                      </div>

                      {/* Second row: Dish description */}
                      <p className="text-xs text-[#66523B] mt-1.5 leading-relaxed line-clamp-2">
                        {dish.description || 'Authentic kitchen recipe prepared fresh daily.'}
                      </p>
                    </div>

                    {/* Divider & Bottom row: Ingredient count on extreme left, Monthly portions on extreme right */}
                    <div className="mt-3 pt-3 border-t border-[#EFE5D3] flex items-center justify-between text-xs w-full">
                      <span className="text-[#315B42] font-semibold">
                        {dish.ingredients.length} Ingredients
                      </span>
                      <span className="text-[#66523B] font-medium">
                        {dish.portionsSoldPerMonth} portions/mo
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: ALL INGREDIENTS (Consolidated Master Ingredient Ledger) */}
      {/* ========================================================================= */}
      {activeTab === 'ingredients' && (
        <div className="bg-white border border-[#E0D1B8] rounded-2xl p-4 sm:p-5 shadow-warm-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1E8D8] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#2C1E14] font-fraunces">
                Master Kitchen Ingredient Ledger
              </h2>
              <p className="text-xs text-[#66523B]">
                Consolidated demand and lowest mandi prices across {ingredients.length} tracked commodities.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/app/suppliers')}
              leftIcon={<Store className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Compare Wholesale Suppliers &rarr;
            </Button>
          </div>

          {/* Clean Ingredient Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ingredients.map((ing) => {
              const usedInRecipes = dishes.filter((d) =>
                d.ingredients.some(
                  (di) =>
                    di.ingredientId === ing.id ||
                    di.ingredientName.toLowerCase().includes(ing.name.toLowerCase())
                )
              ).length;

              return (
                <div
                  key={ing.id}
                  className="p-3 rounded-xl bg-[#FFF9EF] border border-[#E4D7C0] hover:border-[#F8C45C] transition-all flex flex-col justify-between space-y-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#E4D7C0] flex items-center justify-center shrink-0">
                      {getIngredientIllustration(ing.name, ing.category, 22)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-[#2C1E14] truncate">{ing.name}</h4>
                      <span className="text-[10px] text-[#8A7662] block truncate">
                        {ing.category} &bull; Used in {usedInRecipes || 2} recipes
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 border-t border-[#E4D7C0]/60 pt-2 text-[#66523B]">
                    <div className="flex justify-between text-[11px]">
                      <span>Monthly Demand:</span>
                      <span className="font-mono font-bold text-[#2C1E14]">
                        {ing.monthlyUsageQuantity} {ing.standardUnit}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Best Mandi Rate:</span>
                      <span className="font-mono font-bold text-[#315B42]">
                        ₹{ing.bestCityPrice}/{ing.standardUnit}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push('/app/suppliers')}
                    className="w-full py-1 rounded-lg bg-white border border-[#E4D7C0] hover:bg-[#F9F5EC] text-xs font-semibold text-[#2C1E14] transition-colors"
                  >
                    View Mandi Suppliers
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. RIGHT-SIDE INGREDIENT RECIPE DRAWER (Opened on clicking any Dish card) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeDrawerDish && (
          <div className="fixed inset-0 z-50 flex justify-end p-2 sm:p-3 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedDishForDrawer(null);
                setIsAddingIngredient(false);
              }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 w-full sm:w-[390px] bg-white max-h-[calc(100vh-24px)] my-auto rounded-2xl shadow-2xl flex flex-col border border-[#E4D7C0] overflow-hidden pointer-events-auto"
            >
              {/* Drawer Sticky Header */}
              <div className="p-3 px-3.5 border-b border-[#F1E8D8] bg-[#FFF9EF] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF3ED] border border-[#315B42]/20 flex items-center justify-center shrink-0 text-[#315B42]">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm text-[#2C1E14] truncate">
                      {activeDrawerDish.name}
                    </h3>
                    <span className="text-[10px] text-[#8A7662]">
                      {activeDrawerDish.category} &bull; Selling at {formatCurrency(activeDrawerDish.price)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDishForDrawer(null);
                    setIsAddingIngredient(false);
                  }}
                  className="w-7 h-7 rounded-full bg-[#F1E8D8] hover:bg-[#E2D5BF] flex items-center justify-center text-[#66523B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Drawer Scrollable Body: Recipe Ingredients */}
              <div className="p-3 overflow-y-auto flex-1 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2C1E14]">
                      Recipe Ingredients ({activeDrawerDish.ingredients.length})
                    </h4>
                    <p className="text-[10px] text-[#8A7662]">
                      Formula per portion & monthly kitchen procurement need
                    </p>
                  </div>

                  {!isAddingIngredient && (
                    <button
                      type="button"
                      onClick={() => setIsAddingIngredient(true)}
                      className="px-2 py-1 rounded-md bg-[#263D2D] text-white text-[10px] font-bold hover:bg-[#315B42] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Ingredient
                    </button>
                  )}
                </div>

                {/* Add Ingredient Form Inside Drawer */}
                {isAddingIngredient && (
                  <form
                    onSubmit={handleAddIngredientToDish}
                    className="p-2.5 bg-[#FFF9EF] border border-[#F8C45C] rounded-xl space-y-2 text-xs"
                  >
                    <span className="font-bold text-[#2C1E14] block text-[11px]">
                      Add Commodity to Recipe
                    </span>
                    <select
                      value={selectedIngredientToAdd}
                      onChange={(e) => setSelectedIngredientToAdd(e.target.value)}
                      className="w-full bg-white border border-[#E4D7C0] rounded-lg p-1.5 text-xs text-[#2C1E14]"
                    >
                      {ingredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name} ({ing.standardUnit})
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Qty per portion"
                        value={newIngredientQty}
                        onChange={(e) => setNewIngredientQty(e.target.value)}
                        className="w-24 bg-white border border-[#E4D7C0] rounded-lg p-1.5 text-xs text-[#2C1E14]"
                      />
                      <button
                        type="submit"
                        className="flex-1 py-1.5 bg-[#315B42] text-white text-xs font-bold rounded-lg"
                      >
                        Add to Dish
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingIngredient(false)}
                        className="px-2 py-1.5 text-xs text-[#66523B]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Ingredients List */}
                <div className="divide-y divide-[#F1E8D8] border border-[#E4D7C0] rounded-xl overflow-hidden bg-[#FFFDF9]">
                  {activeDrawerDish.ingredients.map((ing, idx) => {
                    const monthlyUsage = Math.round(
                      ing.quantityPerPortion * (activeDrawerDish.portionsSoldPerMonth || 200) * 10
                    ) / 10;
                    const matchedIng = ingredients.find(
                      (i) =>
                        i.id === ing.ingredientId ||
                        i.name.toLowerCase() === ing.ingredientName.toLowerCase() ||
                        i.name.toLowerCase().includes(ing.ingredientName.toLowerCase())
                    );

                    return (
                      <div key={idx} className="p-2.5 space-y-1.5 hover:bg-[#FFF8EC]/60 transition-colors">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-md bg-white border border-[#E4D7C0] flex items-center justify-center shrink-0">
                              {getIngredientIllustration(ing.ingredientName, '', 16)}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-[#2C1E14] block truncate text-[11px]">
                                {ing.ingredientName}
                              </span>
                              <span className="text-[9px] text-[#8A7662]">
                                Monthly: {monthlyUsage} {ing.unit}
                              </span>
                            </div>
                          </div>

                          {/* Quantity Stepper & Remove */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="flex items-center border border-[#E4D7C0] rounded-md bg-white">
                              <button
                                type="button"
                                onClick={() => {
                                  const newQty = Math.max(0.01, Math.round((ing.quantityPerPortion - 0.02) * 100) / 100);
                                  updateDishIngredientQuantity(activeDrawerDish.id, ing.ingredientId, newQty);
                                }}
                                className="px-1.5 py-0.5 text-[#66523B] hover:text-[#2C1E14] text-[11px]"
                              >
                                -
                              </button>
                              <span className="px-1.5 font-mono text-[10px] font-semibold text-[#2C1E14]">
                                {ing.quantityPerPortion} {ing.unit}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newQty = Math.round((ing.quantityPerPortion + 0.02) * 100) / 100;
                                  updateDishIngredientQuantity(activeDrawerDish.id, ing.ingredientId, newQty);
                                }}
                                className="px-1.5 py-0.5 text-[#66523B] hover:text-[#2C1E14] text-[11px]"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeDishIngredient(activeDrawerDish.id, ing.ingredientId)}
                              className="w-5 h-5 rounded hover:bg-[#FEE2E2] text-[#C2410C] flex items-center justify-center"
                              title="Remove ingredient"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>

                        {/* Direct Compare Suppliers Action */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#F1E8D8]/80 text-[10px]">
                          <span className="text-[#8A7662]">
                            {matchedIng ? (
                              <>Mandi: <strong className="text-[#315B42]">₹{matchedIng.bestCityPrice}/{matchedIng.standardUnit}</strong></>
                            ) : (
                              'Live Mandi Rates'
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const targetId = matchedIng?.id || ing.ingredientId;
                              setSelectedDishForDrawer(null);
                              router.push(
                                `/app/suppliers?ingredientId=${encodeURIComponent(targetId)}&search=${encodeURIComponent(ing.ingredientName)}`
                              );
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF9EF] border border-[#315B42]/30 text-[#315B42] hover:bg-[#EAF3ED] font-bold transition-all shadow-2xs"
                            title={`Compare suppliers for ${ing.ingredientName}`}
                          >
                            <Store className="w-3 h-3 text-[#315B42]" />
                            <span>Compare Suppliers &rarr;</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recipe Cost Summary */}
                <div className="p-2.5 bg-[#EAF3ED] border border-[#315B42]/20 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-[#1D432B] text-[11px]">
                    <span>Monthly Portions Sold:</span>
                    <span className="font-mono">{activeDrawerDish.portionsSoldPerMonth} portions</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#1D432B] text-[11px]">
                    <span>Recipe Food Cost Est:</span>
                    <span className="font-mono font-bold text-[#315B42]">
                      ~29% of selling price
                    </span>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-2.5 px-3 border-t border-[#F1E8D8] bg-[#FFF9EF] flex items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEditModal(activeDrawerDish);
                    setSelectedDishForDrawer(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#E4D7C0] bg-white text-xs font-semibold text-[#2C1E14] hover:bg-[#F9F5EC]"
                >
                  Edit Dish Details
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDishForDrawer(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#263D2D] text-white text-xs font-bold hover:bg-[#315B42]"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. ADD / EDIT DISH MODAL */}
      {/* ========================================================================= */}
      {addDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div onClick={() => setAddDishModalOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />

          <div className="relative z-10 w-full sm:max-w-lg bg-white border border-[#E4D7C0] rounded-2xl shadow-warm-xl flex flex-col max-h-[90dvh] overflow-hidden">
            {/* Header */}
            <div className="p-3.5 border-b border-[#F1E8D8] flex items-center justify-between bg-white shrink-0">
              <h3 className="text-sm sm:text-base font-bold text-[#2C1E14]">
                {editingDish ? 'Edit Dish Recipe' : 'Add New Restaurant Dish'}
              </h3>
              <button
                type="button"
                onClick={() => setAddDishModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F1E8D8] flex items-center justify-center text-[#66523B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Form Body */}
            <form id="dish-form" onSubmit={handleSaveDish} className="p-4 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#66523B] mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paneer Butter Masala"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2 border border-[#E4D7C0] rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#66523B] mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2 border border-[#E4D7C0] rounded-lg text-xs"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Rice & Biryani">Rice & Biryani</option>
                    <option value="Indian Breads">Indian Breads</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#66523B] mb-1">Classification</label>
                  <select
                    value={formFoodType}
                    onChange={(e) => setFormFoodType(e.target.value as FoodType)}
                    className="w-full p-2 border border-[#E4D7C0] rounded-lg text-xs"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="egg">Egg</option>
                    <option value="nonveg">Non-Veg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#66523B] mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full p-2 border border-[#E4D7C0] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#66523B] mb-1">Monthly Portions</label>
                  <input
                    type="number"
                    value={formPortions}
                    onChange={(e) => setFormPortions(e.target.value)}
                    className="w-full p-2 border border-[#E4D7C0] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#66523B] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description for guests and kitchen notes..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2 border border-[#E4D7C0] rounded-lg text-xs"
                />
              </div>
            </form>

            {/* Footer */}
            <div className="p-3 border-t border-[#F1E8D8] bg-[#FFF9EF] flex items-center justify-end gap-2 shrink-0">
              <Button variant="ghost" size="sm" type="button" onClick={() => setAddDishModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" form="dish-form">
                {editingDish ? 'Save Changes' : 'Add Dish'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DEDICATED MENU UPLOAD MODAL */}
      {/* ========================================================================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            onClick={() => !isParsing && setUploadModalOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full sm:max-w-md bg-white border border-[#E4D7C0] rounded-2xl shadow-warm-xl flex flex-col max-h-[90dvh] overflow-hidden">
            <div className="p-3.5 border-b border-[#F1E8D8] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EAF3ED] border border-[#315B42]/20 flex items-center justify-center text-[#1D432B]">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2C1E14]">Upload Menu</h3>
                  <p className="text-[10px] text-[#8A7662]">AI extraction for PDF, photo, Excel or CSV</p>
                </div>
              </div>
              <button
                type="button"
                disabled={isParsing}
                onClick={() => setUploadModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F1E8D8] flex items-center justify-center text-[#66523B]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3">
              {isParsing ? (
                <div className="py-6 space-y-3 text-center">
                  <Mascot role="assistant" expression="thinking" size={40} />
                  <div>
                    <h4 className="text-sm font-bold text-[#2C1E14]">Extracting Recipes & Ingredients...</h4>
                    <p className="text-[11px] text-[#8A7662] mt-0.5">
                      Matching dishes to wholesale mandi commodities
                    </p>
                  </div>
                  <div className="w-full bg-[#F1E8D8] h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                    <div
                      className="h-full bg-[#315B42] transition-all duration-300 rounded-full"
                      style={{ width: `${parsingProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="border-2 border-dashed border-[#E0D1B8] hover:border-[#315B42] rounded-xl p-6 text-center cursor-pointer transition-all bg-[#FFFDF9] hover:bg-[#F9F5EC] flex flex-col items-center justify-center gap-2 group block">
                    <FileText className="w-6 h-6 text-[#8C5D08]" />
                    <span className="text-xs font-bold text-[#2C1E14]">Choose menu file or drag here</span>
                    <span className="text-[10px] text-[#8A7662]">PDF, JPG/PNG photo, or Excel (.xlsx)</span>
                    <span className="px-3 py-1 rounded bg-[#263D2D] text-white text-[11px] font-semibold mt-1">
                      Browse Files
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv"
                      className="hidden"
                      onChange={() => {
                        setIsParsing(true);
                        setParsingProgress(30);
                        setTimeout(() => setParsingProgress(70), 500);
                        setTimeout(() => setParsingProgress(100), 1000);
                        setTimeout(() => {
                          setIsParsing(false);
                          setUploadModalOpen(false);
                        }, 1300);
                      }}
                    />
                  </label>

                  <div className="bg-[#FFF9EF] border border-[#E4D7C0] rounded-xl p-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#8C5D08]" />
                      <span className="text-xs font-semibold text-[#2C1E14]">
                        Or parse sample bistro menu (Instant demo)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsParsing(true);
                        setParsingProgress(40);
                        setTimeout(() => setParsingProgress(80), 500);
                        setTimeout(() => setParsingProgress(100), 900);
                        setTimeout(() => {
                          setIsParsing(false);
                          setUploadModalOpen(false);
                        }, 1200);
                      }}
                      className="px-2.5 py-1 rounded bg-[#FEF6E4] border border-[#F8C45C] text-[#8C5D08] text-[11px] font-bold"
                    >
                      Parse Demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#66523B]">Loading Menu...</div>}>
      <MenuManagementContent />
    </Suspense>
  );
}
