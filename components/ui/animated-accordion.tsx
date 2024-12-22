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
      type="single"
      value={openItem || undefined}
      onValueChange={onOpenChange}
      collapsible
      className={cn('space-y-4', className)}
    >
      {items.map(item => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className={cn(
            'rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200',
            variant === 'purple' ? 'border-0' : 'border border-border/50'
          )}
        >
          <AccordionTrigger
            className={cn(
              'hover:no-underline px-6 py-6 transition-colors [&>svg]:text-white/70 [&>svg]:h-5 [&>svg]:w-5',
              variant === 'purple' && [
                'text-white bg-accordion-bg',
                'hover:bg-accordion-hover',
                'data-[state=open]:bg-accordion-bg',
                'border border-accordion-border',
              ],
              item.titleClassName
            )}
          >
            {item.title}
          </AccordionTrigger>
          <AccordionContent>
            <div
              className={cn(
                'prose-content text-sm text-muted-foreground p-6 bg-accordion-body hover:bg-accordion-body-hover',
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
