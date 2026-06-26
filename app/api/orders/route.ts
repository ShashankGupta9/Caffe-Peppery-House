import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { calculateTotal } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, type, customer_name, customer_phone, address, payment_method, table_number } = body;

    if (!items?.length || !customer_name || !customer_phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity, 0);
    const { deliveryCharge, gst, total } = calculateTotal(subtotal);

    // Create order
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        type,
        status: "pending",
        subtotal,
        delivery_charge: deliveryCharge,
        gst_amount: gst,
        total,
        payment_method,
        payment_status: payment_method === "razorpay" ? "pending" : "pending",
        customer_name,
        customer_phone,
        address: address || null,
        table_number: table_number || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Insert order items
    const orderItems = items.map((item: { menu_item_id: string; quantity: number; price: number }) => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price_at_order: item.price,
    }));

    await supabaseAdmin.from("order_items").insert(orderItems);

    return NextResponse.json({ order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  const query = supabaseAdmin.from("orders").select("*, order_items(*, menu_items(*))").order("created_at", { ascending: false });
  if (phone) query.eq("customer_phone", phone);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}
