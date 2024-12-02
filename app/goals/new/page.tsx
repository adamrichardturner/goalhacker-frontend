'use client'

import Header from '@/components/Header'
import NewGoalView from '@/components/NewGoalView'
import useAuth from '@/hooks/useAuth'

export default function NewGoalPage() {
  const { user, isLoading } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className='container max-w-3xl flex flex-col gap-6 sm:px-4 w-full'>
      <Header user={user} loading={isLoading} />
      <main className='flex flex-col gap-4 w-full bg-card sm:p-16 rounded-lg shadow-sm'>
        <NewGoalView />
      </main>
    </div>
  )
}
