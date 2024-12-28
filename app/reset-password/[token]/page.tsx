'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { PublicLogo } from '@/components/PublicLogo'
import { useSettings } from '@/hooks/useSettings'
import { Footer } from '@/components/Footer'

interface Props {
  params: Promise<{ token: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default function ResetPasswordPage({ params }: Props) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { resetPassword, isResettingPassword } = useSettings()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    try {
      const { token } = await params // Await the params promise to get the token
      await resetPassword({ token, password })
    } catch {
      setError('Failed to reset password. Please try again.')
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-0'>
      <PublicLogo size='lg' />
      <div className='w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-sm'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Reset Password
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Input
              type='password'
              placeholder='New password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isResettingPassword}
            />
          </div>
          <div className='space-y-2'>
            <Input
              type='password'
              placeholder='Confirm new password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isResettingPassword}
            />
          </div>

          {error && <Alert variant='destructive'>{error}</Alert>}

          <Button
            type='submit'
            className='w-full'
            disabled={isResettingPassword || !password || !confirmPassword}
          >
            {isResettingPassword ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  )
}
