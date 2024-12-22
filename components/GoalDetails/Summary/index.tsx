import { Card, CardContent } from '@/components/ui/card'
import { Goal } from '@/types/goal'
import { EditSummary } from './EditSummary'
import { Badge } from '@/components/ui/badge'
import { GoalStatusEditor } from '../GoalStatusEditor'
import { getGoalStatus } from '@/utils/goalStatus'
import { badgeBaseStyles } from '..'
import { colors } from '@/theme/colors'
export const Summary = ({ goal }: { goal: Goal }) => {
  const statusConfig = getGoalStatus(goal.status)

  console.log('STATUS CONFIG', statusConfig)

  return (
    <Card className='rounded-xl relative'>
      <CardContent className='pt-6 space-y-6'>
        <div className='flex items-center justify-between'>
          {goal.category && (
            <div className='flex items-center gap-2'>
              <Badge
                className={`${badgeBaseStyles} ${statusConfig.className} pointer-events-none`}
                style={{
                  backgroundColor: `${colors.electricViolet}40`,
                  borderColor: `${colors.electricViolet}33`,
                  boxShadow: `0 0 12px ${colors.electricViolet}40`,
                  color: 'white',
                }}
              >
                {goal.category.name}
              </Badge>
            </div>
          )}
          <EditSummary goal={goal} />
        </div>
        <div>
          <h3 className='sm:text-2xl font-semibold mb-2'>Aims</h3>
          <p className='text-muted-foreground text-sm'>{goal.aims}</p>
        </div>
        <div>
          <h3 className='sm:text-2xl font-semibold mb-2'>
            Steps to Completion
          </h3>
          <div
            className='prose-content'
            dangerouslySetInnerHTML={{ __html: goal.steps_to_completion }}
          />
        </div>
        <div>
          <h3 className='sm:text-2xl font-semibold mb-2'>Measurement Method</h3>
          <div
            className='prose-content'
            dangerouslySetInnerHTML={{ __html: goal.measurement_method }}
          />
        </div>
        <div className='w-full flex justify-end'>
          <GoalStatusEditor goal={goal} />
        </div>
      </CardContent>
    </Card>
  )
}
