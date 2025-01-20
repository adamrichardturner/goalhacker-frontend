import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { ReactNode, useEffect, useRef } from 'react'

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
  variant?: 'default' | 'purple' | 'lightGray'
}

export function AnimatedAccordion({
  items,
  openItem,
  onOpenChange,
  className,
  variant = 'default',
}: AnimatedAccordionProps) {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (
      isInitialMount.current &&
      items.length > 0 &&
      onOpenChange &&
      !openItem
    ) {
      // Only open first item on initial mount
      onOpenChange(items[0].id)
      isInitialMount.current = false
    } else if (
      items.length > 0 &&
      onOpenChange &&
      openItem &&
      !items.find((item) => item.id === openItem)
    ) {
      // Open first item when currently open item is deleted
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
          className={cn(
            'overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ease-out rounded-2xl [&[data-state=open]]:rounded-2xl',
            variant === 'purple' ? 'border-0' : 'border border-border/50',
            variant === 'lightGray' && 'border-none'
          )}
        >
          <AccordionTrigger
            className={cn(
              'hover:no-underline px-6 py-6',
              'transition-all duration-300 ease-out',
              '[&>svg]:text-primary [&>svg]:h-5 [&>svg]:w-5',
              'rounded-2xl data-[state=open]:rounded-t-2xl data-[state=open]:rounded-b-none',
              variant === 'purple' && [
                'text-primary bg-accordion-bg',
                'hover:bg-accordion-bg/90',
                'data-[state=open]:bg-accordion-bg',
                'border border-accordion-border',
              ],
              variant === 'lightGray' &&
                'bg-gray-25 hover:bg-gray-50 text-white',
              item.titleClassName
            )}
          >
            {item.title}
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              'transition-all duration-300 ease-out',
              variant === 'lightGray' && 'bg-gray-25 text-white'
            )}
          >
            <div
              className={cn([
                'p-6 rounded-b-2xl transition-all duration-300 ease-out',
                `${variant === 'lightGray' ? 'bg-inherit text-white hover:bg-gray-50' : 'prose-content text-sm text-muted-foreground bg-accordion-body hover:bg-accordion-body/90 '}`,
                item.contentClassName,
              ])}
            >
              {item.content}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
