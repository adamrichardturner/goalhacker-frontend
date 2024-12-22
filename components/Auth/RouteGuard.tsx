'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth/useAuth'

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function RouteGuard({ children, requireAuth = true }: RouteGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.replace('/')
      } else if (!requireAuth && isAuthenticated) {
        router.replace('/goals')
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router])

  if (isLoading) {
    return null // or a loading spinner
  }

  return <>{children}</>
}
