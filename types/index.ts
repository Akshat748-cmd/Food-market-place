export type CityId =
  | 'delhi-ncr'
  | 'mumbai'
  | 'bengaluru'
  | 'hyderabad'
  | 'chennai'
  | 'kolkata'
  | 'pune'
  | 'ahmedabad'
  | 'jaipur'
  | 'lucknow'
  | 'chandigarh'
  | 'indore';

export interface City {
  id: CityId;
  name: string;
  state: string;
  activeSuppliersCount: number;
  avgSavingsPercent: number;
}

export interface Outlet {
  id: string;
  restaurantId: string;
  name: string;
  address: string;
  cityId: CityId;
  phone: string;
  managerName: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  cityId: CityId;
  outlets: Outlet[];
  activeOutletId: string;
  monthlyRevenue: number;
  currentFoodCostPercentage: number;
  targetFoodCostPercentage: number;
  coverImage: string;
  currency: string;
}

export type UnitType = 'kg' | 'g' | 'L' | 'ml' | 'bunch' | 'pcs' | 'box';

export interface DishIngredient {
  ingredientId: string;
  ingredientName: string;
  quantityPerPortion: number;
  unit: UnitType;
}

export type FoodType = 'veg' | 'egg' | 'nonveg';
export type MenuGroup = 'food' | 'dessert' | 'beverage';
export type DishTag =
  | 'jain'
  | 'vegan'
  | 'glutenFree'
  | 'containsNuts'
  | 'chefSpecial'
  | 'bestseller'
  | 'seasonal';

export interface DishVariant {
  name: string;
  price: number;
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  category: string;
  subcategory?: string;
  group?: MenuGroup;
  foodType?: FoodType;
  price: number;
  isVeg: boolean;
  description: string;
  image: string;
  portionsSoldPerMonth: number;
  ingredients: DishIngredient[];
  tags?: DishTag[];
  spiceLevel?: number; // 0 to 3
  variants?: DishVariant[];
  isAvailable?: boolean;
}

export type IngredientCategory =
  | 'Dairy & Paneer'
  | 'Poultry & Meat'
  | 'Vegetables & Fresh Produce'
  | 'Spices & Seasonings'
  | 'Grains, Flours & Pulses'
  | 'Oils & Ghee'
  | 'Sauces & Condiments'
  | 'Bakery & Packaging';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  standardUnit: UnitType;
  currentAvgPrice: number;
  userCurrentPrice?: number;
  bestCityPrice: number;
  bestSupplierId: string;
  bestSupplierName: string;
  monthlyUsageQuantity: number;
  potentialSavingsMonthly: number;
  qualityGrade: 'A+' | 'A' | 'B+';
  tags: string[];
}

export type SupplierType = 'mandi' | 'wholesaler' | 'b2b_platform' | 'retail';

export interface Supplier {
  id: string;
  name: string;
  type: SupplierType;
  cityId: CityId;
  address: string;
  phone: string;
  rating: number; // e.g. 4.8
  reviewCount: number;
  onTimeDeliveryRate: number; // e.g. 98%
  minOrderValue: number; // e.g. 2000
  deliveryTime?: string;
  deliveryFee?: number;
  minOrderQty?: number;
  categoriesSold?: string[];
  badge?: string;
  verified: boolean;
}

export interface SupplierPrice {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierType: SupplierType;
  ingredientId: string;
  cityId: CityId;
  price: number;
  unit: UnitType;
  moq: number;
  deliveryDays: string;
  qualityScore: number; // 1-100
  updatedDate: string;
  isBestPrice: boolean;
}

export interface Alert {
  id: string;
  type: 'price_drop' | 'price_spike' | 'savings_opportunity' | 'order_delay';
  title: string;
  message: string;
  date: string;
  severity: 'info' | 'warning' | 'success';
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
}

export interface ShoppingListItem {
  id: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: UnitType;
  targetSupplierId: string;
  targetSupplierName: string;
  estPricePerUnit: number;
  totalCost: number;
  isCompleted: boolean;
  category: IngredientCategory;
}

export interface WastageLog {
  id: string;
  ingredientId: string;
  ingredientName: string;
  date: string;
  quantity: number;
  unit: UnitType;
  reason: 'spoilage' | 'prep_loss' | 'over_portioning' | 'expired';
  costLost: number;
}
