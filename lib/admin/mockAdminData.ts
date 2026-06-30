// lib/admin/mockAdminData.ts

export const mockDashboardStats = {
  todayRevenue: 24500,
  revenueGrowth: 12.5,
  totalOrders: 142,
  ordersGrowth: 8.2,
  totalCustomers: 89,
  customersGrowth: 5.4,
  averageOrderValue: 172,
  aovGrowth: -1.2,
}

export const mockSalesData = [
  { time: '08:00', revenue: 1200 },
  { time: '10:00', revenue: 3500 },
  { time: '12:00', revenue: 8900 },
  { time: '14:00', revenue: 5400 },
  { time: '16:00', revenue: 3200 },
  { time: '18:00', revenue: 6700 },
  { time: '20:00', revenue: 8400 },
  { time: '22:00', revenue: 2100 },
]

export const mockOrders = [
  { id: 'ORD-001', customer: 'Rahul Sharma', status: 'completed', total: 450, items: 3, time: '10:24 AM' },
  { id: 'ORD-002', customer: 'Priya Patel', status: 'preparing', total: 820, items: 5, time: '10:28 AM' },
  { id: 'ORD-003', customer: 'Amit Kumar', status: 'ready', total: 240, items: 1, time: '10:30 AM' },
  { id: 'ORD-004', customer: 'Sneha Gupta', status: 'new', total: 680, items: 4, time: '10:35 AM' },
  { id: 'ORD-005', customer: 'Vikram Singh', status: 'cancelled', total: 320, items: 2, time: '09:15 AM' },
]

export const mockInventory = [
  { id: 1, name: 'Espresso Beans (Arabica)', stock: 12, unit: 'kg', minStock: 15, status: 'low_stock', supplier: 'Blue Tokai' },
  { id: 2, name: 'Milk (Full Cream)', stock: 45, unit: 'L', minStock: 20, status: 'in_stock', supplier: 'Amul' },
  { id: 3, name: 'Almond Milk', stock: 4, unit: 'L', minStock: 5, status: 'low_stock', supplier: 'Raw Pressery' },
  { id: 4, name: 'Caramel Syrup', stock: 8, unit: 'bottles', minStock: 3, status: 'in_stock', supplier: 'Monin' },
  { id: 5, name: 'Croissants', stock: 0, unit: 'pcs', minStock: 20, status: 'out_of_stock', supplier: 'Local Bakery' },
]

export const mockAIInsights = [
  { type: 'warning', title: 'Croissants Depleted', message: 'You have run out of croissants. Based on historical data, you miss out on ~₹2,500 in revenue per day when out of stock.' },
  { type: 'suggestion', title: 'Increase Almond Milk Order', message: 'Almond milk demand has grown 24% this week. Consider increasing your standing order to 10L/week to avoid stockouts.' },
  { type: 'trend', title: 'Iced Coffee Surge', message: 'Iced coffee sales correlate strongly with current weather patterns. Expect a 40% surge this weekend.' }
]

export const mockCustomers = [
  { id: 'CUST-001', name: 'Rahul Sharma', email: 'rahul@example.com', totalOrders: 42, lifetimeValue: 14500, lastVisit: 'Today' },
  { id: 'CUST-002', name: 'Priya Patel', email: 'priya@example.com', totalOrders: 18, lifetimeValue: 6200, lastVisit: 'Yesterday' },
  { id: 'CUST-003', name: 'Amit Kumar', email: 'amit@example.com', totalOrders: 5, lifetimeValue: 1200, lastVisit: '3 days ago' },
]

export const mockReviews = [
  { id: 1, customer: 'Rahul Sharma', rating: 5, comment: 'Best espresso in Bhopal!', status: 'approved', date: '2023-10-24' },
  { id: 2, customer: 'Priya Patel', rating: 4, comment: 'Love the ambiance, but the latte was a bit cold.', status: 'pending', date: '2023-10-25' },
  { id: 3, customer: 'Anonymous', rating: 1, comment: 'Waited 30 mins for my order.', status: 'pending', date: '2023-10-25' },
]
