'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { usePasswordReset } from '@/hooks/auth/usePasswordReset'

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isRouting, setIsRouting] = useState(false)
  const { resetPasswordConfirm, isLoading, error } = usePasswordReset()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!token || !email) {
      return // Or handle invalid token/email case
    }

    setIsRouting(true)
    try {
      await resetPasswordConfirm({ token, email, password })
      // Route to /goals after 1.5s
      setTimeout(() => {
        window.location.href = '/goals'
      }, 1500)
      // Keep button disabled for 3s
      await new Promise((resolve) => setTimeout(resolve, 3000))
    } catch {
      // Error handled by hook
    } finally {
      setIsRouting(false)
    }
  }

  const isValidForm =
    password &&
    confirmPassword &&
    password === confirmPassword &&
    password.length >= 8

  return (
    <AuthCard title='Reset password' description='Enter your new password'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Input
            type='password'
            placeholder='New password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required
            disabled={isLoading || isRouting}
            className={error ? 'border-destructive' : ''}
          />
        </div>
        <div className='space-y-2'>
          <Input
            type='password'
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
            }}
            required
            disabled={isLoading || isRouting}
            className={error ? 'border-destructive' : ''}
          />
        </div>
        {error && (
          <Alert variant='destructive' className='mb-0'>
            {error}
          </Alert>
        )}
        <Button
          type='submit'
          className='w-full'
          disabled={isLoading || isRouting || !isValidForm}
        >
          {isLoading || isRouting ? 'Resetting password...' : 'Reset password'}
        </Button>
        <div className='text-sm text-center'>
          <Link href='/login' className='text-blue-600 hover:underline'>
            Back to login
          </Link>
        </div>
      </form>
    </AuthCard>
  )
}
