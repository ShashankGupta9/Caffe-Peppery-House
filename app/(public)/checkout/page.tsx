"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { useCartStore } from "@/hooks/useCart"
import { calculateTotal, openRazorpay, loadRazorpayScript } from "@/lib/razorpay"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

const addressSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
})

type AddressFormValues = z.infer<typeof addressSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const supabase = createClient()
  const { items, subtotal, clear } = useCartStore()
  const { deliveryCharge, gst, total } = calculateTotal(subtotal())
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema)
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (profile) {
          setValue("fullName", profile.full_name || "")
          setValue("phone", profile.phone_number || "")
        }
      } else {
        router.push("/login?redirect=/checkout")
      }
    }
    fetchProfile()
  }, [supabase, router, setValue])

  const onSubmit = async (data: AddressFormValues) => {
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setLoading(true)
    try {
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?")
        setLoading(false)
        return
      }

      // Create order on backend (mocked or actual)
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "delivery",
          items: items.map(i => ({
            menu_item_id: i.menu_item.id,
            quantity: i.quantity,
            price_at_order: i.menu_item.price
          })),
          customer_name: data.fullName,
          customer_phone: data.phone
        })
      })

      const paymentData = await res.json()
      if (!res.ok) throw new Error(paymentData.error || "Failed to create order")

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Peppery House",
        description: "Coffee & Food Order",
        order_id: paymentData.id,
        handler: async function (response: any) {
          try {
            // Wait, we need to save the order to Supabase!
            // Instead of just verifying, let's create the order record.
            const { data: newOrder, error: orderError } = await supabase.from('orders').insert({
              user_id: user.id,
              total_amount: subtotal(),
              delivery_charge: deliveryCharge,
              grand_total: total,
              payment_method: "Razorpay",
              payment_status: "paid",
              order_status: "new",
              delivery_address: data
            }).select().single()

            if (orderError) throw orderError

            // Insert order items
            const orderItemsToInsert = items.map(i => ({
              order_id: newOrder.id,
              menu_item_id: i.menu_item.id,
              quantity: i.quantity,
              price_at_time: i.menu_item.price
            }))

            const { error: itemsError } = await supabase.from('order_items').insert(orderItemsToInsert)
            if (itemsError) throw itemsError

            toast.success("Payment successful! Your order is placed.")
            clear()
            
            // Also clear cart in DB
            const { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).single()
            if (cart) {
               await supabase.from('cart_items').delete().eq('cart_id', cart.id)
            }

            router.push(`/orders?success=true`)
          } catch (err: any) {
            toast.error("Failed to save order details.")
          }
        },
        prefill: {
          name: data.fullName,
          contact: data.phone,
          email: user?.email || ""
        },
        theme: {
          color: "#C87740"
        }
      }

      openRazorpay(options as any)
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-on-surface">Your Cart is Empty</h2>
          <button onClick={() => router.push('/menu')} className="mt-4 text-primary hover:underline">Go to Menu</button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl text-on-surface font-bold mb-8 border-b border-outline-variant/30 pb-4">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Address Form */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
            <h2 className="text-xl font-bold font-serif text-on-surface mb-6">Delivery Details</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Full Name</label>
                <input {...register("fullName")} className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-primary outline-none" />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Phone Number</label>
                <input {...register("phone")} className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-primary outline-none" />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Street Address</label>
                <input {...register("street")} className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-primary outline-none" />
                {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">City</label>
                  <input {...register("city")} className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-primary outline-none" />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Pincode</label>
                  <input {...register("pincode")} className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-primary outline-none" />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 bg-primary text-on-primary py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Pay via Razorpay"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 shadow-sm h-fit sticky top-24">
            <h2 className="text-xl font-bold font-serif text-on-surface mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.menu_item.id} className="flex justify-between text-sm text-on-surface-variant">
                  <span>{item.quantity}x {item.menu_item.name}</span>
                  <span>₹{item.menu_item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-outline-variant/30 pt-4 space-y-2 text-sm text-on-surface-variant font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>₹{deliveryCharge}</span>
              </div>
            </div>
            <div className="border-t border-outline-variant/30 pt-4 mt-4 flex justify-between text-lg font-bold text-on-surface">
              <span>Total</span>
              <span className="text-primary">₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
