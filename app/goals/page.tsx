'use client'

import GoalsView from '@/components/GoalsView'
import Header from '@/components/Header'
import Loading from '@/components/ui/loading'
import useAuth from '@/hooks/useAuth'
import useGoals from '@/hooks/useGoals'

export default function GoalsPage() {
  const { user, isLoading: userIsLoading } = useAuth()
  const { goals, isLoading: goalsLoading } = useGoals()
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
      <main className='flex flex-col gap-4 w-full bg-card sm:p-16 rounded-lg shadow-sm'>
        {goalsLoading || !goals ? (
          <Loading className='h-screen' />
        ) : (
          <GoalsView goals={goals} user={user} />
        )}
      </main>
    </div>
  )
}
