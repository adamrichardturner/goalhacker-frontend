import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

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
}

export function AnimatedTabs({
  items,
  selected,
  onChange,
  isLoading = false,
  layoutId = 'activeTab',
  className,
  variant = 'default',
}: AnimatedTabsProps) {
  return (
    <nav className={cn('flex gap-8 items-center', className)}>
      <div className="flex gap-6 items-center">
        {items.map(item => {
          const isSelected = selected === item.id
          return (
            <motion.div key={item.id} className="relative">
              <button
                onClick={() => onChange(item.id)}
                disabled={isLoading || item.disabled}
                className={cn(
                  'relative text-sm transition-colors duration-200',
                  isSelected
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                  isLoading || item.disabled ? 'opacity-50 cursor-not-allowed' : '',
                  variant === 'underline' && 'pb-2'
                )}
              >
                {item.label}
              </button>
              {isSelected && (
                <motion.div
                  className={cn(
                    'absolute h-[1.5px] w-full bg-electricPurple',
                    variant === 'underline' && 'bottom-0'
                  )}
                  layoutId={layoutId}
                />
              )}
            </motion.div>
          )
        })}
      </div>
    </nav>
  )
}
