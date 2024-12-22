'use client'

import { Suspense } from 'react'
import { PublicLogo } from '@/components/PublicLogo'
import { Footer } from '@/components/Footer'
import LoginForm from '@/components/Auth/LoginForm'

export default function LoginPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <PublicLogo />
      <Suspense fallback={<div>Loading login form...</div>}>
        <LoginForm />
      </Suspense>
      <Footer />
    </div>
  )
}
