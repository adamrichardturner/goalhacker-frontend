import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="sm:pt-0 pt-[90px] w-full mx-auto min-h-screen sm:px-0 flex items-center justify-center">
      {children}
    </div>
  )
}
