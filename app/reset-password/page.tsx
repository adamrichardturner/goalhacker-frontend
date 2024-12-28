'use client'

import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import ResetPasswordClient from './ResetPasswordClient'
import { PublicLogo } from '@/components/PublicLogo'
import { Footer } from '@/components/Footer'

function ResetPasswordSkeleton() {
  return (
    <div className='w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-sm'>
      <div className='space-y-2 text-center'>
        <Skeleton className='h-8 w-48 mx-auto' />
        <Skeleton className='h-4 w-64 mx-auto' />
      </div>
      <div className='space-y-4'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
      </div>
      <Skeleton className='h-4 w-32 mx-auto' />
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-0'>
      <PublicLogo />
      <Suspense fallback={<ResetPasswordSkeleton />}>
        <ResetPasswordClient />
      </Suspense>
      <Footer />
    </div>
  )
}
