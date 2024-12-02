'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import Link from 'next/link'
import useAuth from '@/hooks/useAuth'

export default function VerifyEmailContent() {
  const { verifyEmail, resendVerificationEmail, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [isResending, setIsResending] = useState(false)

  const email = searchParams.get('email')

  useEffect(() => {
    const verifyUserEmail = async () => {
      const token = searchParams.get('token')
      if (!token || !email) {
        setStatus('error')
        return
      }

      try {
        await verifyEmail(token, email)
        setTimeout(() => setStatus('success'), 1000)
      } catch (error) {
        console.error(error)
        setStatus('error')
      }
    }

    verifyUserEmail()
  }, [searchParams, verifyEmail, email])

  const handleResendVerification = async () => {
    if (!email || isResending) return

    setIsResending(true)
    try {
      await resendVerificationEmail()
    } catch (error) {
      console.error(error)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthCard
      title={
        status === 'loading'
          ? 'Verifying your email...'
          : status === 'success'
            ? 'Email verified!'
            : 'Verification failed'
      }
      description={
        status === 'loading'
          ? 'Please wait while we verify your email address.'
          : status === 'success'
            ? 'Your email has been successfully verified. You can now log in to your account.'
            : 'We could not verify your email address. The link may have expired or is invalid.'
      }
    >
      {status === 'error' && email && (
        <Button
          variant='outline'
          className='w-full mb-4'
          onClick={handleResendVerification}
          disabled={isResending}
        >
          {isResending ? 'Sending...' : 'Resend verification email'}
        </Button>
      )}

      {status !== 'loading' && (
        <Link href='/login'>
          <Button className='w-full' disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Go to login'}
          </Button>
        </Link>
      )}
    </AuthCard>
  )
}
