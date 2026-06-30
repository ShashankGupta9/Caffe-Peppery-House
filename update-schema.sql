-- Run this in your Supabase SQL Editor to update the schema for the Premium Overhaul

ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 1) DEFAULT 4.8,
ADD COLUMN IF NOT EXISTS prep_time INT DEFAULT 5,
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE;
