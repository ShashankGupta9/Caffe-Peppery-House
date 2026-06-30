import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase-admin";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, type, customer_name, customer_phone, address } = body;

    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price_at_order * item.quantity;
    }
    const deliveryCharge = subtotal >= 299 ? 0 : 30;
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryCharge + gst;

    // Create order in Supabase
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        type: type || "dine_in",
        status: "pending",
        subtotal,
        delivery_charge: deliveryCharge,
        gst_amount: gst,
        total,
        payment_method: "razorpay",
        payment_status: "pending",
        customer_name: customer_name || "Guest",
        customer_phone: customer_phone || "9999999999",
        address: address || null
      })
      .select("id")
      .single();

    if (orderError) throw orderError;
    const orderId = orderData.id;

    // Insert order items
    const orderItemsToInsert = items.map((i: any) => ({
      order_id: orderId,
      menu_item_id: i.menu_item_id,
      quantity: i.quantity,
      price_at_order: i.price_at_order
    }));
    await supabaseAdmin.from("order_items").insert(orderItemsToInsert);

    const order = await razorpay.orders.create({
      amount: total * 100, // paise
      currency: "INR",
      receipt: orderId,
    });
    
    return NextResponse.json({ 
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
  }
}
