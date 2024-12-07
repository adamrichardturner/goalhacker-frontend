/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { PublicLogo } from '@/components/PublicLogo'
import { processAuthError } from '@/utils/auth-errors'
import { Footer } from '@/components/Footer'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { forgotPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await forgotPassword(email)
      setSubmitted(true)
    } catch (err) {
      setError(processAuthError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidForm = email && validateEmail(email)

  if (submitted) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <PublicLogo />
        <AuthCard
          title='Check your email'
          description="We've sent you a password reset link to your email address."
        >
          <Link href='/login'>
            <Button className='w-full'>Return to login</Button>
          </Link>
        </AuthCard>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <PublicLogo />
      <AuthCard
        title='Forgot password'
        description="Enter your email address and we'll send you a reset link"
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
          {error && (
            <Alert variant='destructive' className='mb-0 dark:text-white'>
              {error}
            </Alert>
          )}
          <Button
            type='submit'
            className='w-full'
            disabled={isLoading || !isValidForm}
          >
            {isLoading ? 'Sending reset link...' : 'Send reset link'}
          </Button>
          <div className='text-sm text-center'>
            <Link href='/login' className='text-blue-600 hover:underline'>
              Back to login
            </Link>
          </div>
        </form>
      </AuthCard>
      <Footer />
    </div>
  )
}
