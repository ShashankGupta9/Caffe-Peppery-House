"use client";
import { useState, useCallback } from "react";
import type { MenuItem, CartItem } from "@/types";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((menuItem: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menu_item.id === menuItem.id);
      if (existing) {
        return prev.map((i) => i.menu_item.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menu_item: menuItem, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.menu_item.id !== id));
  }, []);

  const updateQty = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) { removeItem(id); return; }
    setItems((prev) => prev.map((i) => i.menu_item.id === id ? { ...i, quantity } : i));
  }, [removeItem]);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((s, i) => s + i.menu_item.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return { items, addItem, removeItem, updateQty, clear, subtotal, count };
}
