'use client'

import { cn } from '@/lib/utils'
import { Mountain } from 'lucide-react'

interface LogoProps {
  className?: string
  showIcon?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  xs: {
    text: 'text-sm',
    icon: 'w-3 h-3',
  },
  sm: {
    text: 'text-lg sm:text-xl',
    icon: 'w-4 h-4 sm:w-5 sm:h-5',
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
}

export function Logo({ className, showIcon = true, size = 'md' }: LogoProps) {
  const { text, icon } = sizeClasses[size]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <h1 className={cn('font-[800]', text)}>
        <span className='text-electricPurple'>Goal</span> Hacker
      </h1>
      {showIcon && <Mountain className={cn('text-electricPurple', icon)} />}
    </div>
  )
}

export default Logo
