'use client'

import { notFound } from 'next/navigation'
import { useGoal } from '@/hooks/useGoal'
import { Skeleton } from '@/components/ui/skeleton'
import { use } from 'react'
import GoalDetails from '@/components/GoalDetails'
import Header from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/auth/useUser'

interface GoalPageProps {
  params: Promise<{
    id: string
  }>
}

export default function GoalPage({ params }: GoalPageProps) {
  const { id } = use(params)
  const { goal, isLoading, isError } = useGoal(id)
  const { user } = useUser()

  if (isError) {
    notFound()
  }

  if (!user || !goal) {
    return null
  }

  return (
    <div className='container min-h-screen max-w-3xl flex flex-col gap-2 sm:px-4 w-full'>
      <Header user={user} />
      <div className='mb-0 px-4'>
        <Link href='/goals'>
          <Button variant='ghost'>← Back to Goals</Button>
        </Link>
      </div>
      <main className='flex-1'>
        <div className='max-w-5xl mx-auto'>
          {isLoading ? (
            <div className='space-y-4'>
              <Skeleton className='h-[300px] w-full' />
              <div className='px-6 space-y-4'>
                <Skeleton className='h-8 w-64' />
                <Skeleton className='h-24 w-full' />
                <Skeleton className='h-24 w-full' />
              </div>
            </div>
          ) : goal ? (
            <>
              <GoalDetails goal={goal} />
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  )
}
