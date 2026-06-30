import { Bell, Search, UserCircle } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="h-16 border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center bg-surface-container-low rounded-full px-4 py-1.5 w-full max-w-md border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
        <Search size={18} className="text-on-surface-variant" />
        <input 
          type="text" 
          placeholder="Search orders, customers, or menu items..." 
          className="bg-transparent border-none outline-none text-sm text-on-surface w-full ml-2 placeholder:text-on-surface-variant/50"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        <div className="h-8 w-px bg-outline-variant/30"></div>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-on-surface leading-tight">Admin User</p>
            <p className="text-xs text-on-surface-variant">Manager</p>
          </div>
          <UserCircle size={32} className="text-primary" />
        </button>
      </div>
    </header>
  )
}
