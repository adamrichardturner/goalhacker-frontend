'use client'

import { User } from '@/types/auth'
import { Goal as GoalType } from '@/types/goal'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Label } from '../ui/label'
import { AnimatedTabs } from '../ui/animated-tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import RenderGoalDisplay from './RenderGoalDisplay'

type FilterType = 'All' | 'Planned' | 'Active' | 'Completed' | 'Archived'

interface GoalsViewProps {
  goals?: GoalType[]
  user?: User
  isLoading?: boolean
}

const GoalsView = ({ goals = [], user, isLoading = false }: GoalsViewProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All')
  const [delayedLoading, setDelayedLoading] = useState(true)
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(() => {
    const goalId = searchParams.get('id')
    return goalId ? goals.find((g) => g.goal_id === goalId) || null : null
  })
  const isNewGoal = searchParams.get('new') === 'true'
  const filters: FilterType[] = [
    'All',
    'Active',
    'Planned',
    'Completed',
    'Archived',
  ]

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

  const handleNewGoal = () => {
    router.push('?new=true', { scroll: false })
  }

  const statusCounts: Record<FilterType, number> = {
    All: goals.length,
    Planned: goals.filter((goal) => goal.status === 'planned').length,
    Active: goals.filter((goal) => goal.status === 'in_progress').length,
    Completed: goals.filter((goal) => goal.status === 'completed').length,
    Archived: goals.filter((goal) => goal.status === 'archived').length,
  }

  const filteredGoals = goals.filter((goal) => {
    switch (selectedFilter) {
      case 'Planned':
        return goal.status === 'planned'
      case 'Active':
        return goal.status === 'in_progress'
      case 'Completed':
        return goal.status === 'completed'
      case 'Archived':
        return goal.status === 'archived'
      default:
        return true
    }
  })

  const displayGoals = filteredGoals
  const activeFilters = filters.filter((filter) => statusCounts[filter] > 0)

  return (
    <div
      className={cn(
        'space-y-6',
        selectedGoal || isNewGoal ? '-mx-4 sm:-mx-6' : 'pb-8'
      )}
    >
      {!selectedGoal && !isNewGoal && (
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <div className='flex justify-between items-center w-full'>
              <h1 className='text-md sm:text-sm md:text-2xl leading-none font-semibold text-pretty pr-6'>
                Welcome, {user?.first_name} 👋
              </h1>
            </div>
            {goals.length > 0 && (
              <Button
                size='sm'
                className='min-w-[120px]'
                onClick={handleNewGoal}
              >
                New Goal
              </Button>
            )}
          </div>

          <nav className='border-border sm:border-b sm:pb-2'>
            <div className='hidden sm:block'>
              <div className='flex justify-between items-center'>
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
            </div>
            <div className='sm:hidden w-full'>
              <div className='flex flex-col gap-4'>
                <Label className='text-xs font-light'>Filter goals</Label>
                <div className='flex justify-between items-center'>
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
              </div>
            </div>
          </nav>
        </div>
      )}

      <RenderGoalDisplay
        user={user || null}
        isLoading={delayedLoading}
        selectedGoal={selectedGoal}
        isNewGoal={isNewGoal}
        selectedFilter={selectedFilter}
        onGoalClick={handleGoalClick}
        displayGoals={displayGoals}
      />
    </div>
  )
}

export default GoalsView
