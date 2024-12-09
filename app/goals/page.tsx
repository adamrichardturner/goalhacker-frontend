'use client'

import { Footer } from '@/components/Footer'
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
    <div className='container max-w-3xl min-h-screen flex flex-col gap-6 sm:px-4 w-full'>
      <Header user={user} />
      <div className='flex flex-col gap-4 w-full px-4 sm:px-0 rounded-lg'>
        <main className='flex flex-col gap-4 w-full bg-card px-4 py-6 sm:px-12 sm:py-12 rounded-lg shadow-sm'>
          <GoalsView goals={goals} user={user} isLoading={goalsLoading} />
        </main>
      </div>
      <Footer />
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
