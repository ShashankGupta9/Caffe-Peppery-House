"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { MenuItem } from "@/types";
import ProductCard from "@/components/ProductCard";
import { MOCK_MENU_ITEMS } from "@/lib/mockData";

const CATEGORIES = [
  { key: "hot_coffee", label: "Hot Coffee ☕" },
  { key: "cold_coffee", label: "Cold Coffee 🧊" },
  { key: "snacks", label: "Snacks 🥪" },
  { key: "desserts", label: "Desserts 🍰" },
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [active, setActive] = useState("hot_coffee");

  useEffect(() => {
    async function fetchMenu() {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*, menu_categories(name)")
        .eq("is_available", true);
        
      if (data && data.length > 0) {
        setItems(data);
      } else {
        console.warn("Using mock data because menu fetch failed or is empty:", error);
        setItems(MOCK_MENU_ITEMS);
      }
    }
    fetchMenu();
  }, []);

  const activeItems = items.filter((item) => {
    // If the backend has a category field string, use that. Otherwise, match by mapping if category_id is needed.
    // The schema has 'category' TEXT denormalized.
    return item.category === active;
  });

  return (
    <main className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl text-on-surface font-bold mb-4">Our Menu</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Discover our artisanal collection of freshly roasted coffee, delightful snacks, and decadent desserts.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`px-8 py-3 rounded-full font-bold transition-all shadow-sm ${
                active === cat.key
                  ? "bg-primary text-on-primary scale-105 shadow-md"
                  : "bg-surface-container-highest text-on-surface hover:bg-outline-variant/20 hover:scale-105"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {activeItems.length > 0 ? (
            activeItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full text-center py-24 text-on-surface-variant">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">inventory_2</span>
              <p className="text-xl">Loading delicious items...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
