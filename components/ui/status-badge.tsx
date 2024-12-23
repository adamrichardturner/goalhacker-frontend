import { Badge } from './badge'
import { cn } from '@/lib/utils'
import { BadgeVariant, getBadgeVariantColors } from '@/lib/colors'

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
  icon?: React.ReactNode
}

export function StatusBadge({
  children,
  variant = 'primaryActive',
  icon,
  className,
  ...props
}: StatusBadgeProps) {
  const colors = getBadgeVariantColors(variant)

  return (
    <Badge
      variant='default'
      className={cn(
        'px-2 py-1 font-medium pointer-events-none',
        colors.bg,
        colors.text,
        className
      )}
      {...props}
    >
      {icon && <span className='mr-1'>{icon}</span>}
      {children}
    </Badge>
  )
}
