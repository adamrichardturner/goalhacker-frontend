/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useSearchParams } from 'next/navigation'
import { PublicLogo } from '@/components/PublicLogo'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!token || !email) {
      setError('Invalid reset link. Please request a new one.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      await resetPassword(token, email, password)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isValidForm =
    password &&
    confirmPassword &&
    password === confirmPassword &&
    password.length >= 8

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <PublicLogo />
      <AuthCard title='Reset password' description='Enter your new password'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Input
              type='password'
              placeholder='New password'
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
          <div className='space-y-2'>
            <Input
              type='password'
              placeholder='Confirm new password'
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError(null)
              }}
              required
              disabled={isLoading}
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
            disabled={isLoading || !isValidForm}
          >
            {isLoading ? 'Resetting password...' : 'Reset password'}
          </Button>
          <div className='text-sm text-center'>
            <Link href='/login' className='text-blue-600 hover:underline'>
              Back to login
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  )
}
