import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Update order payment status
    await supabaseAdmin
      .from("orders")
      .update({ payment_status: "paid", status: "confirmed" })
      .eq("id", order_id);

    await supabaseAdmin.from("payments").insert({
      order_id,
      razorpay_id: razorpay_payment_id,
      method: "razorpay",
      amount: 0,
      status: "paid",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
