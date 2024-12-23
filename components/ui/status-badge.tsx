import { Badge } from './badge'
import { cn } from '@/lib/utils'
import { BadgeVariant, getBadgeVariantColors } from '@/lib/colors'

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
}

export function StatusBadge({
  children,
  icon,
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge
      variant='default'
      className={cn(
        'px-2 py-1 font-medium pointer-events-none bg-primary text-white',
        className
      )}
      {...props}
    >
      {icon && <span className='mr-1'>{icon}</span>}
      {children}
    </Badge>
  )
}
