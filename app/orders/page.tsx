"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Package, Clock, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

export default function OrdersPage() {
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
      case 'new': return 'text-blue-500 bg-blue-500/10'
      case 'preparing': return 'text-orange-500 bg-orange-500/10'
      case 'ready': return 'text-green-500 bg-green-500/10'
      case 'completed': return 'text-gray-500 bg-gray-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl text-on-surface font-bold mb-8">My Orders</h1>
        
        {success && (
          <div className="mb-8 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
            <CheckCircle className="text-green-600" />
            Your order was successfully placed!
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-outline-variant/30">
            <Package className="mx-auto h-12 w-12 text-outline mb-4" />
            <h3 className="text-lg font-medium text-on-surface">No orders yet</h3>
            <p className="text-on-surface-variant mt-2 mb-6">You haven't placed any orders yet.</p>
            <Link href="/menu" className="text-primary hover:underline">Start ordering</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-outline-variant/20 bg-surface flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">Order #{order.id.slice(0,8)}</p>
                    <p className="text-sm text-on-surface-variant flex items-center gap-1">
                      <Clock size={14} /> {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-on-surface-variant">Total Amount</p>
                      <p className="font-bold text-on-surface">₹{order.grand_total}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    {order.order_items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-surface-container-highest">
                          {item.menu_items?.image_url ? (
                            <Image src={item.menu_items.image_url} alt={item.menu_items.name} fill className="object-cover" />
                          ) : (
                            <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-outline" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-on-surface">{item.menu_items?.name}</p>
                          <p className="text-sm text-on-surface-variant">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-on-surface">₹{item.price_at_time * item.quantity}</p>
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
