import { ReactNode } from 'react'

interface GoalsLayoutProps {
  children: ReactNode
}

export default function GoalsLayout({ children }: GoalsLayoutProps) {
  return (
    <div className='sm:pt-0 pt-[90px] container min-h-screen mx-auto px-0 sm:px-0 w-full flex items-start justify-center'>
      {children}
    </div>
  )
}
