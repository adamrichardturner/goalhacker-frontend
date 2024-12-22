'use client'

import { Suspense, useState, useEffect } from 'react'
import { Logo } from '@/components/Logo'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useEmailVerification } from '@/hooks/auth/useEmailVerification'

function FormSkeleton() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
        <Skeleton className="h-[100px] w-full" />
      </div>
    </div>
  )
}

function VerificationContent() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Check Your Email</h1>
          <p className="text-sm text-muted-foreground">
            We sent you a verification link. Please check your email.
          </p>
        </div>
        <Suspense fallback={<FormSkeleton />}>
          <VerificationForm />
        </Suspense>
      </div>
    </div>
  )
}

export default function AwaitVerificationPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <VerificationContent />
    </Suspense>
  )
}

function VerificationForm() {
  const [email, setEmail] = useState<string | null>(null)
  const { resendVerification } = useEmailVerification()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setEmail(searchParams.get('email'))
  }, [])

  const handleResend = async () => {
    if (!email) return
    setIsLoading(true)
    try {
      await resendVerification(email)
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return (
      <Alert variant="destructive">Invalid verification link. Please try signing up again.</Alert>
    )
  }

  return (
    <div className="grid gap-4">
      <Alert>
        Verification email sent to: <strong>{email}</strong>
      </Alert>
      <Button onClick={handleResend} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Sending...
          </>
        ) : (
          'Resend verification email'
        )}
      </Button>
    </div>
  )
}
