'use client'

import Link from 'next/link'
import { ClientLogo } from '../Logo'

interface PublicLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const PublicLogo = ({ className, size = 'md' }: PublicLogoProps) => {
  return (
    <Link href='/' className='w-full pb-6 flex justify-center'>
      <ClientLogo className={className} size={size} mode='dark' />
    </Link>
  )
}

export default PublicLogo
