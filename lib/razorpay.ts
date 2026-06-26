// Razorpay utility functions

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayOptions {
  key: string;
  amount: number; // paise
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  prefill?: { name?: string; contact?: string };
  theme?: { color?: string };
}

export function openRazorpay(options: RazorpayOptions) {
  // @ts-ignore
  const rzp = new window.Razorpay(options);
  rzp.open();
}

export function calculateTotal(subtotal: number): {
  subtotal: number;
  deliveryCharge: number;
  gst: number;
  total: number;
} {
  const deliveryCharge = subtotal >= 299 ? 0 : 30;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryCharge + gst;
  return { subtotal, deliveryCharge, gst, total };
}
