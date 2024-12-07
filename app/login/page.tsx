/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import useAuth from '@/hooks/useAuth'
import { PublicLogo } from '@/components/PublicLogo'
import { Footer } from '@/components/Footer'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await login(email, password)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidForm = email && password && validateEmail(email)

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <PublicLogo />
      <AuthCard
        title='Login'
        description='Enter your credentials to access your account'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
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
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
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
          <Button
            type='submit'
            className='w-full'
            disabled={isLoading || !isValidForm}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </AuthCard>
      <Footer />
    </div>
  )
}
