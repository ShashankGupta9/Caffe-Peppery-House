"use client"
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { User, LogOut, Package, Settings, Heart } from 'lucide-react'

export default function UserDropdown({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error logging out')
    } else {
      toast.success('Logged out successfully')
      router.push('/')
      router.refresh()
    }
  }

  const userInitial = user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold shadow-md hover:scale-105 transition-transform">
          {userInitial}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-surface-container-high rounded-xl shadow-2xl border border-outline-variant/30 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-3 border-b border-outline-variant/20">
            <p className="text-sm font-medium text-on-surface truncate">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
          </div>
          
          <div className="py-2">
            <Link 
              href="/profile" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-highest transition-colors"
            >
              <User size={16} className="text-on-surface-variant" /> My Profile
            </Link>
            <Link 
              href="/orders" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-highest transition-colors"
            >
              <Package size={16} className="text-on-surface-variant" /> My Orders
            </Link>
            <Link 
              href="/wishlist" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-highest transition-colors"
            >
              <Heart size={16} className="text-on-surface-variant" /> Wishlist
            </Link>
            <Link 
              href="/settings" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-highest transition-colors"
            >
              <Settings size={16} className="text-on-surface-variant" /> Settings
            </Link>
          </div>

          <div className="border-t border-outline-variant/20 py-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-surface-container-highest transition-colors text-left"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
