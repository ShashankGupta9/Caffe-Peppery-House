"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const NEXT_STATUS: Record<string, string> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "out_for_delivery",
  out_for_delivery: "delivered",
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ today: 0, revenue: 0, pending: 0 });

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*, menu_items(name))")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) {
      setOrders(data);
      const today = new Date().toDateString();
      const todayOrders = data.filter((o) => new Date(o.created_at).toDateString() === today);
      setStats({
        today: todayOrders.length,
        revenue: todayOrders.reduce((s, o) => s + o.total, 0),
        pending: data.filter((o) => o.status === "pending").length,
      });
    }
  }

  useEffect(() => {
    fetchOrders();
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
        // Play sound alert for new orders
        const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAA==");
        audio.play().catch(() => {});
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function updateStatus(orderId: string, status: string) {
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  }

  return (
    <main className="min-h-screen bg-cream">
      <nav className="bg-raisin text-cream px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl">Peppery House — Admin</h1>
        <span className="text-sm text-cream/60">Kitchen Display System</span>
      </nav>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-6">
        {[
          { label: "Today's Orders", value: stats.today },
          { label: "Pending Orders", value: stats.pending },
          { label: "Today's Revenue", value: `₹${stats.revenue}` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-espresso/10 p-5 text-center">
            <div className="text-2xl font-display text-caramel">{s.value}</div>
            <div className="text-xs text-espresso mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Live orders */}
      <div className="px-6 pb-10">
        <h2 className="font-display text-xl text-raisin mb-4">Live Orders</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-espresso/10 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-medium text-raisin">#{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-espresso text-sm ml-3">{order.customer_name} · {order.customer_phone}</span>
                  <span className={`ml-3 text-xs px-2 py-0.5 rounded-full font-medium ${order.type === "dine_in" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>
                    {order.type === "dine_in" ? "Dine-in" : "Delivery"}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || ""}`}>
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="text-sm text-espresso mb-3">
                {order.items?.map((i) => `${i.menu_item?.name} ×${i.quantity}`).join(", ")}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-caramel">₹{order.total}</span>
                {NEXT_STATUS[order.status] && (
                  <button onClick={() => updateStatus(order.id, NEXT_STATUS[order.status])}
                    className="bg-caramel text-cream text-xs px-4 py-1.5 rounded-full hover:bg-espresso transition-colors">
                    Mark as {NEXT_STATUS[order.status].replace(/_/g, " ")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
