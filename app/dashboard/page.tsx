'use client'

import { Footer } from '@/components/Footer'
import Header from '@/components/Header'
import Loading from '@/components/ui/loading'
import useAuth from '@/hooks/useAuth'
import { useGoal } from '@/hooks/useGoal'
import { TabNavigation } from '@/components/Dashboard/TabNavigation'

export default function DashboardPage() {
  const { user, isLoading: userIsLoading } = useAuth()
  const { goals, isLoading: goalsLoading } = useGoal()

  if (!user) {
    return null
  }

  return (
    <div className='container min-h-screen max-w-3xl flex gap-6 flex-col sm:px-4 w-full'>
      {userIsLoading ? (
        <Loading className='h-screen' />
      ) : (
        <Header user={user} />
      )}
      <div className='flex flex-col gap-6 w-full px-4 sm:px-0 flex-1'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='flex flex-col gap-4'>
            <TabNavigation goals={goals} goalsLoading={goalsLoading} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
