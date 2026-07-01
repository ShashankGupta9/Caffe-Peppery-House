"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { MenuItem } from "@/types";
import ProductCard from "@/components/ProductCard";
import { MOCK_MENU_ITEMS } from "@/lib/mockData";

const CATEGORIES = [
  { key: "hot_coffee", label: "Hot Coffee" },
  { key: "cold_coffee", label: "Cold Coffee" },
  { key: "snacks", label: "Snacks" },
  { key: "desserts", label: "Desserts" },
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

  const activeItems = items.filter((item) => item.category === active);

  return (
    <main className="min-h-screen bg-surface px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h1 className="font-display text-5xl md:text-7xl text-raisin font-bold mb-6">Our Menu</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto font-light">
            Discover our artisanal collection of freshly roasted coffee, delightful snacks, and decadent desserts.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-8 mb-20 border-b border-outline-variant pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`pb-4 px-2 uppercase tracking-widest text-sm font-bold transition-all relative ${
                active === cat.key
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-raisin"
              }`}
            >
              {cat.label}
              {active === cat.key && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></span>
              )}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {activeItems.length > 0 ? (
            activeItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full text-center py-24 text-on-surface-variant">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">inventory_2</span>
              <p className="text-xl font-light">Loading delicious items...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
