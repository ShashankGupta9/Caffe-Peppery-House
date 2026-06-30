export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: UserRole;
  created_at: string;
}

export type MenuCategory = "hot_coffee" | "cold_coffee" | "snacks" | "desserts";

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  rating?: number;
  prep_time?: number;
  is_popular?: boolean;
  created_at: string;
  category?: MenuCategory;
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
}

export type OrderType = "dine_in" | "delivery";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "razorpay" | "cash_on_delivery" | "cash_at_counter" | "qr_code";

export interface Order {
  id: string;
  user_id?: string;
  type: OrderType;
  status: OrderStatus;
  table_number?: string;
  subtotal: number;
  delivery_charge: number;
  gst_amount: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: "pending" | "paid";
  address?: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price_at_order: number;
  menu_item?: MenuItem;
}

export interface Review {
  id: string;
  user_id: string;
  menu_item_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user?: User;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  is_active: boolean;
  current_order_id?: string;
}
