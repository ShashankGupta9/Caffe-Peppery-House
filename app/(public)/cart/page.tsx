"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCart";
import { calculateTotal } from "@/lib/razorpay";
import { motion } from "framer-motion";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCartStore();
  const { deliveryCharge, gst, total } = calculateTotal(subtotal());
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center py-32">
        <span className="material-symbols-outlined text-8xl text-outline-variant mb-6 font-light">shopping_bag</span>
        <h1 className="font-display text-4xl text-raisin font-bold mb-6">Your Cart is Empty</h1>
        <p className="text-on-surface-variant mb-12 max-w-sm font-light">
          Looks like you haven't added any premium coffees or snacks yet.
        </p>
        <Link href="/menu" className="border border-raisin text-raisin px-12 py-4 tracking-widest uppercase font-bold hover:bg-raisin hover:text-white transition-colors">
          Explore Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-5xl text-raisin font-bold mb-16 border-b border-outline-variant/30 pb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {items.map((item) => (
              <motion.div 
                layout
                key={item.menu_item.id}
                className="flex flex-col sm:flex-row gap-8 items-center pb-8 border-b border-outline-variant"
              >
                <div className="relative w-full sm:w-40 h-40 bg-surface-container-low flex-shrink-0">
                  {item.menu_item.image_url ? (
                    <Image src={item.menu_item.image_url} alt={item.menu_item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center sm:text-left flex flex-col h-full justify-center">
                  <h3 className="font-display text-2xl font-bold text-raisin mb-2">{item.menu_item.name}</h3>
                  <p className="font-sans text-lg text-raisin font-bold">₹{item.menu_item.price}</p>
                </div>

                <div className="flex flex-col items-end gap-6 justify-center">
                  <div className="flex items-center border border-raisin p-1">
                    <button 
                      onClick={() => updateQty(item.menu_item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-surface-container transition-colors"
                    >
                      <span className="text-xl font-light">-</span>
                    </button>
                    <span className="font-bold text-raisin w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQty(item.menu_item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-raisin text-white hover:bg-opacity-90 transition-colors"
                    >
                      <span className="text-xl font-light">+</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.menu_item.id)}
                    className="text-raisin text-xs font-bold tracking-widest uppercase hover:underline flex items-center gap-1"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface p-8 border border-outline-variant sticky top-32">
              <h2 className="font-display text-2xl text-raisin font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-6 text-raisin font-light mb-8">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                </div>
              </div>

              <div className="border-t border-outline-variant pt-6 mb-10 flex justify-between items-center text-raisin font-bold text-2xl">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-raisin text-white py-4 font-bold tracking-widest uppercase text-xs hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
