import { Goal } from '@/types/goal'
import { Card, CardContent } from '../ui/card'
import { Progress } from '../ui/progress'
import SubGoals from '../SubGoals'
import { calculateProgress } from '@/utils/calculateProgress'

interface ProgressGoalsProps {
  goal: Goal
}

export default function ProgressGoals({ goal }: ProgressGoalsProps) {
  const progress = calculateProgress(goal.subgoals)

  return (
    <Card className='mt-6'>
      <CardContent className='pt-6'>
        <div className='space-y-6'>
          <div>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='font-semibold'>Progress</h3>
              <div className='text-sm text-muted-foreground space-x-2'>
                <span>
                  {goal.subgoals?.filter((s) => s.status === 'completed')
                    .length || 0}{' '}
                  completed
                </span>
                <span>•</span>
                <span>
                  {goal.subgoals?.filter((s) => s.status === 'in_progress')
                    .length || 0}{' '}
                  in progress
                </span>
                <span>•</span>
                <span>{progress}%</span>
              </div>
            </div>
            <Progress
              value={progress}
              className='h-2'
              indicatorClassName='bg-electricPurple rounded-lg'
            />
          </div>

          <div>
            <h3 className='font-semibold mb-3'>Subgoals</h3>
            <SubGoals goal={goal} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
