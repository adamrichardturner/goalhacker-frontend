'use client'

import { Goal as GoalType } from '@/types/goal'
import { User } from '@/types/auth'
import { Skeleton } from '@/components/ui/skeleton'
import GoalCard from '../Goal'
import EmptyGoalsState from './EmptyGoalsState'
import GoalDetails from '../GoalDetails'
import NewGoalView from '../NewGoalView'

interface RenderGoalDisplayProps {
  goals: GoalType[]
  user: User | null
  isLoading: boolean
  selectedGoal: GoalType | null
  isNewGoal: boolean
  selectedFilter: string
  onGoalClick: (goal: GoalType) => void
  displayGoals: GoalType[]
}

export default function RenderGoalDisplay({
  goals,
  user,
  isLoading,
  selectedGoal,
  isNewGoal,
  selectedFilter,
  onGoalClick,
  displayGoals,
}: RenderGoalDisplayProps) {
  if (!user) return null

  if (isNewGoal) {
    return (
      <div className='-mt-12'>
        <NewGoalView />
      </div>
    )
  }

  if (selectedGoal) {
    return (
      <div className='-mt-12'>
        <GoalDetails goal={selectedGoal} />
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4'>
      {isLoading ? (
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
          {selectedFilter === 'Archived' ? (
            'No archived goals yet'
          ) : (
            <EmptyGoalsState />
          )}
        </div>
      ) : (
        <>
          {displayGoals.map((goal, index) => (
            <div
              key={goal.goal_id}
              onClick={() => onGoalClick(goal)}
              className='cursor-pointer hover:opacity-90 transition-opacity'
            >
              <GoalCard goal={goal} index={index} />
            </div>
          ))}
        </>
      )}
    </div>
  )
}
