// lib/admin/adminServices.ts
import {
  mockDashboardStats,
  mockSalesData,
  mockOrders,
  mockAIInsights,
  mockCustomers,
  mockReviews
} from './mockAdminData';
import { supabase } from '@/lib/supabase';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: orders, error } = await supabase.from('orders').select('user_id, total_amount, created_at, status');
  
  if (error || !orders) return mockDashboardStats;

  let todayRevenue = 0;
  let totalOrders = orders.length;
  const customers = new Set();
  
  let totalRevenueAllTime = 0;
  let validOrdersCount = 0;

  orders.forEach(order => {
    if (order.user_id) customers.add(order.user_id);
    const orderDate = new Date(order.created_at);
    if (order.status !== 'cancelled') {
      const amt = Number(order.total_amount) || 0;
      totalRevenueAllTime += amt;
      validOrdersCount++;
      if (orderDate >= today) {
        todayRevenue += amt;
      }
    }
  });

  const averageOrderValue = validOrdersCount > 0 ? Math.round(totalRevenueAllTime / validOrdersCount) : 0;

  return {
    todayRevenue,
    revenueGrowth: 0,
    totalOrders,
    ordersGrowth: 0,
    totalCustomers: customers.size,
    customersGrowth: 0,
    averageOrderValue,
    aovGrowth: 0,
  }
}

export async function getSalesData() {
  const { data: orders, error } = await supabase.from('orders').select('total_amount, created_at, status').neq('status', 'cancelled');
  if (error || !orders) return mockSalesData;

  const salesByHour = Array(8).fill(0).map((_, i) => ({
    time: `${8 + (i * 2)}:00`,
    revenue: 0
  }));

  const today = new Date();
  today.setHours(0,0,0,0);

  orders.forEach(order => {
    const d = new Date(order.created_at);
    if (d >= today) {
      const hour = d.getHours();
      let bucketIdx = Math.floor((hour - 8) / 2);
      if (bucketIdx < 0) bucketIdx = 0;
      if (bucketIdx > 7) bucketIdx = 7;
      salesByHour[bucketIdx].revenue += Number(order.total_amount);
    }
  });

  return salesByHour;
}

export async function getOrders() {
  await delay(1000);
  return mockOrders;
}

export async function getInventory() {
  const { data, error } = await supabase.from('inventory').select('*').order('name');
  if (error || !data) {
    console.error("Error fetching inventory", error);
    return [];
  }
  return data.map(item => ({
    ...item,
    minStock: item.min_stock
  }));
}

export async function getAIInsights() {
  await delay(1200);
  return mockAIInsights;
}

export async function getCustomers() {
  await delay(1000);
  return mockCustomers;
}

export async function getReviews() {
  await delay(700);
  return mockReviews;
}
