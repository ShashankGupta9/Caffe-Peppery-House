import { NextResponse } from 'next/server';
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString();

  const [todayOrders, weeklyOrders, monthlyOrders, popularItems, recentOrders] = await Promise.all([
    supabaseAdmin.from('orders').select('total').gte('created_at', today),
    supabaseAdmin.from('orders').select('total').gte('created_at', weekAgo),
    supabaseAdmin.from('orders').select('total').gte('created_at', monthAgo),
    supabaseAdmin.from('order_items')
      .select('menu_item_id, quantity, menu_item:menu_items(id, name, price)')
      .gte('created_at', monthAgo),
    supabaseAdmin.from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  // Aggregate popular items
  const itemCounts: Record<string, { item: unknown; count: number }> = {};
  popularItems.data?.forEach(oi => {
    const id = oi.menu_item_id;
    if (!itemCounts[id]) itemCounts[id] = { item: oi.menu_item, count: 0 };
    itemCounts[id].count += oi.quantity;
  });
  const popular_items = Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  return NextResponse.json({
    today_orders: todayOrders.data?.length || 0,
    today_revenue: todayOrders.data?.reduce((s, o) => s + Number(o.total), 0) || 0,
    weekly_revenue: weeklyOrders.data?.reduce((s, o) => s + Number(o.total), 0) || 0,
    monthly_revenue: monthlyOrders.data?.reduce((s, o) => s + Number(o.total), 0) || 0,
    popular_items,
    recent_orders: recentOrders.data || [],
  });
}
