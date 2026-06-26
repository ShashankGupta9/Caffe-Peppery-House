-- =============================================
-- PEPPERY HOUSE — Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO menu_categories (name, slug, sort_order) VALUES
  ('Hot Coffee', 'hot_coffee', 1),
  ('Cold Coffee', 'cold_coffee', 2),
  ('Snacks', 'snacks', 3),
  ('Desserts', 'desserts', 4)
ON CONFLICT (slug) DO NOTHING;

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  category TEXT, -- denormalized for easier querying
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample menu items
INSERT INTO menu_items (category_id, category, name, description, price) VALUES
  ((SELECT id FROM menu_categories WHERE slug='hot_coffee'), 'hot_coffee', 'Espresso', 'Pure, bold shot of premium arabica', 220),
  ((SELECT id FROM menu_categories WHERE slug='hot_coffee'), 'hot_coffee', 'Cappuccino', 'Espresso with velvety steamed milk foam', 260),
  ((SELECT id FROM menu_categories WHERE slug='hot_coffee'), 'hot_coffee', 'Latte', 'Smooth espresso with lots of steamed milk', 280),
  ((SELECT id FROM menu_categories WHERE slug='hot_coffee'), 'hot_coffee', 'Flat White', 'Stronger than a latte, silky microfoam', 270),
  ((SELECT id FROM menu_categories WHERE slug='hot_coffee'), 'hot_coffee', 'Americano', 'Espresso diluted with hot water', 230),
  ((SELECT id FROM menu_categories WHERE slug='hot_coffee'), 'hot_coffee', 'Mocha', 'Espresso, chocolate & steamed milk', 300),
  ((SELECT id FROM menu_categories WHERE slug='cold_coffee'), 'cold_coffee', 'Cold Brew', '18-hour steeped, smooth & strong', 290),
  ((SELECT id FROM menu_categories WHERE slug='cold_coffee'), 'cold_coffee', 'Iced Latte', 'Chilled espresso over ice with milk', 280),
  ((SELECT id FROM menu_categories WHERE slug='cold_coffee'), 'cold_coffee', 'Frappe', 'Blended iced coffee, creamy & sweet', 310),
  ((SELECT id FROM menu_categories WHERE slug='cold_coffee'), 'cold_coffee', 'Caramel Macchiato (Iced)', 'Vanilla, milk, espresso & caramel drizzle', 340),
  ((SELECT id FROM menu_categories WHERE slug='cold_coffee'), 'cold_coffee', 'Vietnamese Iced Coffee', 'Strong drip coffee with condensed milk', 270),
  ((SELECT id FROM menu_categories WHERE slug='cold_coffee'), 'cold_coffee', 'Nitro Cold Brew', 'Nitrogen-infused silky cold brew', 320),
  ((SELECT id FROM menu_categories WHERE slug='snacks'), 'snacks', 'Bruschetta', 'Toasted bread with tomato & basil', 220),
  ((SELECT id FROM menu_categories WHERE slug='snacks'), 'snacks', 'Cheese Toast', 'Thick-cut bread with melted cheddar', 200),
  ((SELECT id FROM menu_categories WHERE slug='snacks'), 'snacks', 'Veg Sandwich', 'Fresh veggies in toasted multigrain', 240),
  ((SELECT id FROM menu_categories WHERE slug='snacks'), 'snacks', 'Chicken Sandwich', 'Grilled chicken, lettuce & pesto', 290),
  ((SELECT id FROM menu_categories WHERE slug='snacks'), 'snacks', 'Nachos', 'Crispy nachos with salsa & sour cream', 260),
  ((SELECT id FROM menu_categories WHERE slug='snacks'), 'snacks', 'French Fries', 'Golden crispy fries with dips', 220),
  ((SELECT id FROM menu_categories WHERE slug='desserts'), 'desserts', 'Chocolate Lava Cake', 'Warm molten centre, served with ice cream', 340),
  ((SELECT id FROM menu_categories WHERE slug='desserts'), 'desserts', 'Tiramisu', 'Classic Italian coffee-soaked dessert', 320),
  ((SELECT id FROM menu_categories WHERE slug='desserts'), 'desserts', 'Cheesecake', 'New York-style, smooth & creamy', 300),
  ((SELECT id FROM menu_categories WHERE slug='desserts'), 'desserts', 'Brownie', 'Fudgy dark chocolate brownie', 250),
  ((SELECT id FROM menu_categories WHERE slug='desserts'), 'desserts', 'Panna Cotta', 'Italian vanilla cream with berry coulis', 280),
  ((SELECT id FROM menu_categories WHERE slug='desserts'), 'desserts', 'Waffles', 'Belgian waffles with maple & cream', 310);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('dine_in', 'delivery')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  table_number TEXT,
  subtotal NUMERIC(10, 2) NOT NULL,
  delivery_charge NUMERIC(10, 2) DEFAULT 0,
  gst_amount NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('razorpay','cash_on_delivery','cash_at_counter','qr_code')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid')),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price_at_order NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_id TEXT,
  method TEXT,
  amount NUMERIC(10, 2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Public can read menu" ON menu_items FOR SELECT USING (TRUE);
CREATE POLICY "Public can read categories" ON menu_categories FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (customer_phone = (SELECT phone FROM users WHERE id = auth.uid()) OR auth.uid() IS NOT NULL);

-- Enable Realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
