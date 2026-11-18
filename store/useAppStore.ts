import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  CityId,
  Restaurant,
  Outlet,
  Dish,
  DishIngredient,
  Ingredient,
  City,
  Supplier,
  SupplierPrice,
  Alert,
  ShoppingListItem,
  WastageLog,
} from '@/types';
import {
  CITIES,
  RESTAURANTS,
  DISHES,
  INGREDIENTS,
  SUPPLIERS,
  SUPPLIER_PRICES,
  ALERTS,
  INITIAL_SHOPPING_LIST,
} from '@/data/mockData';

export interface OnboardingProfile {
  restaurantName: string;
  ownerName: string;
  phone: string;
  email: string;
  restaurantType: 'dine_in' | 'cafe' | 'cloud_kitchen' | 'chain';
  cityId: CityId;
  cuisines: string[];
  outletsCount: number;
  monthlyPortions: number;
}

export type MenuFilterKey =
  | 'all'
  | 'bestsellers'
  | 'category'
  | 'ingredient_count'
  | 'food_cost'
  | 'status';

export interface MenuFilterState {
  activeKey: MenuFilterKey;
  categoryValue?: string;
  ingredientCountValue?: '<=3' | '4-6' | '7+';
  foodCostValue?: 'low' | 'target' | 'high';
  statusValue?: 'active' | 'inactive';
}

interface AppState {
  // Current selections
  selectedCityId: CityId;
  selectedOutletId: string;
  selectedRestaurantId: string;
  language: 'en' | 'hi';

  // Data collections
  cities: City[];
  restaurants: Restaurant[];
  dishes: Dish[];
  ingredients: Ingredient[];
  suppliers: Supplier[];
  supplierPrices: SupplierPrice[];
  alerts: Alert[];
  shoppingList: ShoppingListItem[];
  wastageLogs: WastageLog[];

  // Onboarding & Processing flags
  onboardingProfile: OnboardingProfile | null;
  isProcessingComplete: boolean;

  // UI state
  isAssistantOpen: boolean;
  isHydrated: boolean;

  // Authentication & Restaurant Session
  isAuthenticated: boolean;
  currentUser: {
    name: string;
    email: string;
    role: string;
    phone: string;
  } | null;
  login: (restaurantId?: string, email?: string) => void;
  logout: () => void;

  // Menu Sidebar Filter Dropdown State
  menuFilter: MenuFilterState;
  isMenuExpanded: boolean;
  setMenuFilter: (filter: Partial<MenuFilterState>) => void;
  toggleMenuExpanded: () => void;
  setMenuExpanded: (expanded: boolean) => void;

