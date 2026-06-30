"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import FloatingBeans from "@/components/FloatingBeans";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { MenuItem } from "@/types";
import { MOCK_MENU_ITEMS } from "@/lib/mockData";

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function fetchFeatured() {
      // Fetch 4 items per category to preview
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
    <main className="relative min-h-screen bg-gradient-to-b from-[#1E110A] via-[#2A1810] to-[#140B06] overflow-hidden text-cream">
      {/* 3D Floating Beans Background */}
      <FloatingBeans />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] text-center px-6 pt-16">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-primary tracking-widest uppercase font-bold text-sm mb-4"
        >
          Welcome to Peppery House
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-br from-[#F5D0A9] to-[#C87740] font-bold leading-tight mb-8 drop-shadow-2xl"
        >
          Freshly Brewed <br /> Experiences
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-on-surface-variant text-xl md:text-2xl max-w-2xl font-sans font-light leading-relaxed mb-12"
        >
          Crafted with passion. <br/>
          Powered by AI. <br/>
          Served with love.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <Link href="/menu" className="bg-primary hover:bg-opacity-90 text-on-primary px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-[0_0_30px_-5px_rgba(200,119,64,0.6)]">
            Explore Menu
          </Link>
          <Link href="/ai" className="bg-surface-container/50 backdrop-blur-md border border-primary/50 text-primary hover:bg-primary hover:text-on-primary px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105">
            Meet AI Barista ✨
          </Link>
        </motion.div>
      </section>

      {/* Featured Menu Preview */}
      <section className="relative z-10 py-32 px-6 bg-surface-container-highest/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl md:text-6xl text-on-surface font-bold mb-4">Today's Specials</h2>
            <p className="text-on-surface-variant text-lg">Curated selections just for you...</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/menu" className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:underline underline-offset-8 transition-all hover:gap-4">
              View Full Menu <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
