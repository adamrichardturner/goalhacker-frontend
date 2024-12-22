'use client'

import Header from '@/components/Header'
import NewGoalView from '@/components/NewGoalView'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useUser } from '@/hooks/auth/useUser'

export default function NewGoalPage() {
  const { user } = useUser()

  if (!user) {
    return null
  }

  return (
    <div className="container min-h-screen pb-10 max-w-3xl flex flex-col gap-2 sm:px-4 w-full">
      <Header user={user} />
      <div className="mb-0 px-4">
        <Link href="/goals">
          <Button variant="ghost">← Back to Goals</Button>
        </Link>
      </div>
      <main className="flex flex-col px-4 sm:px-0 gap-4 w-full bg-background rounded-lg shadow-sm">
        <NewGoalView />
      </main>
    </div>
  )
}
