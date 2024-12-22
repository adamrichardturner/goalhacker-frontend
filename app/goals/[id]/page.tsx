'use client'

import { Suspense } from 'react'
import GoalPageClient from './goal-page-client'
import { useParams } from 'next/navigation'

export default function GoalPage() {
  const params = useParams()
  const id = params?.id as string

  return (
    <Suspense fallback={null}>
      <GoalPageClient params={{ id }} />
    </Suspense>
  )
}
