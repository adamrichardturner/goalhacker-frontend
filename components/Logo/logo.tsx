'use client'

import { cn } from '@/lib/utils'
import { Mountain } from 'lucide-react'

interface LogoProps {
  className?: string
  showIcon?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
}

export function Logo({ className, showIcon = true, size = 'sm' }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <h1
        className={cn(
          'font-bold tracking-tight bg-gradient-to-r from-electricPurple to-electricPurple/80 text-transparent bg-clip-text',
          size === 'xs' && 'text-sm',
          size === 'sm' && 'text-base',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-2xl',
          size === 'xl' && 'text-3xl'
        )}
      >
        Goal Hacker
      </h1>
      {showIcon && <Mountain className="text-electricPurple" size={sizeClasses[size]} />}
    </div>
  )
}
