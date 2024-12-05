'use client'

import { Goal as GoalType } from '@/types/goal'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import GoalImage from '../GoalImage'
import { calculateGoalProgress } from '@/utils/goalProgress'

interface GoalProps {
  goal: GoalType
  className?: string
  showFullDetails?: boolean
}

export default function Goal({ goal, className = '' }: GoalProps) {
  if (!goal) return null

  const { progress, completedSteps, totalSteps } = calculateGoalProgress(goal)
  const hasProgress = progress !== null && totalSteps > 0

  return (
    <Link
      href={`/goals/${goal.goal_id}`}
      className={`flex bg-paper h-[400px] flex-col sm:flex-row border hover:shadow-lg rounded-2xl hover:border-border-hover transition-shadow sm:h-[200px] ${className}`}
    >
      <div className='w-full h-[200px] sm:w-1/2 sm:h-full'>
        <GoalImage goal={goal} className='h-full min-h-[200px]' />
      </div>
      <div className='w-full h-[200px] flex-1 sm:w-1/2 flex flex-col justify-between'>
        <div className='sm:space-y-4 items-center p-4 justify-center h-full flex-1'>
          <p className='text-sm text-muted-foreground line-clamp-3'>
            {goal.aims}
          </p>
        </div>
        {hasProgress && (
          <div className='mt-auto p-4'>
            <div className='flex items-center justify-between mb-2 text-xs'>
              <span className='text-muted-foreground'>
                {completedSteps} of {totalSteps} subgoals completed
              </span>
              <span className='text-primary'>{progress}%</span>
            </div>
            <Progress
              value={progress}
              className='h-2'
              indicatorClassName='bg-electricPurple'
            />
          </div>
        )}
      </div>
    </Link>
  )
}
