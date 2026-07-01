import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Coffee, 
  Package, 
  Bot, 
  Users, 
  BarChart3, 
  Ticket, 
  Star, 
  Bell, 
  ShieldCheck, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAdminStore } from '@/store/useAdminStore'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Menu', href: '/admin/menu', icon: Coffee },
  { name: 'Inventory', href: '/admin/inventory', icon: Package },
  { name: 'AI Assistant', href: '/admin/ai', icon: Bot, isSpecial: true },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Staff', href: '/admin/staff', icon: ShieldCheck },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Security', href: '/admin/security', icon: ShieldCheck },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, toggleSidebar } = useAdminStore()

  return (
    <aside 
      className={cn(
        "bg-surface-container-low border-r border-outline-variant/30 text-on-surface h-screen sticky top-0 flex flex-col transition-all duration-300 z-50",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-outline-variant/30">
        {isSidebarOpen && (
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-primary truncate flex-1">
            Peppery House
          </Link>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant ml-auto"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high",
                item.isSpecial && !isActive && "text-caramel hover:text-caramel/90"
              )}
            >
              <Icon size={20} className={cn(
                "flex-shrink-0",
                isActive ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface",
                item.isSpecial && "text-caramel"
              )} />
              
              {isSidebarOpen && (
                <span className="truncate">{item.name}</span>
              )}

              {/* Tooltip for collapsed state */}
              {!isSidebarOpen && (
                <div className="absolute left-14 bg-surface-container-highest text-on-surface px-2 py-1 rounded text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-outline-variant/30">
        <button 
          onClick={async () => {
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.href = '/admin/login'
          }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          {isSidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}

