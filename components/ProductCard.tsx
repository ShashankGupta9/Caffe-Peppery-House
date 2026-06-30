"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCartStore } from '@/hooks/useCart';
import type { MenuItem } from '@/types';

// Predefined perfect pairings for demonstration
const PAIRINGS: Record<string, string> = {
  'hot_coffee': 'Pairs perfectly with a Butter Croissant 🥐',
  'cold_coffee': 'Pairs perfectly with a Chocolate Brownie 🍫',
  'snacks': 'Pairs perfectly with a Nitro Cold Brew 🧊',
  'desserts': 'Pairs perfectly with an Espresso ☕'
};

export default function ProductCard({ item }: { item: MenuItem }) {
  const { addItem, updateQty, items } = useCartStore();
  const cartItem = items.find((i) => i.menu_item.id === item.id);
  const qty = cartItem?.quantity || 0;

  const pairing = item.category ? PAIRINGS[item.category] : null;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-surface-container rounded-3xl overflow-hidden border border-outline-variant/20 shadow-lg flex flex-col transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)]"
    >
      {/* Image Container */}
      <div className="relative h-56 w-full bg-surface-container-highest">
        {item.image_url ? (
          <Image 
            src={item.image_url} 
            alt={item.name} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-4xl">image</span>
          </div>
        )}
        
        {item.is_popular && (
          <div className="absolute top-4 left-4 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Best Seller
          </div>
        )}
        
        <div className="absolute top-4 right-4 bg-surface-container/90 backdrop-blur-md text-on-surface text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-yellow-500">star</span>
          {item.rating || '4.5'}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-2xl font-bold text-on-surface">{item.name}</h3>
          <span className="font-bold text-lg text-primary">₹{item.price}</span>
        </div>
        
        <p className="text-on-surface-variant text-sm line-clamp-2 mb-4 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-secondary mb-4 font-medium">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          Ready in {item.prep_time || 5} min
        </div>

        {/* Pairing Box */}
        {pairing && (
          <div className="bg-surface-container-highest rounded-xl p-3 mb-6 border border-outline-variant/30">
            <p className="text-xs font-medium text-on-surface-variant">
              <span className="font-bold text-primary mr-1">Perfect Pairing:</span>
              {pairing}
            </p>
          </div>
        )}

        <div className="mt-auto">
          {qty === 0 ? (
            <button 
              onClick={() => addItem(item)}
              className="w-full bg-primary hover:bg-opacity-90 text-on-primary font-bold py-3 rounded-2xl transition-all shadow-sm flex justify-center items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-surface-container-highest border border-outline-variant/30 rounded-2xl p-1">
              <button 
                onClick={() => updateQty(item.id, qty - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container hover:bg-outline-variant/20 text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="font-bold text-on-surface w-8 text-center">{qty}</span>
              <button 
                onClick={() => updateQty(item.id, qty + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-on-primary hover:bg-opacity-90 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
