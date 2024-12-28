'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import { useLogin } from '@/hooks/auth/useLogin'
import { PublicLogo } from '@/components/PublicLogo'
import { Footer } from '@/components/Footer'
import { GoogleButton } from '@/components/ui/google-button'
import { Separator } from '@/components/ui/separator'

export const dynamic = 'force-dynamic' // Disable prerendering for this page

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRouting, setIsRouting] = useState(false)
  const { login, isLoading, error } = useLogin()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsRouting(true)

    try {
      await login({ email, password })
      // Keep button disabled for 500ms while routing
      await new Promise((resolve) => setTimeout(resolve, 1100))
    } catch {
      // Error handled by mutation
    } finally {
      setIsRouting(false)
    }
  }

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth/google`
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidForm = email && password && validateEmail(email)
  const isDisabled = isLoading || isRouting || !isValidForm

  return (
    <div className='flex h-full px-4 sm:px-0 flex-col items-center justify-center'>
      <PublicLogo />
      <AuthCard
        title='Login'
        description='Enter your credentials to access your account'
      >
        <GoogleButton onClick={handleGoogleSignIn} />
        <div className='relative my-4'>
          <div className='absolute inset-0 flex items-center'>
            <Separator />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-white px-2 text-muted-foreground'>
              Or continue with
            </span>
          </div>
        </div>
        <form key='login-form' onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className={error ? 'border-destructive' : ''}
            />
          </div>
          <div className='space-y-2'>
            <Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className={error ? 'border-destructive' : ''}
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
          {error && (
            <Alert variant='destructive' className='mb-0'>
              {error}
            </Alert>
          )}
          <Button type='submit' className='w-full' disabled={isDisabled}>
            {isLoading || isRouting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </AuthCard>
      <Footer />
    </div>
  )
}
