import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import SettingsClient from './SettingsClient'

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className='container flex flex-col gap-6 sm:px-4 w-full'>
          {/* Header skeleton */}
          <div className='flex items-center justify-between'>
            <Skeleton className='h-12 w-48' />
            <Skeleton className='h-10 w-10 rounded-full' />
          </div>

          {/* Main content skeleton */}
          <div className='flex flex-col gap-4 w-full sm:px-0 rounded-2xl'>
            <main className='flex flex-col gap-4 w-full bg-card px-8 py-12 sm:px-12 sm:py-12 rounded-2xl shadow-sm'>
              <Skeleton className='h-8 w-32 mb-4' /> {/* Settings title */}
              <div className='space-y-6'>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className='space-y-2'>
                    <Skeleton className='h-6 w-48' /> {/* Setting label */}
                    <Skeleton className='h-10 w-full' /> {/* Setting input */}
                  </div>
                ))}
              </div>
            </main>
          </div>

          {/* Footer skeleton */}
          <Skeleton className='h-16 w-full' />
        </div>
      }
    >
      <SettingsClient />
    </Suspense>
  )
}
