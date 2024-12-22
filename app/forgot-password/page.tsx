'use client'

import { Suspense } from 'react'
import { PublicLogo } from '@/components/PublicLogo'
import { Footer } from '@/components/Footer'
import { ForgotPasswordForm } from '@/components/Auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:px-0">
      <div className="w-full max-w-[400px] mx-auto">
        <PublicLogo />
        <Suspense fallback={<div>Loading form...</div>}>
          <ForgotPasswordForm />
        </Suspense>
        <Footer />
      </div>
    </div>
  )
}
