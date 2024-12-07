'use client'

import { Footer } from '@/components/Footer'
import GoalsView from '@/components/GoalsView'
import Header from '@/components/Header'
import Loading from '@/components/ui/loading'
import { useUser } from '@/hooks/auth/useUser'
import { useGoal } from '@/hooks/useGoal'
import { Suspense } from 'react'

function GoalsContent() {
  const { user, isLoading: userIsLoading } = useUser()
  const { goals, isLoading: goalsLoading } = useGoal()

  if (!user) {
    return null
  }

  return (
    <div className='container max-w-3xl min-h-screen flex flex-col gap-6 sm:px-4 w-full'>
      {userIsLoading ? <Loading className='h-full' /> : <Header user={user} />}
      <div className='flex flex-col gap-4 w-full px-4 sm:px-0 rounded-lg'>
        <main className='flex flex-col gap-4 w-full bg-card px-4 py-6 sm:px-12 sm:py-12 rounded-lg shadow-sm'>
          {userIsLoading || goalsLoading ? (
            <Loading className='h-full' />
          ) : (
            <GoalsView goals={goals} user={user} isLoading={goalsLoading} />
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default function GoalsPage() {
  return (
    <Suspense fallback={<Loading className='h-full' />}>
      <GoalsContent />
    </Suspense>
  )
}
