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
import { AnimatedTabs } from '../ui/animated-tabs'

type FilterType = 'All' | 'Planned' | 'Active' | 'Completed'

interface GoalsViewProps {
  goals?: GoalType[]
  user?: User
  isLoading?: boolean
  isArchived?: boolean
}

// GoalsView

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
    if (isLoading || !user) {
      setDelayedLoading(true)
    } else {
      const timer = setTimeout(() => {
        setDelayedLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading, user])

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
    <div className='space-y-6 pb-12'>
      <div className='flex justify-between items-center'>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-md sm:text-sm md:text-2xl leading-none font-semibold text-pretty'>
            {isArchived ? 'Archived Goals' : `Welcome, ${user?.first_name} 👋`}
          </h1>

          <div className='flex items-center gap-4'>
            {goals.length > 0 && !isArchived && (
              <Link href='/goals/new'>
                <Button className='bg-primaryActive p-5 hover:bg-primaryActive/95 hover:drop-shadow-sm font-regular text-white text-xs'>
                  New Goal
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {nonArchivedGoals.length > 0 && !isArchived && (
        <nav className='border-border sm:border-b sm:pb-4'>
          <div className='hidden sm:block'>
            <AnimatedTabs
              items={filters.map((filter) => ({
                id: filter,
                label: filter,
                disabled: statusCounts[filter] === 0,
              }))}
              selected={selectedFilter}
              onChange={(value) => setSelectedFilter(value as FilterType)}
              isLoading={delayedLoading}
              layoutId='activeFilter'
              variant='underline'
            />
          </div>
          <div className='sm:hidden w-full'>
            <Label className='text-xs font-light'>Filter goals</Label>
            <Select
              value={selectedFilter}
              onValueChange={(value: string) =>
                setSelectedFilter(value as FilterType)
              }
            >
              <SelectTrigger className='border-0 shadow focus:ring-0'>
                <SelectValue placeholder='Filter goals' />
              </SelectTrigger>
              <SelectContent>
                {filters.map((filter) => {
                  if (statusCounts[filter] === 0) {
                    return false
                  }
                  return (
                    <SelectItem
                      key={filter}
                      value={filter}
                      disabled={delayedLoading}
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
