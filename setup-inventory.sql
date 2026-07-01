-- ==============================================================================
-- SETUP INVENTORY & RECIPES
-- Run this in the Supabase SQL Editor
-- ==============================================================================

-- 1. Create Tables
DROP TABLE IF EXISTS public.recipe_ingredients CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;

CREATE TABLE public.inventory (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  stock DECIMAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  min_stock DECIMAL NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')),
  supplier TEXT
);

CREATE TABLE public.recipe_ingredients (
  id SERIAL PRIMARY KEY,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  inventory_item_id INTEGER REFERENCES public.inventory(id) ON DELETE CASCADE,
  quantity_required DECIMAL NOT NULL
);

-- 2. Insert Default Inventory Items
INSERT INTO public.inventory (name, stock, unit, min_stock, supplier) VALUES
  ('Espresso Beans (Arabica)', 15, 'kg', 5, 'Blue Tokai'),
  ('Milk (Full Cream)', 50, 'L', 10, 'Amul'),
  ('Almond Milk', 10, 'L', 3, 'Raw Pressery'),
  ('Caramel Syrup', 5, 'bottles', 2, 'Monin'),
  ('Croissants', 20, 'pcs', 5, 'Local Bakery'),
  ('Artisan Bread', 30, 'loaves', 5, 'Local Bakery'),
  ('Chocolate Syrup', 4, 'bottles', 2, 'Hersheys'),
  ('Premium Tea Leaves', 5, 'kg', 1, 'Munnar Estates');

-- 3. Trigger Function: Deduct Inventory on Order
CREATE OR REPLACE FUNCTION public.deduct_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Update inventory stock by subtracting the required quantity * order quantity
  UPDATE public.inventory i
  SET stock = i.stock - (ri.quantity_required * NEW.quantity)
  FROM public.recipe_ingredients ri
  WHERE ri.inventory_item_id = i.id
    AND ri.menu_item_id = NEW.menu_item_id;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_deduct_inventory
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.deduct_inventory_on_order();

-- 4. Trigger Function: Update Status based on Stock
CREATE OR REPLACE FUNCTION public.update_inventory_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock <= 0 THEN
    NEW.status = 'out_of_stock';
  ELSIF NEW.stock <= NEW.min_stock THEN
    NEW.status = 'low_stock';
  ELSE
    NEW.status = 'in_stock';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_status
BEFORE UPDATE ON public.inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_inventory_status();

-- 5. Trigger Function: Auto-Update Menu Availability
CREATE OR REPLACE FUNCTION public.update_menu_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- For all menu items that use this modified inventory ingredient...
    UPDATE public.menu_items mi
    SET is_available = (
        -- Set to true ONLY if ALL ingredients for this item have stock > 0
        SELECT COALESCE(bool_and(inv.stock > 0), true)
        FROM public.recipe_ingredients ri
        JOIN public.inventory inv ON ri.inventory_item_id = inv.id
        WHERE ri.menu_item_id = mi.id
    )
    WHERE mi.id IN (
        SELECT menu_item_id FROM public.recipe_ingredients WHERE inventory_item_id = NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_menu_availability
AFTER UPDATE ON public.inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_menu_availability();

-- 6. Link All Existing Menu Items to Inventory (Basic Defaults)
DO $$
DECLARE
  mi RECORD;
  inv_espresso_id INTEGER;
  inv_milk_id INTEGER;
  inv_bread_id INTEGER;
  inv_croissant_id INTEGER;
BEGIN
  SELECT id INTO inv_espresso_id FROM public.inventory WHERE name = 'Espresso Beans (Arabica)' LIMIT 1;
  SELECT id INTO inv_milk_id FROM public.inventory WHERE name = 'Milk (Full Cream)' LIMIT 1;
  SELECT id INTO inv_bread_id FROM public.inventory WHERE name = 'Artisan Bread' LIMIT 1;
  SELECT id INTO inv_croissant_id FROM public.inventory WHERE name = 'Croissants' LIMIT 1;

  FOR mi IN SELECT * FROM public.menu_items LOOP
    IF mi.category = 'hot_coffee' OR mi.category = 'cold_coffee' THEN
      -- Every coffee takes 0.02kg beans and 0.2L milk
      INSERT INTO public.recipe_ingredients (menu_item_id, inventory_item_id, quantity_required) VALUES
        (mi.id, inv_espresso_id, 0.02),
        (mi.id, inv_milk_id, 0.2);
    ELSIF mi.category = 'snacks' AND mi.name ILIKE '%Croissant%' THEN
      -- Takes 1 Croissant
      INSERT INTO public.recipe_ingredients (menu_item_id, inventory_item_id, quantity_required) VALUES
        (mi.id, inv_croissant_id, 1);
    ELSIF mi.category = 'snacks' THEN
      -- Takes 0.2 loaf of bread
      INSERT INTO public.recipe_ingredients (menu_item_id, inventory_item_id, quantity_required) VALUES
        (mi.id, inv_bread_id, 0.2);
    END IF;
  END LOOP;
END;
$$;
