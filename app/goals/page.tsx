'use client'

import { RouteGuard } from '@/components/Auth/RouteGuard'
import GoalsView from '@/components/GoalsView'
import Header from '@/components/Header'
import { useUser } from '@/hooks/auth/useUser'
import { useGoal } from '@/hooks/useGoal'

export default function GoalsPage() {
  const { user, isLoading: userLoading } = useUser()
  const { goals, isLoading: goalsLoading } = useGoal()

  return (
    <RouteGuard>
      <div className='container max-w-3xl flex flex-col gap-6 sm:px-4 w-full'>
        {!userLoading && user && <Header user={user} />}
        <div className='flex flex-col gap-4 w-full rounded-2xl mb-6'>
          <main className='flex flex-col gap-4 w-full bg-card px-4 py-6 mb-6 sm:px-12 sm:py-12 rounded-2xl shadow-sm'>
            {!userLoading && !goalsLoading && user && (
              <GoalsView goals={goals} user={user} isLoading={goalsLoading} />
            )}
          </main>
        </div>
      </div>
    </RouteGuard>
  )
}
