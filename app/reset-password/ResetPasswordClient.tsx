'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { AuthCard } from '@/components/form-components'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSettings } from '@/hooks/useSettings'

export default function ResetPasswordClient() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { resetPassword, isResettingPassword } = useSettings()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!token) {
      setError('Invalid reset token')
      return
    }

    try {
      await resetPassword({ token, password })
      router.push('/login?reset=success')
    } catch (error) {
      console.error(error)
      setError('Failed to reset password. Please try again.')
    }
  }

  return (
    <AuthCard
      title='Reset Password'
      description='Enter your new password below'
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-4'>
          <Input
            type='password'
            placeholder='New Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isResettingPassword}
          />
          <Input
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isResettingPassword}
          />
        </div>
        {error && (
          <Alert variant='destructive' className='mb-0'>
            {error}
          </Alert>
        )}
        <Button type='submit' className='w-full' disabled={isResettingPassword}>
          {isResettingPassword ? 'Resetting Password...' : 'Reset Password'}
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
