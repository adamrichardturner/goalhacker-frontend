import { Card, CardContent } from '@/components/ui/card'
import { Goal } from '@/types/goal'

export const Summary = ({ goal }: { goal: Goal }) => (
  <Card className='rounded-lg'>
    <CardContent className='pt-6 space-y-6'>
      <div>
        <h3 className='font-semibold mb-2'>Aims</h3>
        <p className='text-muted-foreground'>{goal.aims}</p>
      </div>
      <div>
        <h3 className='font-semibold mb-2'>Steps to Completion</h3>
        <p className='text-muted-foreground'>{goal.steps_to_completion}</p>
      </div>
      <div>
        <h3 className='font-semibold mb-2'>Measurement Method</h3>
        <p className='text-muted-foreground'>{goal.measurement_method}</p>
      </div>
    </CardContent>
  </Card>
)
