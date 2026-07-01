"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/hooks/useCart';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import UserDropdown from './UserDropdown';
import { useCartSync } from '@/hooks/useCartSync';
import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.count());
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  
  useCartSync(user);

  useEffect(() => {
    setMounted(true);
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/ai', label: 'AI Barista' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-outline-variant/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Links (Left/Desktop) */}
        <div className="hidden md:flex items-center gap-8 flex-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm tracking-widest uppercase transition-colors ${
                  isActive ? 'text-primary font-bold' : 'text-on-surface hover:text-primary font-medium'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Logo (Center) */}
        <div className="flex-1 flex justify-start md:justify-center">
          <Link href="/" className="font-display text-2xl md:text-3xl font-bold text-on-surface tracking-tight uppercase hover:text-primary transition-colors">
            Peppery House
          </Link>
        </div>

        {/* Auth & Cart (Right) */}
        <div className="flex items-center justify-end gap-6 flex-1">
          {/* Auth State */}
          {mounted && (
            user ? (
              <UserDropdown user={user} />
            ) : (
              <div className="hidden sm:flex items-center gap-6">
                <Link href="/login" className="text-sm font-medium tracking-wide uppercase text-on-surface hover:text-primary transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="text-sm font-bold tracking-wide uppercase bg-primary text-on-primary px-6 py-2.5 hover:bg-opacity-90 transition-colors">
                  Sign Up
                </Link>
              </div>
            )
          )}

          {/* Cart Icon */}
          <Link 
            href="/cart"
            className="relative flex items-center justify-center gap-2 p-2 hover:text-primary transition-colors text-on-surface text-sm font-medium tracking-widest uppercase"
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
            {mounted && cartCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-primary text-on-primary text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {cartCount}
              </div>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
}

