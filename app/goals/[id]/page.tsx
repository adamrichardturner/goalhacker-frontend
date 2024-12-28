'use client'

import { Suspense } from 'react'
import GoalPageClient from './goal-page-client'

interface GoalPageProps {
  params: {
    id: string
  }
}

export default function GoalPage({ params }: GoalPageProps) {
  return (
    <Suspense fallback={null}>
      <GoalPageClient params={params} />
    </Suspense>
  )
}
