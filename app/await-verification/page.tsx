'use client'

import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import VerificationClient from './VerificationClient'
import { PublicLogo } from '@/components/PublicLogo'
import { Footer } from '@/components/Footer'

function VerificationSkeleton() {
  return (
    <div className='w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-sm'>
      <div className='space-y-2 text-center'>
        <Skeleton className='h-8 w-48 mx-auto' />
        <Skeleton className='h-4 w-64 mx-auto' />
      </div>
      <div className='space-y-4'>
        <Skeleton className='h-16 w-full rounded-lg' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-4 w-48 mx-auto' />
        <div className='pt-4 border-t'>
          <Skeleton className='h-4 w-64 mx-auto' />
        </div>
      </div>
    </div>
  )
}

export default function AwaitVerificationPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-0'>
      <PublicLogo />
      <Suspense fallback={<VerificationSkeleton />}>
        <VerificationClient />
      </Suspense>
      <Footer />
    </div>
  )
}
