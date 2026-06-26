"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function sendOTP() {
    setLoading(true); setError("");
    const formatted = phone.startsWith("+91") ? phone : `+91${phone}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted });
    if (error) setError(error.message);
    else setStep("otp");
    setLoading(false);
  }

  async function verifyOTP() {
    setLoading(true); setError("");
    const formatted = phone.startsWith("+91") ? phone : `+91${phone}`;
    const { error } = await supabase.auth.verifyOtp({ phone: formatted, token: otp, type: "sms" });
    if (error) setError(error.message);
    else router.push("/");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-espresso/20 p-8">
        <h1 className="font-display text-3xl text-raisin mb-1">Welcome back</h1>
        <p className="text-espresso text-sm mb-8">Sign in with your phone number</p>

        {step === "phone" ? (
          <>
            <label className="block text-sm font-medium text-raisin mb-2">Phone number</label>
            <div className="flex gap-2 mb-4">
              <span className="border border-espresso/30 rounded-xl px-3 py-3 text-sm text-espresso bg-cream">+91</span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210" maxLength={10}
                className="flex-1 border border-espresso/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-caramel"/>
            </div>
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button onClick={sendOTP} disabled={loading || phone.length < 10}
              className="w-full bg-caramel text-cream py-3 rounded-full font-medium hover:bg-espresso transition-colors disabled:opacity-60">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-espresso mb-4">Enter the 6-digit OTP sent to +91{phone}</p>
            <input type="number" value={otp} onChange={(e) => setOtp(e.target.value)}
              placeholder="123456" maxLength={6}
              className="w-full border border-espresso/30 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:border-caramel"/>
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button onClick={verifyOTP} disabled={loading || otp.length < 6}
              className="w-full bg-caramel text-cream py-3 rounded-full font-medium hover:bg-espresso transition-colors disabled:opacity-60">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button onClick={() => setStep("phone")} className="w-full text-center text-sm text-espresso mt-3 hover:text-caramel">Change number</button>
          </>
        )}
      </div>
    </main>
  );
}
