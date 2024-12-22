'use client'

import { Suspense } from 'react'
import ArchivedGoalsClient from './archived-goals-client'

function ArchivedGoalsSkeleton() {
  return <div>Loading archived goals...</div>
}

export default function ArchivedGoalsPage() {
  return (
    <Suspense fallback={<ArchivedGoalsSkeleton />}>
      <ArchivedGoalsClient />
    </Suspense>
  )
}
