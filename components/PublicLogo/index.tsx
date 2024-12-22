'use client'

import Link from 'next/link'
import Logo from '../Logo'

interface PublicLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export function PublicLogo({ size = 'lg' }: PublicLogoProps) {
  return (
    <Link href='/' className='w-full pb-6 flex justify-center'>
      <Logo size={size} />
    </Link>
  )
}
