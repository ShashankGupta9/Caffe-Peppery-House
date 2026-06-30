const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config({ path: '.env.local' }); // Make sure dotenv is installed

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  // HOT COFFEE (8 items)
  {
    category: 'hot_coffee',
    name: 'Classic Espresso',
    description: 'Rich, bold espresso brewed from freshly roasted premium Arabica beans with a deep aroma and smooth finish.',
    price: 249,
    image_url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prep_time: 5,
    is_popular: true,
    is_available: true
  },
  {
    category: 'hot_coffee',
    name: 'Velvet Cappuccino',
    description: 'Perfectly balanced espresso topped with a thick layer of velvety steamed milk foam and cocoa dusting.',
    price: 289,
    image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prep_time: 7,
    is_popular: true,
    is_available: true
  },
  {
    category: 'hot_coffee',
    name: 'Vanilla Bean Latte',
    description: 'Smooth espresso combined with steamed milk and infused with real Madagascar vanilla bean syrup.',
    price: 320,
    image_url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prep_time: 6,
    is_popular: false,
    is_available: true
  },
  {
    category: 'hot_coffee',
    name: 'Australian Flat White',
    description: 'A stronger coffee-to-milk ratio featuring silky microfoam over a double shot of espresso.',
    price: 310,
    image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prep_time: 5,
    is_popular: true,
    is_available: true
  },
  {
    category: 'hot_coffee',
    name: 'Signature Mocha',
    description: 'Espresso mixed with premium dark chocolate ganache, steamed milk, and a touch of whipped cream.',
    price: 340,
    image_url: 'https://images.unsplash.com/photo-1578314675249-a6910e80a867?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prep_time: 8,
    is_popular: false,
    is_available: true
  },
  {
    category: 'hot_coffee',
    name: 'Long Black Americano',
    description: 'A double shot of robust espresso poured over hot water for a clean, intense coffee experience.',
    price: 220,
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    prep_time: 4,
    is_popular: false,
    is_available: true
  },
  {
    category: 'hot_coffee',
    name: 'Caramel Macchiato',
    description: 'Steamed milk stained with espresso and finished with a generous drizzle of buttery caramel.',
    price: 350,
    image_url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prep_time: 7,
    is_popular: true,
    is_available: true
  },
  {
    category: 'hot_coffee',
    name: 'Cortado',
    description: 'Equal parts espresso and warm milk, perfect for those who want a strong but smooth sip.',
    price: 260,
    image_url: 'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prep_time: 5,
    is_popular: false,
    is_available: true
  },

  // COLD COFFEE (8 items)
  {
    category: 'cold_coffee',
    name: 'Nitro Cold Brew',
    description: 'Our signature 18-hour cold brew infused with nitrogen for a creamy, stout-like texture.',
    price: 340,
    image_url: 'https://images.unsplash.com/photo-1517701550927-30cfcb64ac45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prep_time: 3,
    is_popular: true,
    is_available: true
  },
  {
    category: 'cold_coffee',
    name: 'Iced Vanilla Latte',
    description: 'Chilled espresso and milk over ice, sweetened with our house-made vanilla syrup.',
    price: 299,
    image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prep_time: 5,
    is_popular: true,
    is_available: true
  },
  {
    category: 'cold_coffee',
    name: 'Classic Frappe',
    description: 'Blended iced coffee with milk and a touch of sweetness, topped with whipped cream.',
    price: 320,
    image_url: 'https://images.unsplash.com/photo-1461023058943-0708f529982f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prep_time: 8,
    is_popular: false,
    is_available: true
  },
  {
    category: 'cold_coffee',
    name: 'Vietnamese Iced Coffee',
    description: 'Intense drip coffee poured over sweet condensed milk and lots of ice.',
    price: 310,
    image_url: 'https://images.unsplash.com/photo-1620087799732-c136365a6fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prep_time: 6,
    is_popular: true,
    is_available: true
  },
  {
    category: 'cold_coffee',
    name: 'Iced Mocha',
    description: 'Rich chocolate ganache mixed with espresso and cold milk over ice.',
    price: 330,
    image_url: 'https://images.unsplash.com/photo-1572119915852-598d9e761df8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prep_time: 6,
    is_popular: false,
    is_available: true
  },
  {
    category: 'cold_coffee',
    name: 'Caramel Frappuccino',
    description: 'Blended coffee beverage loaded with caramel syrup and topped with whipped cream.',
    price: 360,
    image_url: 'https://images.unsplash.com/photo-1662047484439-d8be92ed8b01?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prep_time: 8,
    is_popular: true,
    is_available: true
  },
  {
    category: 'cold_coffee',
    name: 'Iced Americano',
    description: 'Crisp, refreshing, and bold espresso poured over cold water and ice.',
    price: 240,
    image_url: 'https://images.unsplash.com/photo-1517702816995-171b7b752b5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    prep_time: 3,
    is_popular: false,
    is_available: true
  },
  {
    category: 'cold_coffee',
    name: 'Mint Cold Brew',
    description: 'Our smooth cold brew infused with fresh mint leaves for an extra refreshing kick.',
    price: 330,
    image_url: 'https://images.unsplash.com/photo-1593443320739-77f74939d0da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    prep_time: 4,
    is_popular: false,
    is_available: true
  },

  // SNACKS (8 items)
  {
    category: 'snacks',
    name: 'Avocado Toast',
    description: 'Mashed Hass avocado on toasted sourdough artisan bread with chili flakes and a drizzle of olive oil.',
    price: 320,
    image_url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prep_time: 10,
    is_popular: true,
    is_available: true
  },
  {
    category: 'snacks',
    name: 'Butter Croissant',
    description: 'Flaky, buttery, and baked fresh every morning. A true French classic.',
    price: 220,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prep_time: 2,
    is_popular: true,
    is_available: true
  },
  {
    category: 'snacks',
    name: 'Caprese Panini',
    description: 'Fresh mozzarella, ripe tomatoes, and basil pesto grilled perfectly on ciabatta bread.',
    price: 350,
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prep_time: 12,
    is_popular: false,
    is_available: true
  },
  {
    category: 'snacks',
    name: 'Truffle Fries',
    description: 'Crispy golden shoestring fries tossed with truffle oil and parmesan cheese.',
    price: 280,
    image_url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prep_time: 15,
    is_popular: true,
    is_available: true
  },
  {
    category: 'snacks',
    name: 'Smoked Salmon Bagel',
    description: 'Toasted everything bagel with cream cheese, smoked salmon, capers, and dill.',
    price: 390,
    image_url: 'https://images.unsplash.com/photo-1619623868661-bc8e727e4e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prep_time: 10,
    is_popular: true,
    is_available: true
  },
  {
    category: 'snacks',
    name: 'Classic Club Sandwich',
    description: 'Triple-decker sandwich with roasted chicken, bacon, lettuce, tomato, and mayo.',
    price: 360,
    image_url: 'https://images.unsplash.com/photo-1528735000313-039ec3a473f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    prep_time: 15,
    is_popular: false,
    is_available: true
  },
  {
    category: 'snacks',
    name: 'Spinach & Feta Quiche',
    description: 'Savory egg custard baked with wilted spinach and crumbly feta cheese in a butter crust.',
    price: 290,
    image_url: 'https://images.unsplash.com/photo-1627993090623-0975e53e6b7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prep_time: 8,
    is_popular: false,
    is_available: true
  },
  {
    category: 'snacks',
    name: 'Loaded Nachos',
    description: 'Crispy corn tortilla chips topped with melted cheese, jalapeños, salsa, and sour cream.',
    price: 310,
    image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prep_time: 12,
    is_popular: true,
    is_available: true
  },

  // DESSERTS (8 items)
  {
    category: 'desserts',
    name: 'New York Cheesecake',
    description: 'Dense, rich, and creamy baked cheesecake with a graham cracker crust and berry compote.',
    price: 350,
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prep_time: 5,
    is_popular: true,
    is_available: true
  },
  {
    category: 'desserts',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream.',
    price: 360,
    image_url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prep_time: 5,
    is_popular: true,
    is_available: true
  },
  {
    category: 'desserts',
    name: 'Fudgy Walnut Brownie',
    description: 'Gooey dark chocolate brownie loaded with roasted walnuts. Served warm.',
    price: 250,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prep_time: 6,
    is_popular: true,
    is_available: true
  },
  {
    category: 'desserts',
    name: 'Molten Lava Cake',
    description: 'Warm chocolate cake with a gooey, molten center. Served with a scoop of vanilla ice cream.',
    price: 380,
    image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prep_time: 12,
    is_popular: true,
    is_available: true
  },
  {
    category: 'desserts',
    name: 'Lemon Tart',
    description: 'Zesty and tangy lemon curd in a buttery, crumbly pastry shell.',
    price: 290,
    image_url: 'https://images.unsplash.com/photo-1519915028121-7d3463d20eb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prep_time: 5,
    is_popular: false,
    is_available: true
  },
  {
    category: 'desserts',
    name: 'Macaron Box (3 pcs)',
    description: 'Assortment of delicate French macarons: Pistachio, Raspberry, and Vanilla.',
    price: 320,
    image_url: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prep_time: 3,
    is_popular: true,
    is_available: true
  },
  {
    category: 'desserts',
    name: 'Caramel Panna Cotta',
    description: 'Silky smooth Italian cream dessert topped with rich caramel sauce.',
    price: 310,
    image_url: 'https://images.unsplash.com/photo-1594980596870-8caa52a79d83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    prep_time: 5,
    is_popular: false,
    is_available: true
  },
  {
    category: 'desserts',
    name: 'Blueberry Muffin',
    description: 'Oversized, fluffy muffin baked with wild blueberries and a crunchy streusel top.',
    price: 240,
    image_url: 'https://images.unsplash.com/photo-1557925923-33b251d59648?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prep_time: 3,
    is_popular: false,
    is_available: true
  }
];

async function seed() {
  console.log("Fetching categories...");
  const { data: categories, error: catError } = await supabase.from('menu_categories').select('id, slug');
  if (catError) {
    console.error("Error fetching categories:", catError);
    return;
  }

  const categoryMap = {};
  categories.forEach(c => categoryMap[c.slug] = c.id);

  console.log("Preparing to insert 32 new products...");
  
  // Clean up existing items so we don't duplicate
  const { error: delError } = await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delError) {
    console.error("Failed to clear old menu items:", delError);
  } else {
    console.log("Cleared old menu items.");
  }

  const mappedProducts = products.map(p => ({
    ...p,
    category_id: categoryMap[p.category]
  }));

  const { error } = await supabase.from('menu_items').insert(mappedProducts);

  if (error) {
    console.error("Failed to seed products:", error);
  } else {
    console.log("Successfully seeded 32 products into the database!");
  }
}

seed();
