/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import { useEmailVerification } from '@/hooks/auth/useEmailVerification'
import { processAuthError } from '@/utils/auth-errors'

type VerificationStatus = 'loading' | 'success' | 'error'

export default function VerifyEmailContent() {
  const [isResending, setIsResending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [hasVerified, setHasVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<VerificationStatus>('loading')
  const { verifyEmail, resendVerification } = useEmailVerification()
  const searchParams = useSearchParams()

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token || !email || hasVerified) {
        return
      }

      setIsVerifying(true)
      setHasVerified(true)

      try {
        await verifyEmail(token, email)
        setStatus('success')
        // Delay redirect to show success message
        await new Promise((resolve) => setTimeout(resolve, 1100))
        window.location.href = '/login'
      } catch (err) {
        setError(processAuthError(err))
        setStatus('error')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyEmailToken()
  }, [token, email, verifyEmail, hasVerified])

  const handleResendVerification = async () => {
    if (!email || isResending || hasVerified) return
    setIsResending(true)
    try {
      await resendVerification(email)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <Link href='/' className='w-full pb-6 flex justify-center'>
        <img src='/goalhacker-logo.svg' alt='GoalHacker' className='w-1/2' />
      </Link>
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
        <div className='space-y-4'>
          {status === 'success' && (
            <Alert variant='success' className='dark:text-white'>
              Your email has been verified successfully!
            </Alert>
          )}

          {status === 'error' && (
            <>
              <Alert variant='destructive' className='dark:text-white'>
                {error}
              </Alert>
              {email && (
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={handleResendVerification}
                  disabled={isResending || isVerifying || hasVerified}
                >
                  {isResending ? 'Sending...' : 'Resend verification email'}
                </Button>
              )}
            </>
          )}

          {status !== 'loading' && (
            <Link href='/login' className='block'>
              <Button className='w-full'>Go to login</Button>
            </Link>
          )}
        </div>
      </AuthCard>
    </div>
  )
}
