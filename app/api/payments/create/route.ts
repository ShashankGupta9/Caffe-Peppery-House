import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId } = await req.json();
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: orderId,
    });
    return NextResponse.json({ razorpayOrder: order });
  } catch {
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
  }
}
