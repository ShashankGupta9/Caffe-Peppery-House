"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { MenuItem } from "@/types";
import Link from "next/link";

const CATEGORIES = [
  { key: "hot_coffee", label: "Hot Coffee ☕" },
  { key: "cold_coffee", label: "Cold Coffee 🧊" },
  { key: "snacks", label: "Snacks 🥪" },
  { key: "desserts", label: "Desserts 🍰" },
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [active, setActive] = useState("hot_coffee");
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchMenu() {
      const { data } = await supabase
        .from("menu_items")
        .select("*, menu_categories(name)")
        .eq("is_available", true);
      if (data) setItems(data);
    }
    fetchMenu();
  }, []);

  const filtered = items.filter((i) => i.category === active);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const addToCart = (id: string) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  return (
    <main className="min-h-screen bg-cream">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-espresso/20">
        <Link href="/" className="font-display text-xl text-raisin">Peppery House</Link>
        <div className="flex items-center gap-4">
          <Link href="/ai" className="text-sm text-caramel hover:underline">AI Picks ✨</Link>
          {cartCount > 0 && (
            <span className="bg-caramel text-cream text-sm px-3 py-1 rounded-full">
              Cart ({cartCount})
            </span>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display text-4xl text-raisin mb-2">Our Menu</h1>
        <p className="font-accent italic text-espresso mb-8">Fresh, made with love, every day.</p>

        {/* Category tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active === c.key
                  ? "bg-caramel text-cream"
                  : "bg-white border border-espresso/20 text-espresso hover:border-caramel"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-espresso/10 p-4 flex flex-col gap-3">
              <div className="h-36 bg-cream rounded-xl flex items-center justify-center text-4xl">
                {item.category === "hot_coffee" ? "☕" : item.category === "cold_coffee" ? "🧋" : item.category === "snacks" ? "🥪" : "🍰"}
              </div>
              <div>
                <h3 className="font-display text-lg text-raisin">{item.name}</h3>
                <p className="text-xs text-espresso mt-1">{item.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-medium text-caramel">₹{item.price}</span>
                <button
                  onClick={() => addToCart(item.id)}
                  className="bg-caramel text-cream text-sm px-3 py-1.5 rounded-full hover:bg-espresso transition-colors"
                >
                  {cart[item.id] ? `+${cart[item.id]} Added` : "Add"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
