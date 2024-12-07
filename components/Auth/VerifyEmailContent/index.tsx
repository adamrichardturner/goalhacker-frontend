/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import useAuth from '@/hooks/useAuth'
import { useMutation } from '@tanstack/react-query'
import { processAuthError } from '@/utils/auth-errors'

type VerificationStatus = 'loading' | 'success' | 'error'

export default function VerifyEmailContent() {
  const { verifyEmail, resendVerificationEmail } = useAuth()
  const searchParams = useSearchParams()
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<VerificationStatus>('loading')

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token || !email) {
        setError('Invalid verification link')
        setStatus('error')
        return
      }

      try {
        await verifyEmail(token, email)
        setStatus('success')
      } catch (err) {
        setError(processAuthError(err))
        setStatus('error')
      }
    }

    verifyEmailToken()
  }, [token, email, verifyEmail])

  const resendMutation = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error('No email provided')
      return resendVerificationEmail(email)
    },
    onSettled: () => setIsResending(false),
  })

  const handleResendVerification = async () => {
    if (!email) return

    try {
      await resendVerificationEmail(email)
    } catch (err) {
      setError(processAuthError(err))
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
                  disabled={isResending || resendMutation.isPending}
                >
                  {isResending || resendMutation.isPending
                    ? 'Sending...'
                    : 'Resend verification email'}
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
