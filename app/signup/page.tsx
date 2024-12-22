'use client'

import { Suspense } from 'react'
import { PublicLogo } from '@/components/PublicLogo'
import { Footer } from '@/components/Footer'
import SignupForm from '@/components/Auth/SignupForm'

export default function SignupPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <PublicLogo />
      <Suspense fallback={<div>Loading signup form...</div>}>
        <SignupForm />
      </Suspense>
      <Footer />
    </div>
  )
}
