"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/hooks/useCart';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import UserDropdown from './UserDropdown';
import { useCartSync } from '@/hooks/useCartSync';

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
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto bg-surface-container/60 backdrop-blur-xl border border-outline-variant/30 rounded-full px-6 py-3 flex items-center justify-between shadow-lg">
        
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold text-on-surface tracking-tight">
          Peppery House
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Auth & Cart */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link 
            href="/cart"
            className="relative flex items-center justify-center p-2 rounded-full hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">shopping_cart</span>
            {mounted && cartCount > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-surface-container shadow-sm"
              >
                {cartCount}
              </motion.div>
            )}
          </Link>

          {/* Auth State */}
          {mounted && (
            user ? (
              <UserDropdown user={user} />
            ) : (
              <div className="hidden sm:flex items-center gap-3 border-l border-outline-variant/30 pl-4">
                <Link href="/login" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="text-sm font-medium bg-primary text-on-primary px-4 py-2 rounded-full hover:bg-caramel transition-colors">
                  Sign Up
                </Link>
              </div>
            )
          )}
        </div>

      </div>
    </motion.nav>
  );
}
