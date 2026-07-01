"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { MenuItem } from "@/types";
import { MOCK_MENU_ITEMS } from "@/lib/mockData";

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function fetchFeatured() {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*, menu_categories(name)")
        .eq("is_available", true)
        .order("is_popular", { ascending: false })
        .limit(4);
        
      if (data && data.length > 0) {
        setFeaturedItems(data);
      } else {
        console.warn("Using mock data because menu fetch failed or is empty:", error);
        setFeaturedItems(MOCK_MENU_ITEMS.slice(0, 4));
      }
    }
    fetchFeatured();
  }, []);

  return (
    <main className="bg-surface text-on-surface">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <p className="tracking-[0.2em] uppercase font-bold text-sm mb-6 opacity-90">
            Welcome to Peppery House
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-8">
            Freshly Brewed <br /> Experiences
          </h1>
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <Link href="/menu" className="bg-primary text-white px-8 py-4 text-sm tracking-widest uppercase font-bold hover:bg-opacity-90 transition-colors">
              Shop Coffee
            </Link>
            <Link href="/ai" className="bg-white text-raisin px-8 py-4 text-sm tracking-widest uppercase font-bold hover:bg-surface-container transition-colors">
              Meet AI Barista
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Menu Preview */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-raisin mb-4">Featured Coffees</h2>
              <p className="text-on-surface-variant max-w-lg">Discover our signature roasts, carefully selected for the perfect cup.</p>
            </div>
            <Link href="/menu" className="inline-flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm hover:underline underline-offset-4 transition-all">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {featuredItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Brand Story Section */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="h-[500px] bg-cover bg-center rounded-sm" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")' }}></div>
          <div>
            <h2 className="font-display text-4xl font-bold text-raisin mb-6">Our Coffee Journey</h2>
            <p className="text-on-surface-variant text-lg mb-8 leading-relaxed font-light">
              We believe every cup tells a story. From the high-altitude farms to our meticulous roasting process, we are dedicated to bringing you the finest specialty coffee. Experience the perfect balance of tradition and innovation.
            </p>
            <Link href="/about" className="inline-block border border-raisin text-raisin px-8 py-4 text-sm tracking-widest uppercase font-bold hover:bg-raisin hover:text-white transition-colors">
              Read Our Story
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
