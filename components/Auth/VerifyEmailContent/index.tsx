/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import useAuth from '@/hooks/useAuth'
import { useQuery, useMutation } from '@tanstack/react-query'

interface VerificationResponse {
  success: boolean
  message?: string
}

export default function VerifyEmailContent() {
  const { verifyEmail, resendVerificationEmail } = useAuth()
  const searchParams = useSearchParams()
  const [isResending, setIsResending] = useState(false)

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const { data, isLoading, error } = useQuery<
    VerificationResponse,
    Error,
    VerificationResponse,
    [string, string | null, string | null]
  >({
    queryKey: ['emailVerification', email, token],
    queryFn: async () => {
      if (!email || !token) {
        return { success: false, message: 'Invalid verification link' }
      }
      try {
        await verifyEmail(token, email)
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
        return { success: true }
      } catch (err) {
        if (err instanceof Error) {
          return { success: false, message: err.message }
        }
        return { success: false, message: 'Verification failed' }
      }
    },
    retry: false,
    enabled: !!email && !!token,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const resendMutation = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error('No email provided')
      return resendVerificationEmail(email)
    },
    onSettled: () => setIsResending(false),
  })

  const handleResendVerification = async () => {
    if (!email || isResending) return
    setIsResending(true)
    resendMutation.mutate()
  }

  const getStatus = () => {
    if (isLoading) return 'loading'
    if (data?.success) return 'success'
    return 'error'
  }

  const status = getStatus()

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
            <Alert variant='success'>
              Your email has been verified successfully!
            </Alert>
          )}

          {status === 'error' && (
            <>
              <Alert variant='destructive'>
                {data?.message ||
                  (!email || !token
                    ? 'Invalid verification link. Please use the link from your email.'
                    : error instanceof Error
                      ? error.message
                      : 'Verification failed. The link may have expired.')}
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
