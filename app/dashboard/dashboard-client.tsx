'use client'

import Header from '@/components/Header'
import Loading from '@/components/ui/loading'
import { useGoal } from '@/hooks/useGoal'
import { TabNavigation } from '@/components/Dashboard/TabNavigation'
import { useUser } from '@/hooks/auth/useUser'
import { Suspense } from 'react'

function TabNavigationSkeleton() {
  // TODO: Add a skeleton for the tab navigation
  return (
    <div className='flex flex-col gap-4'>
      <div className='h-12 bg-card rounded-2xl animate-pulse' />
      <div className='h-[400px] bg-card rounded-2xl animate-pulse' />
    </div>
  )
}

export default function DashboardClient() {
  const { user, isLoading: userIsLoading } = useUser()
  const { goals, isLoading: goalsLoading } = useGoal()

  if (!user) {
    return null
  }

  return (
    <div className='container pb-10 min-h-screen flex gap-6 flex-col px-0 sm:px-4 w-full'>
      {userIsLoading ? (
        <Loading className='h-screen' />
      ) : (
        <Header user={user} />
      )}
      <div className='flex flex-col gap-6 w-full px-0 sm:px-0 flex-1'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='flex flex-col bg-paper rounded-2xl gap-4'>
            <Suspense fallback={<TabNavigationSkeleton />}>
              <TabNavigation goals={goals} goalsLoading={goalsLoading} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
