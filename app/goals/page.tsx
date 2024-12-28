'use client'

import GoalsView from '@/components/GoalsView'
import Header from '@/components/Header'
import { useUser } from '@/hooks/auth/useUser'
import { useGoal } from '@/hooks/useGoal'
import { Suspense } from 'react'

function GoalsContent() {
  const { user, isLoading: userLoading } = useUser()
  const { goals, isLoading: goalsLoading } = useGoal()

  // Show nothing while loading
  if (userLoading || goalsLoading) {
    return null
  }

  // Show nothing if no user (redirect will happen automatically)
  if (!user) {
    return null
  }

  return (
    <div className='container flex flex-col gap-6 px-0 sm:px-4 w-full pb-12'>
      <Header user={user} />
      <div className='pt-[20px] sm:pt-0 flex flex-col gap-4 w-full rounded-2xl'>
        <main className='flex flex-col gap-4 w-full bg-card pt-6 px-4 sm:px-6 sm:px-12 rounded-2xl sm:pt-12 sm:pb-0 rounded-2xl sm:rounded-2xl shadow-sm'>
          <GoalsView goals={goals} user={user} isLoading={goalsLoading} />
        </main>
      </div>
    </div>
  )
}

export default function GoalsPage() {
  return (
    <Suspense>
      <GoalsContent />
    </Suspense>
  )
}
