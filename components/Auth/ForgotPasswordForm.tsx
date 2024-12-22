'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { usePasswordReset } from '@/hooks/auth/usePasswordReset'
import { Alert } from '@/components/ui/alert'

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

  return (
    <div className='grid gap-6'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Input
              id='email'
              name='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label='Email address'
            />
          </div>
          {error && (
            <Alert variant='destructive' role='alert'>
              {error}
            </Alert>
          )}
          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                Sending...
              </>
            ) : (
              'Reset password'
            )}
          </Button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Or</span>
        </div>
      </div>
      <Link
        href='/login'
        className='text-sm text-muted-foreground hover:text-primary text-center'
      >
        Back to login
      </Link>
    </div>
  )
}
