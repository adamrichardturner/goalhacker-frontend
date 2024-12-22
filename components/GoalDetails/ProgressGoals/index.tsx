import { Goal } from '@/types/goal'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { calculateProgress } from '@/utils/calculateProgress'
import SubGoals from '@/components/GoalDetails/SubGoals'

interface ProgressGoalsProps {
  goal: Goal
}

export default function ProgressGoals({ goal }: ProgressGoalsProps) {
  const progress = calculateProgress(goal.subgoals).progressPercentage
  const completedCount = goal.subgoals?.filter(s => s.status === 'completed').length || 0
  const inProgressCount = goal.subgoals?.filter(s => s.status === 'in_progress').length || 0

  const Stats = () => (
    <div className="text-muted-foreground space-x-2">
      <span>{completedCount} completed</span>
      <span>•</span>
      <span>{inProgressCount} in progress</span>
      <span>•</span>
      <span>{progress}%</span>
    </div>
  )

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="sm:text-2xl font-semibold">Progress</h3>
              <div className="hidden sm:block text-sm">
                <Stats />
              </div>
            </div>
            <div className="flex items-center justify-start sm:justify-end w-full gap-2">
              <Progress
                value={progress}
                className="h-2"
                indicatorClassName="bg-electricPurple rounded-lg"
              />
            </div>
            <div className="sm:hidden text-xs">
              <Stats />
            </div>
          </div>

          <div>
            <h3 className="text-sm sm:text-lg font-semibold mb-3">Subgoals</h3>
            <SubGoals goal={goal} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
