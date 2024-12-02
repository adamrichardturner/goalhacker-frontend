'use client'

import { Suspense } from 'react'
import { AuthCard } from '@/components/form-components'
import Loading from '@/components/ui/loading'
import VerifyEmailContent from '@/components/Auth/VerifyEmailContent'

export default function VerifyEmailPage() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Suspense
        fallback={
          <AuthCard
            title='Verifying your email...'
            description='Please wait while we verify your email address.'
          >
            <Loading />
          </AuthCard>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
