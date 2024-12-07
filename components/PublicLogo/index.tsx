'use client'

import Link from 'next/link'
import { Logo } from '../Logo'

interface PublicLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const PublicLogo = ({ className, size = 'md' }: PublicLogoProps) => {
  return (
    <Link href='/' className='w-full pb-6 flex justify-center'>
      <Logo className={className} size={size} />
    </Link>
  )
}

export default PublicLogo
