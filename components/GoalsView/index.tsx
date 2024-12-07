'use client'

import { User } from '@/types/auth'
import { Goal as GoalType, GoalStatus } from '@/types/goal'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Goal from '../Goal'
import { Skeleton } from '../ui/skeleton'
import EmptyGoalsState from './EmptyGoalsState'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Label } from '../ui/label'

type FilterType = 'All' | 'Planned' | 'Active' | 'Completed'

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
  const [delayedLoading, setDelayedLoading] = useState(true)
  const filters: FilterType[] = ['All', 'Planned', 'Active', 'Completed']

  useEffect(() => {
    if (isLoading) {
      setDelayedLoading(true)
    } else {
      const timer = setTimeout(() => {
        setDelayedLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  const nonArchivedGoals = goals.filter((goal) => goal.status !== 'archived')
  const statusCounts: Record<FilterType, number> = {
    All: nonArchivedGoals.length,
    Planned: nonArchivedGoals.filter((goal) => goal.status === 'planned')
      .length,
    Active: nonArchivedGoals.filter((goal) => goal.status === 'in_progress')
      .length,
    Completed: nonArchivedGoals.filter((goal) => goal.status === 'completed')
      .length,
  }

  const filteredGoals = goals.filter((goal) => {
    if (isArchived) {
      return goal.status === 'archived'
    }

    if (goal.status === 'archived') {
      return false
    }

    switch (selectedFilter) {
      case 'Planned':
        return goal.status === 'planned'
      case 'Active':
        return goal.status === 'in_progress'
      case 'Completed':
        return goal.status === 'completed'
      default:
        return !['archived' as GoalStatus].includes(goal.status)
    }
  })

  const archivedGoals = goals.filter((goal) => goal.status === 'archived')
  const displayGoals = isArchived ? archivedGoals : filteredGoals

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-md sm:text-sm md:text-2xl leading-none font-semibold text-pretty'>
            {isArchived ? 'Archived Goals' : `Welcome, ${user?.first_name} 👋`}
          </h1>

          <div className='flex items-center gap-4'>
            {!isArchived && (
              <Link href='/goals/new'>
                <Button className='bg-electricPurple p-5 hover:bg-electricPurple/95 hover:drop-shadow-sm font-regular text-white text-xs'>
                  New Goal
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {nonArchivedGoals.length > 0 && !isArchived && (
        <nav className='flex gap-8 items-center border-border'>
          <div className='hidden sm:flex gap-8 items-center'>
            {filters.map((filter) => {
              const isDisabled = filter !== 'All' && statusCounts[filter] === 0
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  disabled={delayedLoading || isDisabled}
                  className={`relative pb-2 text-sm transition-colors duration-200 ${
                    selectedFilter === filter
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  } ${delayedLoading || isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {filter}
                  {selectedFilter === filter && (
                    <div className='absolute bottom-0 left-0 w-full h-0.5 bg-electricPurple' />
                  )}
                </button>
              )
            })}
          </div>
          <div className='sm:hidden w-full'>
            <Label className='text-xs font-light'>Filter goals</Label>
            <Select
              value={selectedFilter}
              onValueChange={(value: string) =>
                setSelectedFilter(value as FilterType)
              }
            >
              <SelectTrigger className='border-0 shadow-sm focus:ring-0'>
                <SelectValue placeholder='Filter goals' />
              </SelectTrigger>
              <SelectContent>
                {filters.map((filter) => {
                  const isDisabled =
                    filter !== 'All' && statusCounts[filter] === 0
                  return (
                    <SelectItem
                      key={filter}
                      value={filter}
                      disabled={delayedLoading || isDisabled}
                    >
                      {filter}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </nav>
      )}

      <div className='grid grid-cols-1 gap-4'>
        {delayedLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='h-[200px] bg-paper border rounded-2xl'>
              <div className='flex h-full'>
                <Skeleton className='w-1/2 h-full rounded-l-2xl' />
                <div className='w-1/2 p-4 flex flex-col justify-between'>
                  <Skeleton className='h-20 w-full' />
                  <Skeleton className='h-8 w-full' />
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
            {displayGoals.map((goal, index) => (
              <Goal key={goal.goal_id} goal={goal} index={index} />
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
