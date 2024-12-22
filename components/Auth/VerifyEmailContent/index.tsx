'use client'

import { useEffect, useState } from 'react'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useEmailVerification } from '@/hooks/auth/useEmailVerification'

export function VerifyEmailContent() {
  const [params, setParams] = useState<{
    token: string | null
    email: string | null
  }>({ token: null, email: null })
  const { verifyEmail } = useEmailVerification()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setParams({
      token: searchParams.get('token'),
      email: searchParams.get('email'),
    })
  }, [])

  useEffect(() => {
    const verifyToken = async () => {
      if (!params.token || !params.email) return
      setIsLoading(true)
      try {
        await verifyEmail(params.token, params.email)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed')
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [params.token, params.email, verifyEmail])

  if (!params.token || !params.email) {
    return <Alert variant="destructive">Invalid verification link. Please request a new one.</Alert>
  }

  if (error) {
    return <Alert variant="destructive">{error}</Alert>
  }

  return (
    <div className="space-y-4">
      <Alert>Verifying your email...</Alert>
      <Button disabled className="w-full">
        {isLoading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
        Please wait...
      </Button>
    </div>
  )
}
