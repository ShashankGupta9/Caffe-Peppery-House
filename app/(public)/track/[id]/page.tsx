"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Order, OrderStatus } from "@/types";

const STATUS_STEPS: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "pending",          label: "Order Placed",     icon: "📋" },
  { key: "confirmed",        label: "Confirmed",         icon: "✅" },
  { key: "preparing",        label: "Preparing",         icon: "👨‍🍳" },
  { key: "out_for_delivery", label: "Out for Delivery",  icon: "🛵" },
  { key: "delivered",        label: "Delivered",         icon: "🎉" },
];

export default function TrackPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      const { data } = await supabase.from("orders").select("*, order_items(*, menu_items(*))").eq("id", params.id).single();
      if (data) setOrder(data);
    }
    fetchOrder();

    // Realtime subscription
    const channel = supabase
      .channel(`order-${params.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${params.id}` },
        (payload) => setOrder((prev) => prev ? { ...prev, ...payload.new } : null))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [params.id]);

  if (!order) return <div className="flex items-center justify-center min-h-screen text-espresso">Loading order...</div>;

  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <main className="min-h-screen bg-cream px-6 py-16 max-w-lg mx-auto">
      <h1 className="font-display text-3xl text-raisin mb-1">Order Tracking</h1>
      <p className="text-espresso text-sm mb-8">Order #{order.id.slice(0, 8).toUpperCase()}</p>

      {/* Status stepper */}
      <div className="space-y-4 mb-10">
        {STATUS_STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          return (
            <div key={step.key} className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${done ? "bg-white border border-caramel/30" : "bg-white/40 border border-espresso/10"}`}>
              <span className="text-2xl">{step.icon}</span>
              <span className={`font-medium text-sm ${done ? "text-raisin" : "text-espresso/50"}`}>{step.label}</span>
              {done && <span className="ml-auto text-caramel text-xs font-medium">✓</span>}
            </div>
          );
        })}
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-2xl border border-espresso/10 p-5">
        <h2 className="font-display text-lg text-raisin mb-3">Order Summary</h2>
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-espresso/10 last:border-0">
            <span>{item.menu_item?.name} × {item.quantity}</span>
            <span className="text-caramel">₹{item.price_at_order * item.quantity}</span>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-espresso/10 space-y-1 text-sm">
          <div className="flex justify-between text-espresso"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
          <div className="flex justify-between text-espresso"><span>Delivery</span><span>{order.delivery_charge === 0 ? "Free" : `₹${order.delivery_charge}`}</span></div>
          <div className="flex justify-between text-espresso"><span>GST (5%)</span><span>₹{order.gst_amount}</span></div>
          <div className="flex justify-between font-medium text-raisin pt-1"><span>Total</span><span>₹{order.total}</span></div>
        </div>
      </div>
    </main>
  );
}
