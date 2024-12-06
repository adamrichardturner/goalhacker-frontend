'use client'

import GoalsView from '@/components/GoalsView'
import Header from '@/components/Header'
import Loading from '@/components/ui/loading'
import useAuth from '@/hooks/useAuth'
import { useGoal } from '@/hooks/useGoal'

export default function GoalsPage() {
  const { user, isLoading: userIsLoading } = useAuth()
  const { goals, isLoading: goalsLoading } = useGoal()

  if (!user) {
    return null
  }

  return (
    <div className='container max-w-3xl flex flex-col gap-6 sm:px-4 w-full'>
      {userIsLoading ? (
        <Loading className='h-screen' />
      ) : (
        <Header user={user} loading={userIsLoading} />
      )}
      <div className='flex flex-col gap-4 w-full px-4 sm:px-0 rounded-lg'>
        <main className='flex flex-col gap-4 w-full bg-card px-4 py-6 sm:px-12 sm:py-12 rounded-lg shadow-sm'>
          {userIsLoading || goalsLoading ? (
            <Loading className='h-screen' />
          ) : (
            <GoalsView goals={goals} user={user} isLoading={goalsLoading} />
          )}
        </main>
      </div>
    </div>
  )
}
