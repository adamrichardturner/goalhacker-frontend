import { Card, CardContent } from '@/components/ui/card'
import { Goal } from '@/types/goal'
import { EditSummary } from './EditSummary'
import { Badge } from '@/components/ui/badge'
import { GoalStatusEditor } from '../GoalStatusEditor'
import { colors } from '@/theme/colors'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export const Summary = ({ goal }: { goal: Goal }) => {
  const [openItem, setOpenItem] = useState('aims')

  return (
    <Card className='rounded-xl relative w-full'>
      <CardContent className='mt-6 space-y-8 w-full'>
        <div className='flex items-center p-1 justify-between'>
          {goal.category && (
            <div className='flex items-center gap-2'>
              <Badge
                className={`bg-electricPurple py-1 px-4 text-white font-semibold pointer-events-none`}
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

        <Accordion
          type='single'
          value={openItem}
          onValueChange={setOpenItem}
          collapsible
          className='flex flex-col gap-4 text-white text-shadow-lg'
        >
          {[
            { id: 'aims', title: 'Aims', content: goal.aims },
            {
              id: 'steps',
              title: 'Steps to Completion',
              content: goal.steps_to_completion,
              isHtml: true,
            },
            {
              id: 'measurement',
              title: 'Measurement Method',
              content: goal.measurement_method,
              isHtml: true,
            },
          ].map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className='rounded-lg border border-border/50 overflow-hidden shadow-md hover:shadow-lg transition-all bg-muted/15'
            >
              <AccordionTrigger
                className={cn(
                  'hover:no-underline h-[70px] p-4 transition-colors text-white [&>svg]:text-white',
                  openItem === item.id
                    ? 'bg-electricPurple/95 text-white'
                    : 'bg-electricPurple/80 hover:bg-electricPurple/90'
                )}
              >
                <h3 className='text-base font-semibold'>{item.title}</h3>
              </AccordionTrigger>
              <AccordionContent>
                {item.isHtml ? (
                  <div
                    className='prose-content text-sm text-muted-foreground p-6 bg-muted/5'
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                ) : (
                  <div className='text-sm text-muted-foreground p-6 bg-muted/5'>
                    {item.content}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className='w-full flex justify-end'>
          <GoalStatusEditor goal={goal} />
        </div>
      </CardContent>
    </Card>
  )
}
