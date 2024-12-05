import { Card, CardContent } from '@/components/ui/card'
import { Goal } from '@/types/goal'
import { EditSummary } from './EditSummary'

export const Summary = ({ goal }: { goal: Goal }) => (
  <Card className='rounded-xl relative'>
    <CardContent className='pt-6 space-y-6'>
      <EditSummary goal={goal} />
      <div>
        <h3 className='text-2xl font-semibold mb-2'>Aims</h3>
        <p className='text-muted-foreground'>{goal.aims}</p>
      </div>
      <div>
        <h3 className='text-2xl font-semibold mb-2'>Steps to Completion</h3>
        <p className='text-muted-foreground'>{goal.steps_to_completion}</p>
      </div>
      <div>
        <h3 className='text-2xl font-semibold mb-2'>Measurement Method</h3>
        <p className='text-muted-foreground'>{goal.measurement_method}</p>
      </div>
    </CardContent>
  </Card>
)
