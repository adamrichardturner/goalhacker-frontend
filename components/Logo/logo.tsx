'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showIcon?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  xs: 'h-4',
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
  xl: 'h-12',
}

export function Logo({ className, showIcon = true, size = 'md' }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showIcon && (
        <svg
          className={cn('text-electricPurple', sizeClasses[size])}
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12 2L2 7L12 12L22 7L12 2Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M2 17L12 22L22 17'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M2 12L12 17L22 12'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      )}
      <span
        className={cn(
          'font-bold tracking-tight text-foreground',
          size === 'xs' && 'text-sm',
          size === 'sm' && 'text-base',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-2xl',
          size === 'xl' && 'text-3xl'
        )}
      >
        Goal Hacker
      </span>
    </div>
  )
}
