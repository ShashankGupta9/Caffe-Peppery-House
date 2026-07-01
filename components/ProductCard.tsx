"use client";
import Image from 'next/image';
import { useCartStore } from '@/hooks/useCart';
import type { MenuItem } from '@/types';

export default function ProductCard({ item }: { item: MenuItem }) {
  const { addItem, updateQty, items } = useCartStore();
  const cartItem = items.find((i) => i.menu_item.id === item.id);
  const qty = cartItem?.quantity || 0;

  return (
    <div className="group flex flex-col transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full bg-surface-container-low mb-6 overflow-hidden">
        {item.image_url ? (
          <Image 
            src={item.image_url} 
            alt={item.name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-4xl">image</span>
          </div>
        )}
        
        {item.is_popular && (
          <div className="absolute top-4 left-4 bg-primary text-white text-[10px] tracking-widest uppercase font-bold px-3 py-1">
            Best Seller
          </div>
        )}

        {!item.is_available && (
          <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-red-500 border border-red-500/20">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <h3 className="font-display text-2xl font-bold text-raisin mb-2">{item.name}</h3>
        <p className="font-sans text-lg text-raisin mb-4">₹{item.price}</p>
        
        <p className="text-on-surface-variant text-sm line-clamp-2 mb-6 font-light leading-relaxed flex-1">
          {item.description}
        </p>

        <div className="mt-auto">
          {qty === 0 ? (
            <button 
              onClick={() => addItem(item)}
              disabled={!item.is_available}
              className={`w-full border uppercase tracking-widest text-xs font-bold py-4 transition-colors ${
                item.is_available 
                  ? "border-raisin text-raisin hover:bg-raisin hover:text-white" 
                  : "border-outline-variant text-outline-variant cursor-not-allowed bg-surface-container-low"
              }`}
            >
              {item.is_available ? "Add to Cart" : "Unavailable"}
            </button>
          ) : (
            <div className="flex items-center justify-between border border-raisin p-1">
              <button 
                onClick={() => updateQty(item.id, qty - 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-surface-container text-raisin transition-colors"
              >
                <span className="text-xl font-light">-</span>
              </button>
              <span className="font-bold text-raisin w-8 text-center">{qty}</span>
              <button 
                onClick={() => updateQty(item.id, qty + 1)}
                className="w-10 h-10 flex items-center justify-center bg-raisin text-white hover:bg-opacity-90 transition-colors"
              >
                <span className="text-xl font-light">+</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
