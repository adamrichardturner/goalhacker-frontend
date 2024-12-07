'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className='text-center text-xs text-muted-foreground pt-4'>
      <div>
        <Link href='/' className='hover:text-primary'>
          Goal Hacker
        </Link>
        {' © 2024 | '}
        <Link href='/terms-conditions' className='hover:text-primary'>
          Terms and Conditions
        </Link>
        {' | '}
        <Link href='/privacy-policy' className='hover:text-primary'>
          Privacy Policy
        </Link>
      </div>
    </footer>
  )
}
