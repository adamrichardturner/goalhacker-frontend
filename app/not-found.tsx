import { Suspense } from 'react'
import { Footer } from '@/components/Footer'
import { Skeleton } from '@/components/ui/skeleton'
import { ClientLogo } from '@/components/Logo'
import NotFoundContent from './not-found-content'

function NotFoundSkeleton() {
  return (
    <div className='max-w-md w-full px-6 py-12 text-center space-y-6'>
      <div className='flex justify-center'>
        <Skeleton className='h-8 w-48' />
      </div>
      <div className='space-y-4'>
        <Skeleton className='h-10 w-full mx-auto' />
        <Skeleton className='h-6 w-3/4 mx-auto' />
      </div>
      <div className='space-y-4'>
        <Skeleton className='h-12 w-full' />
        <div className='space-y-2'>
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-4 w-48 mx-auto' />
        </div>
      </div>
    </div>
  )
}

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-background'>
      <Suspense fallback={<NotFoundSkeleton />}>
        <NotFoundContent Logo={ClientLogo} />
      </Suspense>
      <Footer />
    </div>
  )
}
