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
      className={`flex flex-col sm:flex-row border hover:shadow-lg rounded-2xl hover:border-border-hover transition-shadow sm:h-[220px] ${className}`}
    >
      <div className='w-full h-full sm:w-1/2 sm:h-full'>
        <GoalImage goal={goal} className='h-full min-h-[220px]' />
      </div>
      <div className='w-full min-h-[178px] flex-1 sm:w-1/2 sm:p-4 flex flex-col justify-between'>
        <div className='sm:space-y-4 items-center justify-center h-full px-4 my-8 flex-1'>
          <p className='text-sm mt-4 text-muted-foreground line-clamp-3'>
            {goal.aims}
          </p>
        </div>
        {hasProgress && (
          <div className='mt-auto'>
            <div className='flex items-center justify-between mb-2 text-xs'>
              <span className='text-muted-foreground'>
                {completedSteps} of {totalSteps} steps completed
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
