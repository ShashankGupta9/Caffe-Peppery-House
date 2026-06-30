"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (menuItem: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (menuItem) => set((state) => {
        const existing = state.items.find((i) => i.menu_item.id === menuItem.id);
        if (existing) {
          return {
            items: state.items.map((i) => 
              i.menu_item.id === menuItem.id 
                ? { ...i, quantity: i.quantity + 1 } 
                : i
            )
          };
        }
        return { items: [...state.items, { menu_item: menuItem, quantity: 1 }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.menu_item.id !== id)
      })),
      updateQty: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter((i) => i.menu_item.id !== id) };
        }
        return {
          items: state.items.map((i) => 
            i.menu_item.id === id ? { ...i, quantity } : i
          )
        };
      }),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((s, i) => s + (i.menu_item.price * i.quantity), 0),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    {
      name: 'peppery-cart-storage',
    }
  )
);
