-- Run this in the Supabase SQL Editor
-- This fixes the issue where the admin dashboard and menu editor fail due to Row Level Security (RLS) blocking access.

-- Disable RLS on menu items so the admin can add, edit, and delete without being blocked
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;

-- Disable RLS on orders so the admin dashboard can calculate live revenue and order stats
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
