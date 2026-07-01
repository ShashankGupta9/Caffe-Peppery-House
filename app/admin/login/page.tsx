"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Loader2, ShieldAlert } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    
    // 1. Authenticate with Supabase
    const { error, data: authData } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error || !authData.user) {
      setIsLoading(false)
      toast.error(error?.message || 'Authentication failed')
      return
    }

    // 2. Verify Role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error("Profile fetch error:", profileError)
      setIsLoading(false)
      await supabase.auth.signOut()
      toast.error(`Profile Error: ${profileError.message} (Is the profiles table empty?)`)
      return
    }

    if (!profile || profile.role !== 'admin') {
      console.error("Unauthorized role:", profile?.role)
      setIsLoading(false)
      await supabase.auth.signOut()
      toast.error(`Unauthorized: Your current role is '${profile?.role || 'none'}', not 'admin'.`)
      return
    }

    toast.success("Welcome back, Administrator")
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 sm:p-12 border border-outline-variant shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
            <ShieldAlert size={32} className="text-raisin" />
          </div>
          <h1 className="font-display text-2xl font-bold text-raisin tracking-widest uppercase">Admin Portal</h1>
          <p className="mt-2 text-sm text-on-surface-variant font-light">
            Secure administrative access only.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-raisin mb-2">Admin Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-raisin transition-all outline-none text-raisin font-light placeholder-outline-variant"
                placeholder="admin@pepperyhouse.com"
              />
              {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-raisin mb-2">Password</label>
              <input
                {...register("password")}
                type="password"
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-raisin transition-all outline-none text-raisin font-light placeholder-outline-variant"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-4 border border-raisin text-sm font-bold tracking-widest uppercase text-white bg-raisin hover:bg-white hover:text-raisin transition-colors disabled:opacity-50 mt-8"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
