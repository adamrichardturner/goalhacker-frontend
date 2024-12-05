'use client'

import Header from '@/components/Header'
import GoalsView from '@/components/GoalsView'
import Loading from '@/components/ui/loading'
import useAuth from '@/hooks/useAuth'
import { useGoal } from '@/hooks/useGoal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ArchivedGoalsPage() {
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
      <div className='mb-0 px-4'>
        <Link href='/goals'>
          <Button variant='ghost'>← Back to Goals</Button>
        </Link>
      </div>
      <div className='flex flex-col gap-4 w-full px-4 sm:px-0 rounded-lg'>
        <main className='flex flex-col gap-4 w-full bg-card px-8 py-12 sm:px-12 sm:py-12 rounded-lg shadow-sm'>
          {goalsLoading ? (
            <Loading className='h-screen' />
          ) : (
            <GoalsView goals={goals} user={user} isArchived />
          )}
        </main>
      </div>
    </div>
  )
}
