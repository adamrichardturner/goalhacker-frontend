'use client'

import { notFound } from 'next/navigation'
import { useGoal } from '@/hooks/useGoal'
import { Skeleton } from '@/components/ui/skeleton'
import GoalDetails from '@/components/GoalDetails'
import Header from '@/components/Header'
import { useUser } from '@/hooks/auth/useUser'
import { Suspense } from 'react'

interface GoalPageClientProps {
  params: {
    id: string
  }
}

export default function GoalPageClient({ params }: GoalPageClientProps) {
  const { goal, isLoading, isError } = useGoal(params.id)
  const { user } = useUser()

  if (isError) {
    notFound()
  }

  if (!user || !goal) {
    return null
  }

  return (
    <div className='container min-h-screen flex flex-col gap-4 px-0 sm:px-4 w-full'>
      <Header user={user} />
      <main className='flex-1'>
        <div className='max-w-5xl mx-auto px-0'>
          {isLoading ? (
            <div className='sm:space-y-4'>
              <Skeleton className='h-[300px] w-full' />
              <div className='px-6 space-y-4'>
                <Skeleton className='h-8 w-64' />
                <Skeleton className='h-24 w-full' />
                <Skeleton className='h-24 w-full' />
              </div>
            </div>
          ) : goal ? (
            <Suspense
              fallback={
                <div className='space-y-4'>
                  <Skeleton className='h-[300px] w-full' />
                  <div className='px-6 space-y-4'>
                    <Skeleton className='h-8 w-64' />
                    <Skeleton className='h-24 w-full' />
                    <Skeleton className='h-24 w-full' />
                  </div>
                </div>
              }
            >
              <GoalDetails goal={goal} />
            </Suspense>
          ) : null}
        </div>
      </main>
    </div>
  )
}
