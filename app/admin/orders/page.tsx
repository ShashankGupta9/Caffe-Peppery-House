'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Order, OrderStatus } from '@/types';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import toast from 'react-hot-toast';

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const audioRef = useRef<AudioContext | null>(null);

  function playAlert() {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch {}
  }

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*, menu_item:menu_items(name, price))')
        .not('status', 'eq', 'delivered')
        .order('created_at', { ascending: false });
      setOrders(data || []);
    }
    fetchOrders();

    const channel = supabase
      .channel('live-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        setOrders(prev => [payload.new as Order, ...prev]);
        playAlert();
        toast.success('New order received!');
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, payload => {
        setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function updateStatus(orderId: string, status: OrderStatus) {
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    toast.success('Order status updated');
  }

  const nextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  return (
    <div className="min-h-screen bg-[#F5ECD8]">
      <nav className="bg-[#2E1F26] px-6 py-4 flex items-center justify-between">
        <span className="text-[#C87740] font-serif text-xl font-bold">Live Orders — KDS</span>
        <a href="/admin" className="text-[#F5ECD8]/60 text-sm hover:text-[#C87740]">← Dashboard</a>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#2E1F26] font-serif">Active Orders</h1>
          <span className="bg-[#C87740] text-white text-sm px-3 py-1 rounded-full">{orders.length} active</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 text-[#8B5A3A]">
            <p className="text-lg font-serif mb-2">No active orders</p>
            <p className="text-sm">New orders will appear here with a sound alert</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map(order => {
              const next = nextStatus(order.status);
              return (
                <div key={order.id} className="bg-white rounded-2xl p-5 border border-[#C87740]/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm text-[#8B5A3A]">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <span className="text-xs bg-[#F5ECD8] text-[#8B5A3A] px-2 py-1 rounded-full capitalize">{order.type.replace('_', '-')}</span>
                    {order.table_number && (
                      <span className="text-xs bg-[#C87740]/10 text-[#C87740] px-2 py-1 rounded-full">Table {order.table_number}</span>
                    )}
                  </div>

                  <div className="space-y-1 mb-3">
                    {order.order_items?.map(oi => (
                      <div key={oi.id} className="flex justify-between text-sm">
                        <span className="text-[#2E1F26]">{oi.menu_item?.name} × {oi.quantity}</span>
                        <span className="text-[#8B5A3A]">₹{oi.price_at_order * oi.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#F5ECD8] pt-3 flex items-center justify-between">
                    <span className="font-bold text-[#C87740]">₹{order.total}</span>
                    {next && (
                      <button
                        onClick={() => updateStatus(order.id, next)}
                        className="btn-primary text-xs py-2 px-4"
                      >
                        → {ORDER_STATUS_LABELS[next]}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