  // Actions
  setCity: (cityId: CityId) => void;
  setOutlet: (outletId: string) => void;
  setRestaurant: (restaurantId: string) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  setOnboardingProfile: (profile: OnboardingProfile) => void;
  setProcessingComplete: (val: boolean) => void;
  addDish: (dish: Dish) => void;
  updateDish: (dish: Dish) => void;
  deleteDish: (dishId: string) => void;
  setDishes: (dishes: Dish[]) => void;
  updateDishIngredientQuantity: (dishId: string, ingredientId: string, newQty: number) => void;
  addDishIngredient: (dishId: string, ingredient: DishIngredient) => void;
  removeDishIngredient: (dishId: string, ingredientId: string) => void;
  toggleAssistant: () => void;
  setAssistantOpen: (open: boolean) => void;
  markAlertRead: (id: string) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'date' | 'read'>) => void;
  toggleShoppingItem: (id: string) => void;
  updateShoppingItemQuantity: (id: string, qty: number) => void;
  addShoppingItem: (item: Omit<ShoppingListItem, 'id'>) => void;
  removeShoppingItem: (id: string) => void;
  clearShoppingList: () => void;
  addWastageLog: (log: Omit<WastageLog, 'id' | 'date'>) => void;
  addOutlet: (outlet: Omit<Outlet, 'id' | 'restaurantId'>) => void;
  rateSupplier: (supplierId: string, rating: number, note?: string) => void;
  applySubstitution: (originalId: string, substituteId: string, substituteName: string, newPrice: number) => void;
  updateIngredientUserPrice: (id: string, price: number) => void;
  resetDemoData: () => void;
  setHydrated: (val: boolean) => void;

  // Computed helper getters
  getCurrentRestaurant: () => Restaurant;
  getCurrentCity: () => City;
  getTotalSavingsMonthly: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedCityId: 'delhi-ncr',
      selectedOutletId: 'out-delhi-cp',
      selectedRestaurantId: 'rest-delhi-01',
      language: 'en',

      cities: CITIES,
      restaurants: RESTAURANTS,
      dishes: DISHES,
      ingredients: INGREDIENTS,
      suppliers: SUPPLIERS,
      supplierPrices: SUPPLIER_PRICES,
      alerts: ALERTS,
      shoppingList: INITIAL_SHOPPING_LIST,
      wastageLogs: [
        { id: 'w-1', ingredientId: 'ing-tomato-16', ingredientName: 'Salad Tomatoes', date: 'Yesterday', quantity: 12, unit: 'kg', reason: 'spoilage', costLost: 336 },
        { id: 'w-2', ingredientId: 'ing-paneer-01', ingredientName: 'Fresh Malai Paneer', date: '3 days ago', quantity: 5, unit: 'kg', reason: 'prep_loss', costLost: 1425 },
        { id: 'w-3', ingredientId: 'ing-onion-15', ingredientName: 'Nashik Red Onions', date: '5 days ago', quantity: 15, unit: 'kg', reason: 'spoilage', costLost: 465 },
      ],

      onboardingProfile: null,
      isProcessingComplete: true,
      isAssistantOpen: false,
      isHydrated: false,

      // Authentication
      isAuthenticated: true,
      currentUser: {
        name: 'Vikramaditya Sharma',
        email: 'owner@delhihaveli.in',
        role: 'Restaurant Owner & Executive Chef',
        phone: '+91 98201 45892',
      },

      login: (restaurantId?: string, email?: string) => {
        const targetRestId = restaurantId || 'rest-delhi-01';
        const found = get().restaurants.find((r) => r.id === targetRestId) || get().restaurants[0];
        const defaultName =
          found.name === 'Golden Dragon Cafe'
            ? 'Chef Chen Wei'
            : found.name === 'Delhi Haveli'
            ? 'Vikramaditya Sharma'
            : 'Anita Deshmukh';

        set({
          isAuthenticated: true,
          selectedRestaurantId: found.id,
          selectedCityId: found.cityId,
          selectedOutletId: found.activeOutletId || found.outlets[0]?.id || '',
          currentUser: {
            name: defaultName,
            email: email || `owner@${found.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
            role: 'Restaurant Owner & Executive Chef',
            phone: '+91 98201 45892',
          },
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
        });
      },

      // Menu Filter State
      menuFilter: {
        activeKey: 'all',
        categoryValue: 'All',
        ingredientCountValue: undefined,
        foodCostValue: undefined,
        statusValue: 'active',
      },
      isMenuExpanded: true,

      setMenuFilter: (filter: Partial<MenuFilterState>) =>
        set((state) => ({
          menuFilter: { ...state.menuFilter, ...filter },
        })),

      toggleMenuExpanded: () =>
        set((state) => ({ isMenuExpanded: !state.isMenuExpanded })),

      setMenuExpanded: (expanded: boolean) =>
        set({ isMenuExpanded: expanded }),

      setCity: (cityId: CityId) => set({ selectedCityId: cityId }),
      setOutlet: (outletId: string) => set({ selectedOutletId: outletId }),
      setLanguage: (lang: 'en' | 'hi') => set({ language: lang }),

      setRestaurant: (restaurantId: string) => {
        const found = get().restaurants.find((r) => r.id === restaurantId);
        if (found) {
          set({
            selectedRestaurantId: restaurantId,
            selectedCityId: found.cityId,
            selectedOutletId: found.activeOutletId || found.outlets[0]?.id || '',
          });
        }
      },

      setOnboardingProfile: (profile: OnboardingProfile) => {
        const newRestId = `rest-${Date.now()}`;
        const newOutletId = `out-${Date.now()}-01`;

        const newRestaurant: Restaurant = {
          id: newRestId,
          name: profile.restaurantName || 'New Restaurant Partner',
          cuisine: profile.cuisines?.join(', ') || 'Multi-Cuisine',
          cityId: profile.cityId,
          activeOutletId: newOutletId,
          monthlyRevenue: (profile.monthlyPortions || 4000) * 320,
          currentFoodCostPercentage: 32.5,
          targetFoodCostPercentage: 28.0,
          coverImage:
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          currency: 'INR',
          outlets: [
            {
              id: newOutletId,
              restaurantId: newRestId,
              name: `${profile.restaurantName || 'Flagship'} Outlet 1`,
              address: `City Center, ${(profile.cityId || 'delhi-ncr').replace('-', ' ').toUpperCase()}`,
              cityId: profile.cityId,
              phone: profile.phone || '+91 98000 00000',
              managerName: profile.ownerName || 'Head Chef',
            },
          ],
        };

        // Link dishes to this newly created restaurant
        const starterDishes = get().dishes.map((d) => ({
          ...d,
          restaurantId: newRestId,
        }));

        set((state) => ({
          onboardingProfile: profile,
          selectedRestaurantId: newRestId,
          selectedOutletId: newOutletId,
          selectedCityId: profile.cityId,
          restaurants: [newRestaurant, ...state.restaurants],
          dishes: starterDishes,
          isAuthenticated: true,
          currentUser: {
            name: profile.ownerName || 'Restaurant Owner',
            email: profile.email || 'owner@restaurant.in',
            role: 'Owner & Executive Chef',
            phone: profile.phone || '',
          },
        }));
      },

      setProcessingComplete: (val: boolean) => set({ isProcessingComplete: val }),

      addDish: (dish: Dish) => set((state) => ({ dishes: [dish, ...state.dishes] })),
      updateDish: (dish: Dish) =>
        set((state) => ({
          dishes: state.dishes.map((d) => (d.id === dish.id ? dish : d)),
        })),
      deleteDish: (dishId: string) =>
        set((state) => ({
          dishes: state.dishes.filter((d) => d.id !== dishId),
        })),
      setDishes: (dishes: Dish[]) => set({ dishes }),

      updateDishIngredientQuantity: (dishId: string, ingredientId: string, newQty: number) =>
        set((state) => ({
          dishes: state.dishes.map((dish) => {
            if (dish.id !== dishId) return dish;
            return {
              ...dish,
              ingredients: dish.ingredients.map((ing) =>
                ing.ingredientId === ingredientId
                  ? { ...ing, quantityPerPortion: Math.max(0.001, Number(newQty.toFixed(3))) }
                  : ing
              ),
            };
          }),
        })),

      addDishIngredient: (dishId: string, ingredient: DishIngredient) =>
        set((state) => ({
          dishes: state.dishes.map((dish) => {
            if (dish.id !== dishId) return dish;
            const exists = dish.ingredients.some((i) => i.ingredientId === ingredient.ingredientId);
            if (exists) return dish;
            return {
              ...dish,
              ingredients: [...dish.ingredients, ingredient],
            };
          }),
        })),

      removeDishIngredient: (dishId: string, ingredientId: string) =>
        set((state) => ({
          dishes: state.dishes.map((dish) => {
            if (dish.id !== dishId) return dish;
            return {
              ...dish,
              ingredients: dish.ingredients.filter((i) => i.ingredientId !== ingredientId),
            };
          }),
        })),

      toggleAssistant: () => set((state) => ({ isAssistantOpen: !state.isAssistantOpen })),
      setAssistantOpen: (open: boolean) => set({ isAssistantOpen: open }),

      markAlertRead: (id: string) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
        })),

      addAlert: (alert) =>
        set((state) => ({
          alerts: [
            {
              ...alert,
              id: `alert-${Date.now()}`,
              date: 'Just now',
              read: false,
            },
            ...state.alerts,
          ],
        })),

      toggleShoppingItem: (id: string) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
          ),
        })),

      updateShoppingItemQuantity: (id: string, qty: number) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.id === id ? { ...item, quantity: qty, totalCost: qty * item.estPricePerUnit } : item
          ),
        })),

      addShoppingItem: (item) =>
        set((state) => ({
          shoppingList: [
            ...state.shoppingList,
            { ...item, id: `shop-item-${Date.now()}` },
          ],
        })),

      removeShoppingItem: (id: string) =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => item.id !== id),
        })),

      clearShoppingList: () => set({ shoppingList: [] }),

      addWastageLog: (log) =>
        set((state) => ({
          wastageLogs: [
            {
              ...log,
              id: `w-${Date.now()}`,
              date: 'Today',
            },
            ...state.wastageLogs,
          ],
        })),

      addOutlet: (outlet) =>
        set((state) => {
          const currentRest = state.restaurants.find((r) => r.id === state.selectedRestaurantId) || state.restaurants[0];
          const newOutlet: Outlet = {
            ...outlet,
            id: `out-${Date.now()}`,
            restaurantId: currentRest.id,
          };
          const updatedRest = {
            ...currentRest,
            outlets: [...currentRest.outlets, newOutlet],
          };
          return {
            restaurants: state.restaurants.map((r) => (r.id === currentRest.id ? updatedRest : r)),
          };
        }),

      rateSupplier: (supplierId: string, rating: number) =>
        set((state) => ({
          suppliers: state.suppliers.map((s) =>
            s.id === supplierId
              ? { ...s, rating: Number(((s.rating * s.reviewCount + rating) / (s.reviewCount + 1)).toFixed(1)), reviewCount: s.reviewCount + 1 }
              : s
          ),
        })),

      applySubstitution: (originalId, substituteId, substituteName, newPrice) =>
        set((state) => ({
          ingredients: state.ingredients.map((ing) =>
            ing.id === originalId
              ? {
                  ...ing,
                  name: `${ing.name} (${substituteName} Blend)`,
                  bestCityPrice: newPrice,
                  potentialSavingsMonthly: ing.potentialSavingsMonthly + 4200,
                }
              : ing
          ),
        })),

      updateIngredientUserPrice: (id: string, price: number) =>
        set((state) => ({
          ingredients: state.ingredients.map((ing) =>
            ing.id === id ? { ...ing, userCurrentPrice: price } : ing
          ),
        })),

      resetDemoData: () =>
        set({
          selectedCityId: 'delhi-ncr',
          selectedOutletId: 'out-delhi-cp',
          selectedRestaurantId: 'rest-delhi-01',
          language: 'en',
          cities: CITIES,
          restaurants: RESTAURANTS,
          dishes: DISHES,
          ingredients: INGREDIENTS,
          suppliers: SUPPLIERS,
          supplierPrices: SUPPLIER_PRICES,
          alerts: ALERTS,
          shoppingList: INITIAL_SHOPPING_LIST,
          wastageLogs: [
            { id: 'w-1', ingredientId: 'ing-tomato-16', ingredientName: 'Salad Tomatoes', date: 'Yesterday', quantity: 12, unit: 'kg', reason: 'spoilage', costLost: 336 },
            { id: 'w-2', ingredientId: 'ing-paneer-01', ingredientName: 'Fresh Malai Paneer', date: '3 days ago', quantity: 5, unit: 'kg', reason: 'prep_loss', costLost: 1425 },
          ],
          onboardingProfile: null,
          isProcessingComplete: true,
          isAssistantOpen: false,
          isAuthenticated: true,
          menuFilter: {
            activeKey: 'all',
            categoryValue: 'All',
            ingredientCountValue: undefined,
            foodCostValue: undefined,
            statusValue: 'active',
          },
          isMenuExpanded: true,
          currentUser: {
            name: 'Vikramaditya Sharma',
            email: 'owner@delhihaveli.in',
            role: 'Restaurant Owner & Executive Chef',
            phone: '+91 98201 45892',
          },
        }),

      setHydrated: (val: boolean) => set({ isHydrated: val }),

      getCurrentRestaurant: () => {
        const { restaurants, selectedRestaurantId } = get();
        return restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];
      },

      getCurrentCity: () => {
        const { cities, selectedCityId } = get();
        return cities.find((c) => c.id === selectedCityId) || cities[0];
      },

      getTotalSavingsMonthly: () => {
        return 62500;
      },
    }),
    {
      name: 'food-market-hub-storage',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState || version < 2) {
          return {
            ...persistedState,
            dishes: DISHES,
            ingredients: INGREDIENTS,
            suppliers: SUPPLIERS,
            supplierPrices: SUPPLIER_PRICES,
          };
        }
        return persistedState;
      },
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
