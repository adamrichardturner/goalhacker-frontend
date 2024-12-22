'use client'

import { Suspense } from 'react'
import { useUser } from '@/hooks/auth/useUser'
import Header from '@/components/Header'
import GoalDetails from '@/components/GoalDetails'
import { Skeleton } from '@/components/ui/skeleton'
import { useGoal } from '@/hooks/useGoal'

function GoalSkeleton() {
  return (
    <div className='container min-h-screen max-w-3xl flex flex-col gap-6 sm:px-4 w-full'>
      <div className='w-full space-y-8'>
        <Skeleton className='h-[200px] w-full rounded-2xl' />
        <div className='space-y-4'>
          <Skeleton className='h-8 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-24 w-full' />
        </div>
      </div>
    </div>
  )
}

function GoalContent() {
  const searchParams = new URLSearchParams(window.location.search)
  const goalId = searchParams.get('id')
  const { user } = useUser()
  const { goals } = useGoal()
  const goal = goals?.find((g) => g.goal_id === goalId)

  if (!user || !goal) return null

  return (
    <div className='container min-h-screen max-w-3xl flex flex-col gap-6 sm:px-4 w-full'>
      <Header user={user} />
      <GoalDetails goal={goal} />
    </div>
  )
}

export default function GoalPage() {
  return (
    <Suspense fallback={<GoalSkeleton />}>
      <GoalContent />
    </Suspense>
  )
}
