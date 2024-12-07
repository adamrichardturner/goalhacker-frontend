'use client'

import { Goal as GoalType } from '@/types/goal'
import Link from 'next/link'
import GoalImage from '../GoalImage'
import GoalProgress from './GoalProgress'
import { useCategory } from '@/hooks/useCategory'

interface GoalProps {
  goal: GoalType
  className?: string
  showFullDetails?: boolean
}

export default function Goal({ goal, className = '' }: GoalProps) {
  const { categories } = useCategory()
  const hasProgress = goal.subgoals?.length > 0

  console.log(goal)

  // First try to get the category from the goal object, if not found, try to find it in categories
  const category =
    goal.category ||
    (goal.category_id
      ? categories.find((c) => c.category_id === goal.category_id)
      : null)

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
        <div className='p-4'>
          {category && (
            <p className='text-sm italic text-muted-foreground mb-2'>
              {category.name}
            </p>
          )}
        </div>
        {hasProgress && (
          <div className='mt-auto p-4'>
            <GoalProgress goal={goal} />
          </div>
        )}
      </div>
    </Link>
  )
}
