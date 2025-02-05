'use client'

import { Logo as ServerLogo } from './server'

interface LogoProps {
  className?: string
  showIcon?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  mode?: 'light' | 'dark'
}

export function Logo(props: LogoProps) {
  return <ServerLogo {...props} />
}

export default Logo
