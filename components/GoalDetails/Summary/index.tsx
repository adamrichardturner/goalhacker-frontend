import { Card, CardContent } from '@/components/ui/card'
import { Goal } from '@/types/goal'
import { EditSummary } from './EditSummary'
import { Badge } from '@/components/ui/badge'
import { GoalStatusEditor } from '../GoalStatusEditor'
import { colors } from '@/theme/colors'
import { useState } from 'react'
import { AnimatedAccordion } from '@/components/ui/animated-accordion'
import { Target, ListChecks, LineChart } from 'lucide-react'

export const Summary = ({ goal }: { goal: Goal }) => {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const accordionItems = [
    {
      id: 'aims',
      title: (
        <div className='flex items-center gap-2'>
          <Target className='h-3 w-3 mr-1' />
          Aims
        </div>
      ),
      content: goal.aims,
    },
    {
      id: 'steps',
      title: (
        <div className='flex items-center gap-2'>
          <ListChecks className='h-3 w-3 mr-1' />
          Steps to Completion
        </div>
      ),
      content: goal.steps_to_completion,
      isHtml: true,
    },
    {
      id: 'measurement',
      title: (
        <div className='flex items-center gap-2'>
          <LineChart className='h-3 w-3 mr-1' />
          Measurement Method
        </div>
      ),
      content: goal.measurement_method,
      isHtml: true,
    },
  ].map((item) => ({
    id: item.id,
    title: item.title,
    content: item.isHtml ? (
      <div
        className='prose-content'
        dangerouslySetInnerHTML={{ __html: item.content }}
      />
    ) : (
      item.content
    ),
  }))

  return (
    <Card className='rounded-xl relative w-full'>
      <CardContent className='mt-6 space-y-8 w-full'>
        <div className='flex items-center p-1 justify-between'>
          {goal.category && (
            <div className='flex items-center gap-2'>
              <Badge
                className='bg-electricPurple py-1 px-4 text-white font-semibold pointer-events-none'
                style={{
                  backgroundColor: `${colors.electricViolet}`,
                  borderColor: `${colors.electricViolet}33`,
                  boxShadow: `0 0 12px ${colors.electricViolet}40`,
                }}
              >
                {goal.category.name}
              </Badge>
            </div>
          )}
          <EditSummary goal={goal} />
        </div>

        <AnimatedAccordion
          items={accordionItems}
          openItem={openItem}
          onOpenChange={setOpenItem}
          variant='purple'
        />

        <div className='w-full flex justify-end'>
          <GoalStatusEditor goal={goal} />
        </div>
      </CardContent>
    </Card>
  )
}
