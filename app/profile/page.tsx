"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import toast from "react-hot-toast"
import { Loader2, User } from "lucide-react"

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phoneNumber: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema)
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (profile) {
          setValue('fullName', profile.full_name)
          setValue('phoneNumber', profile.phone_number || '')
        } else {
          // Fallback to user metadata
          setValue('fullName', user.user_metadata?.full_name || '')
        }
      }
      setLoading(false)
    }
    fetchProfile()
  }, [supabase, setValue])

  const onSubmit = async (data: ProfileFormValues) => {
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        email: user.email // keep email synced
      })

      if (error) throw error
      toast.success("Profile updated successfully")
      
      // Also update auth user metadata
      await supabase.auth.updateUser({
        data: { full_name: data.fullName }
      })
      
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-4xl text-on-surface font-bold mb-8">My Profile</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center text-3xl font-bold shadow-md">
                {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <User size={32} />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">{user?.user_metadata?.full_name || 'User'}</h2>
                <p className="text-on-surface-variant">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Email (Read Only)</label>
                <input 
                  type="email" 
                  disabled 
                  value={user?.email || ''} 
                  className="w-full px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-on-surface-variant opacity-70 cursor-not-allowed" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Full Name</label>
                <input 
                  {...register("fullName")}
                  className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface" 
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Phone Number</label>
                <input 
                  {...register("phoneNumber")}
                  className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface" 
                  placeholder="+91-XXXXXXXXXX"
                />
                {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>}
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 disabled:opacity-50 transition-all"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}

