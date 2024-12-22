'use client'

import { Suspense } from 'react'
import { AuthCard } from '@/components/form-components'
import Loading from '@/components/ui/loading'
import { VerifyEmailContent } from '@/components/Auth/VerifyEmailContent'
import { Footer } from '@/components/Footer'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="flex flex-col items-center space-y-6">
              <AuthCard
                title="Verifying your email..."
                description="Please wait while we verify your email address."
              >
                <Loading />
              </AuthCard>
            </div>
          }
        >
          <div className="flex flex-col items-center space-y-6">
            <VerifyEmailContent />
          </div>
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
