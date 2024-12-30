'use client'

import { ReactNode } from 'react'
import { NotificationPrompt } from '@/components/NotificationPrompt'

interface GoalsLayoutProps {
  children: ReactNode
}

export default function GoalsLayout({ children }: GoalsLayoutProps) {
  return (
    <>
      <NotificationPrompt />
      <div className='container pt-[70px] sm:pt-[0px] sm:pt-0 min-h-screen mx-auto px-0 sm:px-0 w-full flex items-start justify-center'>
        {children}
      </div>
    </>
  )
}
