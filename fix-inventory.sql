-- Run this in the Supabase SQL Editor
-- This fixes the issue where the inventory table is empty due to Row Level Security (RLS) blocking access.

ALTER TABLE public.inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients DISABLE ROW LEVEL SECURITY;

-- We also need to ensure the triggers run with admin privileges so that when a normal customer buys a coffee, the database is allowed to deduct the inventory!
CREATE OR REPLACE FUNCTION public.deduct_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.inventory i
  SET stock = i.stock - (ri.quantity_required * NEW.quantity)
  FROM public.recipe_ingredients ri
  WHERE ri.inventory_item_id = i.id
    AND ri.menu_item_id = NEW.menu_item_id;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_menu_availability()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.menu_items mi
    SET is_available = (
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
