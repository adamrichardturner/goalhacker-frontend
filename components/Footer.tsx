'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className='text-center flex my-4 flex-col items-center justify-center text-xs text-muted-foreground'>
      <div className='flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2'>
        <div className='flex items-center gap-2'>
          <Link href='/' className='hover:text-primary'>
            Goal Hacker
          </Link>
          {' © 2024'}
        </div>
        <div className='flex items-center gap-2'>
          <Link href='/terms-conditions' className='hover:text-primary'>
            Terms and Conditions
          </Link>
          {' | '}
          <Link href='/privacy-policy' className='hover:text-primary'>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
