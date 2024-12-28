'use client'

import { ReactNode } from 'react'

interface SettingsLayoutProps {
  children: ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className='sm:pt-0 pt-[90px] container mx-auto min-h-screen px-0 w-full flex items-center justify-center'>
      {children}
    </div>
  )
}
