"use client"
import { useEffect, useState, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { Package, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

function OrdersContent() {
  const supabase = createClient()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              price_at_time,
              menu_items (
                name,
                image_url
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        setOrders(data || [])
      }
      setLoading(false)
    }
    fetchOrders()
  }, [supabase])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'text-primary'
      case 'preparing': return 'text-orange-500'
      case 'ready': return 'text-green-500'
      case 'completed': return 'text-raisin'
      default: return 'text-raisin'
    }
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-5xl text-raisin font-bold mb-16 border-b border-outline-variant pb-8">My Orders</h1>
        
        {success && (
          <div className="mb-12 p-6 border border-raisin text-raisin font-bold flex items-center gap-4 bg-surface">
            <CheckCircle className="text-primary" />
            Your order was successfully placed!
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-raisin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-32 border border-outline-variant bg-surface">
            <Package className="mx-auto h-16 w-16 text-outline-variant mb-6 font-light" />
            <h3 className="text-2xl font-bold font-display text-raisin mb-2">No orders yet</h3>
            <p className="text-on-surface-variant mb-8 font-light">You haven't placed any orders yet.</p>
            <Link href="/menu" className="border border-raisin text-raisin px-12 py-4 tracking-widest uppercase text-xs font-bold hover:bg-raisin hover:text-white transition-colors">Start ordering</Link>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order) => (
              <div key={order.id} className="border border-outline-variant bg-surface overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-outline-variant bg-surface flex flex-wrap justify-between items-center gap-6">
                  <div>
                    <p className="text-xs text-raisin uppercase tracking-widest font-bold mb-2">Order #{order.id.slice(0,8)}</p>
                    <p className="text-sm text-on-surface-variant flex items-center gap-2 font-light">
                      <Clock size={14} /> {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1">Total</p>
                      <p className="font-bold text-raisin text-lg">₹{order.grand_total}</p>
                    </div>
                    <span className={`tracking-widest text-xs font-bold uppercase ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 sm:p-8">
                  <div className="space-y-6">
                    {order.order_items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-6">
                        <div className="w-20 h-20 relative bg-surface-container-low">
                          {item.menu_items?.image_url ? (
                            <Image src={item.menu_items.image_url} alt={item.menu_items.name} fill className="object-cover" />
                          ) : (
                            <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-outline-variant" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold font-display text-xl text-raisin mb-1">{item.menu_items?.name}</p>
                          <p className="text-sm text-on-surface-variant font-light">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-raisin">₹{item.price_at_time * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-raisin"></div></div>}>
      <OrdersContent />
    </Suspense>
  )
}
