/* ==========================================================================
   GOLDEN PIZZA CAFE — MENU DATA
   Prices sourced directly from the cafe's menu boards (Menu A / B / C).
   Do not invent or alter prices — edit only from a verified menu update.
   ========================================================================== */

// Each item: id, name, category, desc, icon (emoji tile, no stock photos used),
// and either `price` (single size) or `sizes` [{ label, price }] for S/M/L pizzas.
const MENU_ITEMS = [

  /* ---------------- PIZZA — Single Topping (one size) ---------------- */
  { id: "p01", name: "Tomato Pizza", category: "PIZZA", desc: "Classic base topped with fresh tomato.", icon: "🍕", price: 59 },
  { id: "p02", name: "Capsicum Pizza", category: "PIZZA", desc: "Loaded with crisp capsicum.", icon: "🍕", price: 59 },
  { id: "p03", name: "Onion Pizza", category: "PIZZA", desc: "Simple and classic onion topping.", icon: "🍕", price: 59 },
  { id: "p04", name: "Sweet Corn Pizza", category: "PIZZA", desc: "Golden sweet corn on cheesy base.", icon: "🍕", price: 59 },

  /* ---------------- PIZZA — Double Topping (S/M/L) ---------------- */
  { id: "p05", name: "Onion + Capsicum Pizza", category: "PIZZA", desc: "Onion and capsicum double topping.", icon: "🍕",
    sizes: [{ label: "Small", price: 79 }, { label: "Medium", price: 149 }, { label: "Large", price: 240 }] },
  { id: "p06", name: "Corn + Tomato Pizza", category: "PIZZA", desc: "Sweet corn and juicy tomato.", icon: "🍕",
    sizes: [{ label: "Small", price: 79 }, { label: "Medium", price: 149 }, { label: "Large", price: 240 }] },
  { id: "p07", name: "Jalapeno + Corn Pizza", category: "PIZZA", desc: "Spicy jalapeno with sweet corn.", icon: "🍕",
    sizes: [{ label: "Small", price: 79 }, { label: "Medium", price: 149 }, { label: "Large", price: 240 }] },
  { id: "p08", name: "Paneer + Corn Pizza", category: "PIZZA", desc: "Soft paneer cubes with sweet corn.", icon: "🍕",
    sizes: [{ label: "Small", price: 99 }, { label: "Medium", price: 179 }, { label: "Large", price: 259 }] },
  { id: "p09", name: "Paneer + Onion Pizza", category: "PIZZA", desc: "Paneer and onion double topping.", icon: "🍕",
    sizes: [{ label: "Small", price: 99 }, { label: "Medium", price: 179 }, { label: "Large", price: 259 }] },

  /* ---------------- PIZZA — Veg Mix Pizza (S/M/L) ---------------- */
  { id: "p10", name: "Cheese Margherita", category: "PIZZA", desc: "Extra cheese, classic margherita.", icon: "🍕",
    sizes: [{ label: "Small", price: 99 }, { label: "Medium", price: 149 }, { label: "Large", price: 249 }] },
  { id: "p11", name: "Fresh Veggie", category: "PIZZA", desc: "Onion + capsicum + tomato.", icon: "🍕",
    sizes: [{ label: "Small", price: 120 }, { label: "Medium", price: 179 }, { label: "Large", price: 279 }] },
  { id: "p12", name: "Tandoori Paneer", category: "PIZZA", desc: "Onion + capsicum + corn + tomato + paneer + black olives.", icon: "🍕",
    sizes: [{ label: "Small", price: 149 }, { label: "Medium", price: 199 }, { label: "Large", price: 299 }] },
  { id: "p13", name: "Farm House", category: "PIZZA", desc: "Onion + capsicum + corn + mushroom.", icon: "🍕",
    sizes: [{ label: "Small", price: 149 }, { label: "Medium", price: 199 }, { label: "Large", price: 349 }] },
  { id: "p14", name: "Peppy Paneer", category: "PIZZA", desc: "Onion + capsicum + paneer + red paprika.", icon: "🍕",
    sizes: [{ label: "Small", price: 149 }, { label: "Medium", price: 199 }, { label: "Large", price: 349 }] },
  { id: "p15", name: "Paneer Makhni", category: "PIZZA", desc: "Onion + capsicum + paneer, makhni base.", icon: "🍕",
    sizes: [{ label: "Small", price: 149 }, { label: "Medium", price: 199 }, { label: "Large", price: 349 }] },
  { id: "p16", name: "Exotica", category: "PIZZA", desc: "Tomato + corn + jalapeno + black olives + capsicum.", icon: "🍕",
    sizes: [{ label: "Small", price: 149 }, { label: "Medium", price: 220 }, { label: "Large", price: 349 }] },
  { id: "p17", name: "Paneer Chipotle", category: "PIZZA", desc: "Onion + capsicum + paneer, chipotle style.", icon: "🍕",
    sizes: [{ label: "Small", price: 149 }, { label: "Medium", price: 199 }, { label: "Large", price: 349 }] },
  { id: "p18", name: "Family Special", category: "PIZZA", desc: "Onion + capsicum + tomato + jalapeno + black olives + paneer.", icon: "🍕",
    sizes: [{ label: "Small", price: 149 }, { label: "Medium", price: 199 }, { label: "Large", price: 349 }] },
  { id: "p19", name: "Yam Dum Extra Cheese", category: "PIZZA", desc: "Onion + capsicum + tomato + corn + jalapeno, extra cheese.", icon: "🍕",
    sizes: [{ label: "Small", price: 149 }, { label: "Medium", price: 220 }, { label: "Large", price: 399 }] },
  { id: "p20", name: "Veg Extra Vanzza Extra Topping", category: "PIZZA", desc: "Onion + capsicum + tomato + jalapeno + black olives, extra topping.", icon: "🍕",
    sizes: [{ label: "Small", price: 149 }, { label: "Medium", price: 220 }, { label: "Large", price: 399 }] },

  /* ---------------- SANDWICH ---------------- */
  { id: "s01", name: "Veg Sandwich", category: "SANDWICH", desc: "Fresh vegetables, grilled to order.", icon: "🥪", price: 69 },
  { id: "s02", name: "American Veg Sandwich", category: "SANDWICH", desc: "Loaded American-style veg sandwich.", icon: "🥪", price: 79 },
  { id: "s03", name: "Tandoori Paneer Sandwich", category: "SANDWICH", desc: "Tandoori spiced paneer filling.", icon: "🥪", price: 99 },
  { id: "s04", name: "Paneer Makhni Sandwich", category: "SANDWICH", desc: "Rich makhni paneer filling.", icon: "🥪", price: 120 },
  { id: "s05", name: "Paneer Chipotle Sandwich", category: "SANDWICH", desc: "Smoky chipotle paneer filling.", icon: "🥪", price: 120 },
  { id: "s06", name: "Golden Pizza Special Sandwich", category: "SANDWICH", desc: "The house special, loaded sandwich.", icon: "🥪", price: 130 },

  /* ---------------- BURGER ---------------- */
  { id: "b01", name: "Veg Burger", category: "BURGER", desc: "Classic veg patty burger.", icon: "🍔", price: 39 },
  { id: "b02", name: "Aloo Tikki Burger", category: "BURGER", desc: "Spiced potato tikki patty.", icon: "🍔", price: 49 },
  { id: "b03", name: "Veg Tikki Burger", category: "BURGER", desc: "Loaded veg tikki burger.", icon: "🍔", price: 59 },
  { id: "b04", name: "Paneer Burger", category: "BURGER", desc: "Grilled paneer patty burger.", icon: "🍔", price: 69 },
  { id: "b05", name: "Tandoori Burger", category: "BURGER", desc: "Tandoori spiced patty burger.", icon: "🍔", price: 69 },
  { id: "b06", name: "Makhni Burger", category: "BURGER", desc: "Rich makhni sauce burger.", icon: "🍔", price: 79 },

  /* ---------------- PASTA ---------------- */
  { id: "pa01", name: "White Sauce Pasta", category: "PASTA", desc: "Creamy white sauce pasta.", icon: "🍝", price: 79 },
  { id: "pa02", name: "Red Sauce Pasta", category: "PASTA", desc: "Classic tangy red sauce pasta.", icon: "🍝", price: 89 },
  { id: "pa03", name: "Mix Sauce Pasta", category: "PASTA", desc: "Red and white sauce, mixed.", icon: "🍝", price: 120 },
  { id: "pa04", name: "Makhni Sauce Pasta", category: "PASTA", desc: "Rich makhni sauce pasta.", icon: "🍝", price: 149 },
  { id: "pa05", name: "Tandoori Sauce Pasta", category: "PASTA", desc: "Smoky tandoori sauce pasta.", icon: "🍝", price: 149 },

  /* ---------------- MOMOS ---------------- */
  { id: "m01", name: "Steam Momos", category: "MOMOS", desc: "Soft steamed veg momos.", icon: "🥟", price: 59 },
  { id: "m02", name: "Fried Momos", category: "MOMOS", desc: "Crispy fried veg momos.", icon: "🥟", price: 69 },
  { id: "m03", name: "Gravy Momos", category: "MOMOS", desc: "Momos tossed in spicy gravy.", icon: "🥟", price: 99 },

  /* ---------------- NOODLES ---------------- */
  { id: "n01", name: "Chinese Noodle", category: "NOODLES", desc: "Classic Chinese-style veg noodles.", icon: "🍜", price: 59 },
  { id: "n02", name: "Paneer Noodles", category: "NOODLES", desc: "Noodles tossed with paneer.", icon: "🍜", price: 79 },
  { id: "n03", name: "Manchurian", category: "NOODLES", desc: "Noodles with Manchurian gravy.", icon: "🍜", price: 79 },
  { id: "n04", name: "Chilli Potato", category: "NOODLES", desc: "Crispy chilli potato tossed in sauce.", icon: "🍜", price: 89 },

  /* ---------------- MAGGIE ---------------- */
  { id: "mg01", name: "Plain Maggie", category: "MAGGIE", desc: "Simple masala Maggie.", icon: "🍲", price: 39 },
  { id: "mg02", name: "Veg Maggie", category: "MAGGIE", desc: "Maggie loaded with fresh veggies.", icon: "🍲", price: 49 },
  { id: "mg03", name: "Spice Tadka Maggie", category: "MAGGIE", desc: "Extra spicy tadka Maggie.", icon: "🍲", price: 59 },
  { id: "mg04", name: "Maggie Mania", category: "MAGGIE", desc: "The loaded house-special Maggie.", icon: "🍲", price: 69 },

  /* ---------------- SHAKES ---------------- */
  { id: "sh01", name: "Banana Shake", category: "SHAKES", desc: "Thick fresh banana shake.", icon: "🥤", price: 49 },
  { id: "sh02", name: "Strawberry Shake", category: "SHAKES", desc: "Creamy strawberry shake.", icon: "🥤", price: 59 },
  { id: "sh03", name: "Blue Berry Shake", category: "SHAKES", desc: "Rich blueberry shake.", icon: "🥤", price: 69 },
  { id: "sh04", name: "Butter Scotch Shake", category: "SHAKES", desc: "Butterscotch flavoured shake.", icon: "🥤", price: 69 },
  { id: "sh05", name: "Oreo Shake", category: "SHAKES", desc: "Loaded Oreo cookie shake.", icon: "🥤", price: 79 },

  /* ---------------- COFFEE ---------------- */
  { id: "c01", name: "Hot Coffee", category: "COFFEE", desc: "Freshly brewed hot coffee.", icon: "☕", price: 39 },
  { id: "c02", name: "Cold Coffee", category: "COFFEE", desc: "Chilled classic cold coffee.", icon: "☕", price: 59 },
  { id: "c03", name: "Cold Coffee + Ice Cream", category: "COFFEE", desc: "Cold coffee topped with ice cream.", icon: "☕", price: 79 },

  /* ---------------- MOJITO / MOCKTAIL ---------------- */
  { id: "mj01", name: "Strawberry Mojito", category: "MOJITO", desc: "Refreshing strawberry mocktail.", icon: "🍹", price: 49 },
  { id: "mj02", name: "Mint Mojito", category: "MOJITO", desc: "Classic mint mojito.", icon: "🍹", price: 59 },
  { id: "mj03", name: "Green Apple Mojito", category: "MOJITO", desc: "Crisp green apple mocktail.", icon: "🍹", price: 69 },
  { id: "mj04", name: "Lemon Tea", category: "MOJITO", desc: "Refreshing chilled lemon tea.", icon: "🍹", price: 69 },

  /* ---------------- STARTERS ---------------- */
  { id: "st01", name: "French Fries", category: "STARTERS", desc: "Crispy golden french fries.", icon: "🍟", price: 69 },
  { id: "st02", name: "Piri Piri Fries", category: "STARTERS", desc: "Fries tossed in piri piri seasoning.", icon: "🍟", price: 79 },
  { id: "st03", name: "Cheese Fries", category: "STARTERS", desc: "Fries loaded with melted cheese.", icon: "🍟", price: 99 },
];

// Category display order (must match spec)
const CATEGORIES = ["ALL", "PIZZA", "BURGER", "SANDWICH", "PASTA", "MOMOS", "NOODLES", "MAGGIE", "SHAKES", "COFFEE", "MOJITO", "STARTERS"];

// Cafe details used across the site
const CAFE_INFO = {
  name: "Golden Pizza Cafe",
  tagline: "Hot & Delicious Pizza in Bahal",
  address: "Golden Pizza Cafe, near Barmdat Dharamshala / Nagori Mirch Masala, Pilani Road, Bahal (Bhiwani)",
  phone: "917027218194",
  phoneDisplay: "+91 70272 18194",
  instagram: "golden_pizza_bahal",
  email: "goldenpizzamgmt@gmail.com",
  upiId: "vamit3421-3@okaxis",
  // Approximate town-centre coordinates for Bahal, Bhiwani (Haryana).
  // Replace with the cafe's exact pin if you have it, for more accurate distance calculation.
  lat: 28.6297,
  lng: 75.6178,
  freeDeliveryKm: 5,
  perKmCharge: 10,
};
