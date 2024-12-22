'use client'

import { useUser } from './useUser'

export function useAuth() {
  const { user, isLoading } = useUser()
  return {
    isAuthenticated: !!user,
    isLoading,
  }
}
