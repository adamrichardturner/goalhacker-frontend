import { calculateProgress } from '@/utils/calculateProgress'
import { Progress } from '../../ui/progress'
import { Goal } from '@/types/goal'

const GoalProgress = ({ goal }: { goal: Goal }) => {
  if (!goal.subgoals?.length || goal.subgoals?.length === 0) return null

  const { progressPercentage, completedCount, inProgressCount } =
    calculateProgress(goal.subgoals)

  return (
    <div className='space-y-2'>
      <Progress value={progressPercentage} className='h-2' />
      <div className='flex gap-3 text-xs text-muted-foreground'>
        <span>{completedCount} completed</span>
        <span>•</span>
        <span>{inProgressCount} in progress</span>
      </div>
    </div>
  )
}

export default GoalProgress
