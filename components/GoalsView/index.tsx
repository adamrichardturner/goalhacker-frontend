'use client'

import { User } from '@/types/auth'
import { Goal as GoalType } from '@/types/goal'
import { Button } from '../ui/button'
import { useState } from 'react'
import Link from 'next/link'
import Goal from '../Goal'
import { Skeleton } from '../ui/skeleton'
import EmptyGoalsState from './EmptyGoalsState'

type FilterType = 'All' | 'Active' | 'Completed'

interface GoalsViewProps {
  goals?: GoalType[]
  user?: User
  isLoading?: boolean
  isArchived?: boolean
}

const GoalsView = ({
  goals = [],
  user,
  isLoading = false,
  isArchived = false,
}: GoalsViewProps) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All')
  const filters: FilterType[] = ['All', 'Active', 'Completed']

  const archivedGoals = goals.filter((goal) => goal.status === 'archived')
  const nonArchivedGoals = goals.filter((goal) => goal.status !== 'archived')
  const displayGoals = isArchived ? archivedGoals : nonArchivedGoals

  const filteredGoals = displayGoals.filter((goal) => {
    if (isArchived) return true // Don't apply filters to archived goals
    if (selectedFilter === 'All') return true
    if (selectedFilter === 'Active') return goal.status !== 'completed'
    return goal.status === 'completed'
  })

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-between items-center'>
        <div className='flex justify-between items-center w-full'>
          {isLoading ? (
            <Skeleton className='h-8 w-64' />
          ) : (
            <h1 className='text-xs sm:text-sm md:text-2xl leading-none font-semibold text-pretty'>
              {isArchived
                ? 'Archived Goals'
                : `Welcome, ${user?.first_name} 👋`}
            </h1>
          )}
          {goals.length > 0 && !isArchived && (
            <Link href='/goals/new'>
              <Button className='bg-electricPurple p-5 hover:bg-electricPurple/95 hover:drop-shadow-sm font-[400] text-white text-xs'>
                New Goal
              </Button>
            </Link>
          )}
        </div>
      </div>

      {goals.length > 0 && !isArchived && (
        <nav className='flex gap-8 items-center border-b border-border'>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              disabled={isLoading}
              className={`relative pb-2 text-sm transition-colors duration-200 ${
                selectedFilter === filter
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              } ${isLoading ? 'opacity-50' : ''}`}
            >
              {filter}
              {selectedFilter === filter && (
                <div className='absolute bottom-0 left-0 w-full h-0.5 bg-electricPurple' />
              )}
            </button>
          ))}
        </nav>
      )}

      <div className='grid grid-cols-1 gap-4'>
        {isLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className='space-y-4'>
              <Skeleton className='h-48 w-full' />
              <div className='space-y-2'>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
                <div className='flex gap-2'>
                  <Skeleton className='h-6 w-20' />
                  <Skeleton className='h-6 w-20' />
                </div>
              </div>
            </div>
          ))
        ) : displayGoals.length === 0 ? (
          <div className='text-center text-muted-foreground'>
            {isArchived ? 'No archived goals yet' : <EmptyGoalsState />}
          </div>
        ) : (
          <>
            {filteredGoals.map((goal) => (
              <Goal key={goal.goal_id} goal={goal} />
            ))}
            {!isArchived && archivedGoals.length > 0 && (
              <div className='flex justify-end mt-4'>
                <Link href='/goals/archived'>
                  <Button
                    variant='ghost'
                    className='text-muted-foreground hover:text-foreground'
                  >
                    View Archived Goals ({archivedGoals.length})
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
export default GoalsView
