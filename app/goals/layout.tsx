import { ReactNode } from 'react'

interface GoalsLayoutProps {
  children: ReactNode
}

export default function GoalsLayout({ children }: GoalsLayoutProps) {
  return (
    <div className='container pt-[70px] sm:pt-[0px] sm:pt-0 min-h-screen mx-auto px-0 sm:px-0 w-full flex items-start justify-center'>
      {children}
    </div>
  )
}
