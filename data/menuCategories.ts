export interface MenuSubcategory {
  id: string;
  name: string;
}

export interface MenuCategoryNode {
  id: string;
  name: string;
  group: 'food' | 'dessert' | 'beverage';
  subcategories: MenuSubcategory[];
}

export const MENU_CATEGORIES_TREE: MenuCategoryNode[] = [
  // 1. FOOD
  {
    id: 'starters',
    name: 'Starters & Appetizers',
    group: 'food',
    subcategories: [
      { id: 'veg-starters', name: 'Veg Starters' },
      { id: 'nonveg-starters', name: 'Non-Veg Starters' },
      { id: 'tandoor-kebabs', name: 'Tandoor & Kebabs' },
    ],
  },
  {
    id: 'soups-salads',
    name: 'Soups & Salads',
    group: 'food',
    subcategories: [
      { id: 'soups', name: 'Soups' },
      { id: 'salads', name: 'Salads & Kachumber' },
    ],
  },
  {
    id: 'main-course',
    name: 'Main Course',
    group: 'food',
    subcategories: [
      { id: 'paneer-veg', name: 'Paneer & Veg Gravies' },
      { id: 'dal-kadhi', name: 'Dal & Kadhi' },
      { id: 'chicken-mains', name: 'Chicken' },
      { id: 'mutton-mains', name: 'Mutton' },
      { id: 'seafood-mains', name: 'Fish & Seafood' },
      { id: 'egg-mains', name: 'Egg Dishes' },
    ],
  },
  {
    id: 'rice-biryani',
    name: 'Rice, Biryani & Pulao',
    group: 'food',
    subcategories: [
      { id: 'biryani', name: 'Dum Biryani' },
      { id: 'pulao-jeera', name: 'Pulao & Steamed Rice' },
    ],
  },
  {
    id: 'breads',
    name: 'Indian Breads',
    group: 'food',
    subcategories: [
      { id: 'naan', name: 'Naan & Kulcha' },
      { id: 'roti-paratha', name: 'Tandoori Roti & Paratha' },
    ],
  },
  {
    id: 'thalis-combos',
    name: 'Thalis & Combos',
    group: 'food',
    subcategories: [
      { id: 'royal-thalis', name: 'Royal Thalis' },
      { id: 'lunch-combos', name: 'Lunch Combos' },
    ],
  },
  {
    id: 'chinese-asian',
    name: 'Chinese & Indo-Chinese',
    group: 'food',
    subcategories: [
      { id: 'momos-dimsums', name: 'Momos & Dimsums' },
      { id: 'noodles-rice', name: 'Fried Rice & Hakka Noodles' },
      { id: 'manchurian', name: 'Manchurian & Gravies' },
    ],
  },
  {
    id: 'continental',
    name: 'Continental',
    group: 'food',
    subcategories: [
      { id: 'pizza', name: 'Wood-fired Pizza' },
      { id: 'pasta', name: 'Pasta & Risotto' },
      { id: 'burgers-wraps', name: 'Burgers & Wraps' },
    ],
  },
  {
    id: 'south-indian',
    name: 'South Indian',
    group: 'food',
    subcategories: [
      { id: 'dosa-uttapam', name: 'Dosa & Uttapam' },
      { id: 'idli-vada', name: 'Idli & Vada' },
    ],
  },
  {
    id: 'chaat-street',
    name: 'Chaat & Street Food',
    group: 'food',
    subcategories: [
      { id: 'delhi-chaat', name: 'Delhi Chaat' },
      { id: 'tikki-golgappa', name: 'Tikki & Golgappe' },
    ],
  },
  {
    id: 'breakfast-brunch',
    name: 'Breakfast & Brunch',
    group: 'food',
    subcategories: [
      { id: 'desi-nashta', name: 'Desi Nashta' },
      { id: 'eggs-toast', name: 'Eggs & Toast' },
    ],
  },
  {
    id: 'sides',
    name: 'Sides & Accompaniments',
    group: 'food',
    subcategories: [
      { id: 'raita', name: 'Raita' },
      { id: 'papad-pickles', name: 'Papad, Chutney & Pickles' },
    ],
  },
  {
    id: 'kids-menu',
    name: 'Kids Menu',
    group: 'food',
    subcategories: [
      { id: 'kids-bites', name: 'Mild Bites & Fries' },
    ],
  },

  // 2. DESSERTS
  {
    id: 'desserts',
    name: 'Desserts & Sweets',
    group: 'dessert',
    subcategories: [
      { id: 'indian-sweets', name: 'Indian Sweets' },
      { id: 'ice-cream-cakes', name: 'Ice Cream & Cakes' },
    ],
  },

  // 3. BEVERAGES
  {
    id: 'beverages',
    name: 'Beverages',
    group: 'beverage',
    subcategories: [
      { id: 'hot-brews', name: 'Tea & Coffee (Hot)' },
      { id: 'cold-coffee-shakes', name: 'Cold Coffee & Shakes' },
      { id: 'fresh-juices-smoothies', name: 'Fresh Juices & Smoothies' },
      { id: 'mocktails-coolers', name: 'Mocktails & Desi Coolers' },
      { id: 'soft-drinks-water', name: 'Soft Drinks & Soda' },
    ],
  },
];
