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
import GoalDetails from '../GoalDetails'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

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
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Active')
  const [delayedLoading, setDelayedLoading] = useState(true)
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(() => {
    const goalId = searchParams.get('id')
    return goalId ? goals.find((g) => g.goal_id === goalId) || null : null
  })
  const filters: FilterType[] = ['Active', 'Planned', 'Completed', 'All']

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

  useEffect(() => {
    const goalId = searchParams.get('id')
    if (goalId) {
      const goal = goals.find((g) => g.goal_id === goalId)
      if (goal) {
        setSelectedGoal(goal)
      }
    } else {
      setSelectedGoal(null)
    }
  }, [searchParams, goals])

  const handleGoalClick = (goal: GoalType) => {
    setSelectedGoal(goal)
    router.push(`?id=${goal.goal_id}`, { scroll: false })
  }

  const handleBackToList = () => {
    setSelectedGoal(null)
    router.push('', { scroll: false })
  }

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
  const activeFilters = filters.filter((filter) => statusCounts[filter] > 0)

  return (
    <div
      className={cn('space-y-6', selectedGoal ? '-mx-4 sm:-mx-6 -mt-12' : '')}
    >
      {selectedGoal ? (
        <motion.div animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
          <GoalDetails goal={selectedGoal} />
        </motion.div>
      ) : (
        <motion.div
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className='space-y-8'
        >
          <div className='flex justify-between items-center'>
            <div className='flex justify-between items-center w-full'>
              <h1 className='text-md sm:text-sm md:text-2xl leading-none font-semibold text-pretty pr-6'>
                {isArchived
                  ? 'Archived Goals'
                  : `Welcome, ${user?.first_name} 👋`}
              </h1>

              <div className='flex items-center gap-4'>
                {goals.length > 0 && !isArchived && (
                  <Link href='/goals/new' className='block'>
                    <Button size='sm' className='min-w-[120px]'>
                      New Goal
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {nonArchivedGoals.length > 0 && !isArchived && (
            <nav className='border-border sm:border-b sm:pb-2'>
              <div className='hidden sm:block'>
                <AnimatedTabs
                  items={activeFilters.map((filter) => ({
                    id: filter,
                    label: filter,
                    disabled: false,
                  }))}
                  selected={selectedFilter}
                  onChange={(value) => setSelectedFilter(value as FilterType)}
                  isLoading={delayedLoading}
                  layoutId='activeFilter'
                  variant='underline'
                  underlineOffset='bottom-[-9px]'
                />
              </div>
              <div className='sm:hidden w-full sm:w-1/2'>
                <Label className='text-xs font-light'>Filter goals</Label>
                <Select
                  value={selectedFilter}
                  onValueChange={(value: string) =>
                    setSelectedFilter(value as FilterType)
                  }
                >
                  <SelectTrigger className='border-0 shadow bg-input/5 focus:ring-0'>
                    <SelectValue placeholder='Filter goals' />
                  </SelectTrigger>
                  <SelectContent>
                    {filters
                      .filter((filter) => statusCounts[filter] > 0)
                      .map((filter) => (
                        <SelectItem
                          key={filter}
                          value={filter}
                          disabled={delayedLoading}
                        >
                          {filter}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </nav>
          )}

          <div className='grid grid-cols-1 gap-4'>
            {delayedLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className='h-[200px] bg-paper border rounded-2xl'
                >
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
                  <div
                    key={goal.goal_id}
                    onClick={() => handleGoalClick(goal)}
                    className='cursor-pointer hover:opacity-90 transition-opacity'
                  >
                    <Goal goal={goal} index={index} />
                  </div>
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
        </motion.div>
      )}
    </div>
  )
}

export default GoalsView
