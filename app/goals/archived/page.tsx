'use client'

import Header from '@/components/Header'
import GoalsView from '@/components/GoalsView'
import Loading from '@/components/ui/loading'
import { useGoal } from '@/hooks/useGoal'
import { useUser } from '@/hooks/auth/useUser'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function ArchivedGoalsSkeleton() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-8 w-[200px]' />
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className='h-[200px] rounded-xl' />
        ))}
      </div>
    </div>
  )
}

function ArchivedGoalsContent() {
  const { user, isLoading: userIsLoading } = useUser()
  const { goals, isLoading: goalsLoading } = useGoal()

  if (!user) {
    return null
  }

  return (
    <div className='container min-h-screen flex flex-col gap-6 pt-[20px] px-6 sm:px-4 w-full pb-12'>
      {userIsLoading ? (
        <Loading className='h-screen' />
      ) : (
        <Header user={user} />
      )}
      <div className='flex flex-col gap-4 w-full px-0 sm:px-0 rounded-lg'>
        <main className='flex flex-col gap-4 w-full bg-card px-4 sm:px-4 py-12 sm:py-12 rounded-lg shadow-sm'>
          <Suspense fallback={<Loading className='h-screen' />}>
            {goalsLoading ? (
              <Loading className='h-screen' />
            ) : (
              <GoalsView goals={goals} user={user} isArchived />
            )}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default function ArchivedGoalsPage() {
  return (
    <Suspense fallback={<ArchivedGoalsSkeleton />}>
      <ArchivedGoalsContent />
    </Suspense>
  )
}
