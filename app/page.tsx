'use client'

import LandingPage from '@/components/LandingPage'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'

function HomePageSkeleton() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-8 w-[200px]' />
      <div className='grid gap-4'>
        <Skeleton className='h-[200px] rounded-2xl' />
      </div>
    </div>
  )
}

function HomeContent() {
  return <LandingPage />
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent />
    </Suspense>
  )
}
