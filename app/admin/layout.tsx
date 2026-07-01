"use client"
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import { Toaster } from 'react-hot-toast'

import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-surface font-sans text-on-surface">
        {children}
        <Toaster position="top-right" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-surface font-sans text-on-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full min-w-0">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
