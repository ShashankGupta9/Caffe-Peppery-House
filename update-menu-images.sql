-- ==============================================================================
-- UPDATE MENU IMAGES
-- Run this script in the Supabase SQL Editor to add Unsplash images to your menu
-- ==============================================================================

UPDATE public.menu_items 
SET image_url = 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800&auto=format&fit=crop'
WHERE name = 'Espresso';

UPDATE public.menu_items 
SET image_url = 'https://images.unsplash.com/photo-1534687941688-651ccaafbff8?q=80&w=800&auto=format&fit=crop'
WHERE name = 'Cappuccino';

UPDATE public.menu_items 
SET image_url = 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop'
WHERE name = 'Cold Brew';

UPDATE public.menu_items 
SET image_url = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop'
WHERE name = 'Croissant';
