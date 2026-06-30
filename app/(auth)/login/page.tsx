"use client"
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setIsLoading(false)
      toast.error(error.message)
      return
    }

    toast.success("Successfully logged in!")
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface-container-low p-8 rounded-2xl shadow-xl border border-outline-variant/30">
        <div className="text-center">
          <Link href="/" className="font-serif text-3xl font-bold text-primary">Peppery House</Link>
          <h2 className="mt-6 text-2xl font-bold text-on-surface font-serif">Welcome back</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Please sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Email address</label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-on-surface">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:text-caramel">
                  Forgot password?
                </Link>
              </div>
              <input
                {...register("password")}
                type="password"
                className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-on-primary bg-primary hover:bg-caramel focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-on-surface-variant">
          Don't have an account?{' '}
          <Link href={`/signup?redirect=${redirect}`} className="font-medium text-primary hover:text-caramel transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
