import { Mountain } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showIcon?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
}

const sizeClasses = {
  xs: {
    text: 'text-sm',
    icon: 'w-3 h-3',
  },
  sm: {
    text: 'text-sm sm:text-xl',
    icon: 'w-3 h-3 sm:w-5 sm:h-5',
  },
  md: {
    text: 'text-xl sm:text-2xl',
    icon: 'w-5 h-5 sm:w-6 sm:h-6',
  },
  lg: {
    text: 'text-2xl sm:text-3xl',
    icon: 'w-6 h-6 sm:w-7 sm:h-7',
  },
  xl: {
    text: 'text-3xl sm:text-4xl',
    icon: 'w-7 h-7 sm:w-8 sm:h-8',
  },
  '2xl': {
    text: 'text-4xl sm:text-5xl',
    icon: 'w-8 h-8 sm:w-9 sm:h-9',
  },
  '3xl': {
    text: 'text-5xl sm:text-6xl',
    icon: 'w-9 h-9 sm:w-10 sm:h-10',
  },
  '4xl': {
    text: 'text-6xl sm:text-7xl',
    icon: 'w-10 h-10 sm:w-11 sm:h-11',
  },
  '5xl': {
    text: 'text-7xl sm:text-8xl',
    icon: 'w-11 h-11 sm:w-12 sm:h-12',
  },
}

export function Logo({ className, showIcon = true, size = 'md' }: LogoProps) {
  const { text, icon } = sizeClasses[size]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <h1 className={cn('font-[800]', text)}>
        <span className='text-primaryActive'>Goal</span> Hacker
      </h1>
      {showIcon && <Mountain className={cn('text-primaryActive', icon)} />}
    </div>
  )
}

export default Logo
