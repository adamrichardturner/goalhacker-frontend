/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

interface PublicLogoProps {
  className?: string
}

export const PublicLogo = ({
  className = 'h-8 sm:h-12 mb-4',
}: PublicLogoProps) => {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = !mounted
    ? '/goalhacker-logo.svg'
    : theme === 'dark'
      ? '/goalhacker-logo-dark.svg'
      : '/goalhacker-logo.svg'

  return (
    <Link href='/' className='w-full pb-6 flex justify-center'>
      <img src={logoSrc} alt='Goal Hacker' className={className} />
    </Link>
  )
}

export default PublicLogo
