'use client'

import { Goal as GoalType } from '@/types/goal'
import GoalImage from '../GoalImage'
import GoalProgress from './GoalProgress'
import { useCategory } from '@/hooks/useCategory'
import { Card } from '../ui/card'
import { motion } from 'framer-motion'
import { StatusBadge } from '../ui/status-badge'
import { FolderOpen } from 'lucide-react'

interface GoalProps {
  goal: GoalType
  className?: string
  showFullDetails?: boolean
  index?: number
}

export default function Goal({ goal, className = '', index = 0 }: GoalProps) {
  const { categories } = useCategory()
  const hasProgress = (goal.subgoals?.length ?? 0) > 0
  const category = categories.find((c) => c.category_id === goal.category_id)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <Card className='flex flex-col sm:flex-row border hover:shadow-lg w-full rounded-2xl hover:border-border-hover transition-shadow sm:h-[200px]'>
        <div className='w-full h-[200px] sm:w-1/2 sm:h-full'>
          <GoalImage goal={goal} className='h-full min-h-[200px]' />
        </div>
        <div className='w-full h-[200px] flex-1 sm:w-1/2 flex flex-col'>
          <div className='sm:space-y-4 items-center p-4 justify-center flex-1'>
            <h2 className='text-lg font-semibold leading-none tracking-tight line-clamp-3 min-h-[56px]'>
              {goal.aims}
            </h2>
          </div>
          <div className='mt-auto'>
            {category && (
              <div className='px-4'>
                <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <FolderOpen className='h-3 w-3' />
                  {category.name}
                </div>
              </div>
            )}
            <div className='min-h-12 p-4'>
              {hasProgress && <GoalProgress goal={goal} />}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
