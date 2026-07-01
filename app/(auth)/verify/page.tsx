'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function VerifyPage() {
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedPhone = localStorage.getItem('ph_phone');
    if (!savedPhone) router.push('/login');
    else setPhone(savedPhone);
  }, [router]);

  async function verifyOTP() {
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });
    if (error) {
      toast.error('Invalid OTP. Please try again.');
    } else {
      // Upsert user record
      await supabase.from('users').upsert({
        id: data.user!.id,
        phone,
        name: '',
        role: 'customer',
      }, { onConflict: 'id' });
      localStorage.removeItem('ph_phone');
      toast.success('Logged in successfully!');
      router.push('/');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#2E1F26] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-[#C87740] font-display text-2xl font-bold block text-center mb-10">
          Peppery House
        </Link>
        <div className="bg-[#4A3040] rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-[#F5ECD8] mb-2">Enter OTP</h1>
          <p className="text-[#C87740]/70 text-sm mb-6">
            Sent to <span className="text-[#C87740]">{phone}</span>
          </p>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit OTP"
            className="w-full bg-[#2E1F26] text-[#F5ECD8] text-center text-2xl tracking-[0.5em] rounded-xl px-4 py-4 mb-4 outline-none border border-[#C87740]/20 focus:border-[#C87740]"
            onKeyDown={e => e.key === 'Enter' && verifyOTP()}
          />
          <button
            onClick={verifyOTP}
            disabled={loading || otp.length !== 6}
            className="w-full btn-primary disabled:opacity-40"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
          <button
            onClick={() => router.push('/login')}
            className="w-full text-[#C87740]/50 text-sm mt-3 hover:text-[#C87740] transition-colors"
          >
            ← Change number
          </button>
        </div>
      </div>
    </div>
  );
}

