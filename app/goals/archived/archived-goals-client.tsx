'use client'

import Header from '@/components/Header'
import GoalsView from '@/components/GoalsView'
import { useUser } from '@/hooks/auth/useUser'
import { useGoal } from '@/hooks/useGoal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ArchivedGoalsClient() {
  const { user } = useUser()
  const { goals } = useGoal()

  if (!user) return null

  return (
    <div className="container min-h-screen max-w-3xl flex flex-col gap-6 sm:px-4 w-full">
      <Header user={user} />
      <div className="mb-0 px-4">
        <Link href="/goals">
          <Button variant="ghost">← Back to Goals</Button>
        </Link>
      </div>
      <main className="flex flex-col gap-4 w-full bg-card px-8 py-12 sm:px-12 sm:py-12 rounded-lg shadow-sm">
        <GoalsView goals={goals} user={user} isArchived />
      </main>
    </div>
  )
}
