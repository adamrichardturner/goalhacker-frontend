'use client'

import Header from '@/components/Header'
import NewGoalView from '@/components/NewGoalView'
import { useUser } from '@/hooks/auth/useUser'

export default function NewGoalPage() {
  const { user } = useUser()

  if (!user) {
    return null
  }

  return (
    <div className='container min-h-screen pb-10  flex flex-col gap-2 sm:px-4 w-full'>
      <Header user={user} />
      <main className='flex flex-col px-4 sm:px-0 gap-4 w-full bg-background rounded-lg shadow-sm'>
        <NewGoalView />
      </main>
    </div>
  )
}
