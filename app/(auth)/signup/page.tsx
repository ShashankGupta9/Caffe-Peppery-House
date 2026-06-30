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

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      }
    })

    setIsLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-6 bg-surface-container-low p-8 rounded-2xl shadow-xl border border-outline-variant/30">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">mail</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface font-serif">Check your email</h2>
          <p className="text-on-surface-variant">
            We've sent a verification link to your email address. Please verify your email to continue.
          </p>
          <Link href="/login" className="inline-block mt-4 text-primary font-medium hover:underline">
            Return to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 bg-surface-container-low p-8 rounded-2xl shadow-xl border border-outline-variant/30">
        <div className="text-center">
          <Link href="/" className="font-serif text-3xl font-bold text-primary">Peppery House</Link>
          <h2 className="mt-6 text-2xl font-bold text-on-surface font-serif">Create an account</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Join us for a premium coffee experience
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Full Name</label>
              <input
                {...register("fullName")}
                type="text"
                className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface"
                placeholder="John Doe"
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
            </div>
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
              <label className="block text-sm font-medium text-on-surface mb-1">Password</label>
              <input
                {...register("password")}
                type="password"
                className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-on-primary bg-primary hover:bg-caramel focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link href={`/login?redirect=${redirect}`} className="font-medium text-primary hover:text-caramel transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
