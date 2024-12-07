'use client'

import { Goal as GoalType } from '@/types/goal'
import Link from 'next/link'
import GoalImage from '../GoalImage'
import GoalProgress from './GoalProgress'
import { useCategory } from '@/hooks/useCategory'
import { Card } from '../ui/card'
import { motion } from 'framer-motion'

interface GoalProps {
  goal: GoalType
  className?: string
  showFullDetails?: boolean
  index?: number
}

export default function Goal({ goal, className = '', index = 0 }: GoalProps) {
  const { categories } = useCategory()
  const hasProgress = (goal.subgoals?.length ?? 0) > 0

  const category =
    goal.category ||
    (goal.category_id
      ? categories.find((c) => c.category_id === goal.category_id)
      : null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/goals/${goal.goal_id}`}
        className={`flex bg-paper flex-col sm:flex-row rounded-2xl sm:h-[200px] ${className}`}
      >
        <Card className='flex flex-col sm:flex-row border hover:shadow-lg w-full rounded-2xl hover:border-border-hover transition-shadow sm:h-[200px]'>
          <div className='w-full h-[200px] sm:w-1/2 sm:h-full'>
            <GoalImage goal={goal} className='h-full min-h-[200px]' />
          </div>
          <div className='w-full h-[200px] flex-1 sm:w-1/2 flex flex-col'>
            <div className='sm:space-y-4 items-center p-4 justify-center flex-1'>
              <p className='text-sm text-muted-foreground line-clamp-3'>
                {goal.aims}
              </p>
            </div>
            <div className='mt-auto'>
              {category && (
                <div className='px-4 mb-2'>
                  <p className='text-sm italic text-muted-foreground'>
                    {category.name}
                  </p>
                </div>
              )}
              <div className='min-h-12 p-4'>
                {hasProgress && <GoalProgress goal={goal} />}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
