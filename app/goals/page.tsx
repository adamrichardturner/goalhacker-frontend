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
    <div className='container  flex flex-col gap-6 sm:px-4 w-full'>
      <Header user={user} />
      <div className='flex flex-col gap-4 w-full rounded-lg mb-6'>
        <main className='flex flex-col gap-4 w-full bg-card px-4 py-6 mb-6 sm:px-12 sm:py-12 rounded-lg shadow-sm'>
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
