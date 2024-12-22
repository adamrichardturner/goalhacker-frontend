'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { usePasswordReset } from '@/hooks/auth/usePasswordReset'
import { Alert } from '@/components/ui/alert'
import { AuthCard } from '@/components/form-components'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const { forgotPasswordRequest, isLoading, error } = usePasswordReset()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await forgotPasswordRequest(email)
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidForm = email && validateEmail(email)
  const isDisabled = isLoading || !isValidForm

  return (
    <AuthCard
      title='Reset Password'
      description="Enter your email address and we'll send you a link to reset your password."
    >
      <form onSubmit={handleSubmit} className='space-y-6'>
        <Input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className='h-12 px-4 text-base'
        />
        {error && <Alert variant='destructive'>{error}</Alert>}
        <Button
          type='submit'
          className='w-full h-12 text-base'
          disabled={isDisabled}
          size='lg'
        >
          {isLoading ? (
            <>
              <div className='mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent' />
              Sending...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
        <div className='pt-2'>
          <Link
            href='/login'
            className='w-full py-4 text-base text-center text-blue-600 active:text-blue-800 block touch-manipulation'
          >
            Back to login
          </Link>
        </div>
      </form>
    </AuthCard>
  )
}
