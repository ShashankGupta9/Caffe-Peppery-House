"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCart";
import { calculateTotal, openRazorpay, loadRazorpayScript } from "@/lib/razorpay";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clear } = useCartStore();
  const { deliveryCharge, gst, total } = calculateTotal(subtotal());
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    router.push('/checkout');
  };



  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-8xl text-outline-variant mb-6">shopping_bag</span>
        <h1 className="font-serif text-3xl text-on-surface font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-on-surface-variant mb-8 max-w-sm">
          Looks like you haven't added any premium coffees or snacks yet.
        </p>
        <Link href="/menu" className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-md hover:bg-opacity-90 transition-all">
          Explore Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl text-on-surface font-bold mb-12 border-b border-outline-variant/30 pb-6">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <motion.div 
                layout
                key={item.menu_item.id}
                className="bg-surface-container rounded-3xl p-4 border border-outline-variant/20 shadow-sm flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-surface-container-highest flex-shrink-0">
                  {item.menu_item.image_url ? (
                    <Image src={item.menu_item.image_url} alt={item.menu_item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-serif text-xl font-bold text-on-surface">{item.menu_item.name}</h3>
                  <p className="text-primary font-bold mt-1">₹{item.menu_item.price}</p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center bg-surface-container-highest border border-outline-variant/30 rounded-full p-1">
                    <button 
                      onClick={() => updateQty(item.menu_item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-outline-variant/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="font-bold text-on-surface w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQty(item.menu_item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-on-primary hover:bg-opacity-90 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.menu_item.id)}
                    className="text-error text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span> Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/20 shadow-lg sticky top-32">
              <h2 className="font-serif text-2xl text-on-surface font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-on-surface-variant font-medium mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Delivery Charge</span>
                  <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-6 mb-8 flex justify-between items-center text-on-surface font-bold text-2xl">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-primary hover:bg-opacity-90 text-on-primary py-4 rounded-full font-bold text-lg transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
                {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
              
              <p className="text-center text-xs text-outline mt-4">
                Secure payments powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
