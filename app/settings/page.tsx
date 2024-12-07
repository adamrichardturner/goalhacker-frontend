'use client'

import Settings from '@/components/Settings'
import useAuth from '@/hooks/useAuth'
import Loading from '@/components/ui/loading'
import Header from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function SettingsPage() {
  const { user, isLoading: userIsLoading } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className='container max-w-3xl flex flex-col gap-6 sm:px-4 w-full'>
      {userIsLoading ? (
        <Loading className='h-screen' />
      ) : (
        <Header user={user} />
      )}
      <div className='flex flex-col gap-4 w-full sm:px-0 rounded-lg'>
        <main className='flex flex-col gap-4 w-full bg-card px-8 py-12 sm:px-12 sm:py-12 rounded-lg shadow-sm'>
          <h1 className='text-2xl font-bold'>Settings</h1>
          <Settings />
        </main>
      </div>
      <Footer />
    </div>
  )
}
