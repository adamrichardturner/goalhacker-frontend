import { Suspense } from 'react'
import GoalPageClient from './goal-page-client'

interface GoalPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function GoalPage({ params }: GoalPageProps) {
  const resolvedParams = await params
  return (
    <Suspense fallback={null}>
      <GoalPageClient params={resolvedParams} />
    </Suspense>
  )
}
