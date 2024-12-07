'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthCard } from '@/components/form-components'
import { useEmailVerification } from '@/hooks/auth/useEmailVerification'
import { PublicLogo } from '@/components/PublicLogo'
import Loading from '@/components/ui/loading'

export default function VerifyEmailContent() {
  const [hasVerified, setHasVerified] = useState(false)
  const { verifyEmail } = useEmailVerification()
  const searchParams = useSearchParams()

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token || !email || hasVerified) {
        return
      }

      setHasVerified(true)
      try {
        await verifyEmail(token, email)
      } catch {
        // Error handled by hook with toast
      }
    }

    verifyEmailToken()
  }, [token, email, verifyEmail, hasVerified])

  return (
    <>
      <PublicLogo />
      <AuthCard
        title='Verifying your email...'
        description='Please wait while we verify your email address.'
      >
        <Loading />
      </AuthCard>
    </>
  )
}
