"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AuthCard } from "@/components/form-components"
import Link from "next/link"
import useAuth from "@/hooks/useAuth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { loginUser, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await loginUser({ email, password })
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <AuthCard
        title='Welcome back'
        description='Enter your credentials to access your account'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className='space-y-2'>
            <Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className='flex justify-between items-center text-sm'>
            <Link
              href='/forgot-password'
              className='text-blue-600 hover:underline'
            >
              Forgot password?
            </Link>
            <Link href='/signup' className='text-blue-600 hover:underline'>
              Create account
            </Link>
          </div>
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </AuthCard>
    </div>
  )
}
