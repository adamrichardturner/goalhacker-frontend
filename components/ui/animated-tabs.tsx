import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export interface TabItem {
  id: string
  label: string
  disabled?: boolean
}

interface AnimatedTabsProps {
  items: TabItem[]
  selected: string
  onChange: (value: string) => void
  isLoading?: boolean
  layoutId?: string
  className?: string
  variant?: 'default' | 'underline'
  showOverflowMenu?: boolean
  maxVisibleTabs?: number
  underlineOffset?: string
}

export function AnimatedTabs({
  items,
  selected,
  onChange,
  isLoading = false,
  layoutId = 'activeTab',
  className,
  variant = 'default',
  showOverflowMenu = false,
  maxVisibleTabs = 3,
  underlineOffset = 'bottom-0',
}: AnimatedTabsProps) {
  const visibleItems = showOverflowMenu ? items.slice(0, maxVisibleTabs) : items
  const overflowItems = showOverflowMenu ? items.slice(maxVisibleTabs) : []

  return (
    <nav className={cn('flex gap-6 items-center', className)}>
      <div className='flex gap-6 items-center'>
        {visibleItems.map((item) => {
          const isSelected = selected === item.id
          return (
            <motion.div key={item.id} className='relative'>
              <button
                onClick={() => onChange(item.id)}
                disabled={isLoading || item.disabled}
                className={cn(
                  'relative text-sm transition-colors duration-200',
                  isSelected
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                  isLoading || item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : '',
                  variant === 'underline' && 'pb-1'
                )}
              >
                {item.label}
              </button>
              {isSelected && (
                <motion.div
                  className={cn(
                    'absolute h-[1.5px] w-full bg-primary',
                    variant === 'underline' && underlineOffset
                  )}
                  layoutId={layoutId}
                />
              )}
            </motion.div>
          )
        })}
        {showOverflowMenu && overflowItems.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <MoreHorizontal className='h-4 w-4' />
                <span className='sr-only'>More options</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0' align='end'>
              <div className='flex flex-col'>
                {overflowItems.map((item) => (
                  <Button
                    key={item.id}
                    variant='ghost'
                    className={cn(
                      'justify-start h-9 px-4 py-2',
                      selected === item.id && 'bg-accent text-accent-foreground'
                    )}
                    onClick={() => onChange(item.id)}
                    disabled={isLoading || item.disabled}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </nav>
  )
}
