-- ============================================
-- PEPPERY HOUSE — Complete Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  email TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('dine_in', 'delivery')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled')),
  table_number TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_charge NUMERIC(10,2) DEFAULT 0,
  gst_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('razorpay','cash_on_delivery','cash_at_counter','qr_code')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  guest_name TEXT,
  guest_phone TEXT,
  delivery_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_order NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_id TEXT,
  method TEXT,
  amount NUMERIC(10,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, menu_item_id)
);

-- Delivery agents
CREATE TABLE IF NOT EXISTS delivery_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  current_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_agents ENABLE ROW LEVEL SECURITY;

-- Menu is public read
CREATE POLICY "Menu categories are public" ON menu_categories FOR SELECT USING (TRUE);
CREATE POLICY "Menu items are public" ON menu_items FOR SELECT USING (is_available = TRUE);

-- Users can read/update their own data
CREATE POLICY "Users read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders: users see own, guests see by ID
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (TRUE);

-- Order items
CREATE POLICY "Read order items" ON order_items FOR SELECT USING (TRUE);
CREATE POLICY "Create order items" ON order_items FOR INSERT WITH CHECK (TRUE);

-- Reviews
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies (service role bypasses RLS)

-- ============================================
-- SEED DATA — Menu Categories & Items
-- ============================================

INSERT INTO menu_categories (name, sort_order) VALUES
  ('Hot Coffee', 1),
  ('Cold Coffee', 2),
  ('Snacks', 3),
  ('Desserts', 4)
ON CONFLICT DO NOTHING;

-- Hot Coffee (6 items)
INSERT INTO menu_items (category_id, name, description, price) 
SELECT id, 'Classic Espresso', 'Pure, bold shot of freshly ground arabica beans', 180 FROM menu_categories WHERE name = 'Hot Coffee'
UNION ALL
SELECT id, 'Caramel Latte', 'Smooth espresso with steamed milk and house caramel syrup', 280 FROM menu_categories WHERE name = 'Hot Coffee'
UNION ALL
SELECT id, 'Cappuccino', 'Perfect ratio of espresso, steamed milk and silky foam', 240 FROM menu_categories WHERE name = 'Hot Coffee'
UNION ALL
SELECT id, 'Filter Coffee', 'Traditional South Indian decoction with warm milk', 160 FROM menu_categories WHERE name = 'Hot Coffee'
UNION ALL
SELECT id, 'Hazelnut Mocha', 'Espresso with dark chocolate and hazelnut, topped with cream', 320 FROM menu_categories WHERE name = 'Hot Coffee'
UNION ALL
SELECT id, 'Masala Chai Latte', 'House-spiced chai with frothy steamed milk', 200 FROM menu_categories WHERE name = 'Hot Coffee'
ON CONFLICT DO NOTHING;

-- Cold Coffee (6 items)
INSERT INTO menu_items (category_id, name, description, price)
SELECT id, 'Cold Brew', '18-hour steeped cold brew served over ice', 260 FROM menu_categories WHERE name = 'Cold Coffee'
UNION ALL
SELECT id, 'Iced Caramel Macchiato', 'Layered vanilla, milk, espresso and caramel drizzle', 320 FROM menu_categories WHERE name = 'Cold Coffee'
UNION ALL
SELECT id, 'Frappuccino', 'Blended coffee with milk, ice and whipped cream', 300 FROM menu_categories WHERE name = 'Cold Coffee'
UNION ALL
SELECT id, 'Iced Mocha', 'Cold espresso with chocolate sauce over ice', 280 FROM menu_categories WHERE name = 'Cold Coffee'
UNION ALL
SELECT id, 'Nitro Cold Brew', 'Nitrogen-infused cold brew — velvety smooth', 340 FROM menu_categories WHERE name = 'Cold Coffee'
UNION ALL
SELECT id, 'Vietnamese Iced Coffee', 'Strong drip coffee with sweetened condensed milk on ice', 240 FROM menu_categories WHERE name = 'Cold Coffee'
ON CONFLICT DO NOTHING;

-- Snacks (6 items)
INSERT INTO menu_items (category_id, name, description, price)
SELECT id, 'Butter Croissant', 'Freshly baked, flaky layers with golden butter', 160 FROM menu_categories WHERE name = 'Snacks'
UNION ALL
SELECT id, 'Club Sandwich', 'Triple-decker with grilled chicken, lettuce and tomato', 280 FROM menu_categories WHERE name = 'Snacks'
UNION ALL
SELECT id, 'Cheese Toast', 'Thick-cut sourdough with melted cheddar and herbs', 200 FROM menu_categories WHERE name = 'Snacks'
UNION ALL
SELECT id, 'Veg Puff', 'Spiced potato and vegetable filling in crispy pastry', 120 FROM menu_categories WHERE name = 'Snacks'
UNION ALL
SELECT id, 'Paneer Wrap', 'Grilled paneer with mint chutney and crispy veggies', 240 FROM menu_categories WHERE name = 'Snacks'
UNION ALL
SELECT id, 'French Fries', 'Thin-cut golden fries with house seasoning and dip', 180 FROM menu_categories WHERE name = 'Snacks'
ON CONFLICT DO NOTHING;

-- Desserts (6 items)
INSERT INTO menu_items (category_id, name, description, price)
SELECT id, 'Chocolate Lava Cake', 'Warm dark chocolate cake with a gooey molten centre', 320 FROM menu_categories WHERE name = 'Desserts'
UNION ALL
SELECT id, 'Tiramisu', 'Classic Italian espresso-soaked ladyfingers with mascarpone', 340 FROM menu_categories WHERE name = 'Desserts'
UNION ALL
SELECT id, 'New York Cheesecake', 'Dense, creamy cheesecake with a buttery graham crust', 300 FROM menu_categories WHERE name = 'Desserts'
UNION ALL
SELECT id, 'Belgian Waffle', 'Crispy waffle with fresh berries and whipped cream', 280 FROM menu_categories WHERE name = 'Desserts'
UNION ALL
SELECT id, 'Mango Panna Cotta', 'Silky Italian dessert with fresh Alphonso mango coulis', 260 FROM menu_categories WHERE name = 'Desserts'
UNION ALL
SELECT id, 'Brownie Sundae', 'Warm fudge brownie with vanilla ice cream and chocolate drizzle', 360 FROM menu_categories WHERE name = 'Desserts'
ON CONFLICT DO NOTHING;

-- Enable Realtime on orders table
-- (Do this in Supabase Dashboard > Database > Replication > Tables)
