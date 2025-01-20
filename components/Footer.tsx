'use client'

import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className='text-center flex my-4 flex-col items-center justify-center text-xs text-white/90'>
      <div className='flex flex-col items-center justify-center gap-1 sm:gap-2'>
        <div className='flex items-center gap-2'>
          <Link href='/' className='hover:text-white'>
            Goal Hacker
          </Link>
          © {year}. All rights reserved.
        </div>
        <div className='flex items-center gap-2'>
          <Link href='/terms-conditions' className='hover:text-white'>
            Terms and Conditions
          </Link>
          {' | '}
          <Link href='/privacy-policy' className='hover:text-white'>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
