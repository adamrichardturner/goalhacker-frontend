import { ReactNode, useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

export interface AccordionItemType {
  id: string
  title: ReactNode
  content: ReactNode
  titleClassName?: string
  contentClassName?: string
}

interface AnimatedAccordionProps {
  items: AccordionItemType[]
  openItem?: string | null
  onOpenChange?: (value: string | null) => void
  className?: string
  variant?: 'default' | 'purple'
}

export function AnimatedAccordion({
  items,
  openItem,
  onOpenChange,
  className,
  variant = 'default',
}: AnimatedAccordionProps) {
  useEffect(() => {
    if (items.length > 0 && openItem === null && onOpenChange) {
      onOpenChange(items[0].id)
    }
  }, [items, openItem, onOpenChange])

  return (
    <Accordion
      type='single'
      value={openItem || undefined}
      onValueChange={onOpenChange}
      collapsible
      className={cn('space-y-4', className)}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className='rounded-lg border border-border/50 overflow-hidden shadow-md hover:shadow-lg transition-all bg-muted/15'
        >
          <AccordionTrigger
            className={cn(
              'hover:no-underline h-[92px] p-4 transition-colors [&>svg]:text-white',
              variant === 'purple' && [
                'text-white',
                openItem === item.id
                  ? 'bg-electricPurple/95 text-white'
                  : 'bg-electricPurple/80 hover:bg-electricPurple/90',
              ],
              item.titleClassName
            )}
          >
            {item.title}
          </AccordionTrigger>
          <AccordionContent>
            <div
              className={cn(
                'prose-content text-sm text-muted-foreground p-6 bg-muted/5',
                item.contentClassName
              )}
            >
              {item.content}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
