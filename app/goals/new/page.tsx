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
    <div className='container min-h-screen pb-12 flex flex-col gap-6 px-0 sm:px-4 w-full'>
      <Header user={user} />
      <main className='flex flex-col px-0 gap-6 pt-[20px] sm:pt-[0px] w-full bg-background rounded-lg shadow-sm'>
        <NewGoalView />
      </main>
    </div>
  )
}
