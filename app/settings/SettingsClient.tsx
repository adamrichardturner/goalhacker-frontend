'use client'

import Settings from '@/components/Settings'
import Loading from '@/components/ui/loading'
import Header from '@/components/Header'
import { useUser } from '@/hooks/auth/useUser'

export default function SettingsClient() {
  const { user, isLoading: userIsLoading } = useUser()

  if (!user) {
    return null
  }

  return (
    <div className='container flex pb-10 flex-col gap-6 px-0 sm:px-4 w-full'>
      {userIsLoading ? (
        <Loading className='h-screen' />
      ) : (
        <Header user={user} />
      )}
      <div className='flex flex-col gap-4 w-full px-0 rounded-lg'>
        <main className='flex flex-col gap-4 w-full bg-card px-4 py-12 sm:px-12 sm:py-12 rounded-lg shadow-sm'>
          <h1 className='text-2xl font-bold'>Settings</h1>
          <Settings />
        </main>
      </div>
    </div>
  )
}
