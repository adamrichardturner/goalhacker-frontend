import { useQuery } from '@tanstack/react-query'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/services/authService'
import { User } from '@/types/auth'
import { transformUserData } from '@/utils/transform-user'
import { useState, useEffect } from 'react'
import { Preferences } from '@capacitor/preferences'

export const useUser = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isInitializing, setIsInitializing] = useState(true)

  const {
    data: user,
    isLoading: isQueryLoading,
    isError,
    error,
    isSuccess,
    refetch: refetchUser,
  } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const response = await authService.getProfile()
        const transformedUser = transformUserData(response.user)
        return transformedUser
      } catch (error) {
        if (!publicPaths.includes(pathname)) {
          router.push('/login')
        }
        throw error
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  })

  // Update initializing state when we have a result
  useEffect(() => {
    if (!isQueryLoading) {
      setIsInitializing(false)
    }
  }, [isQueryLoading])

  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/await-verification',
  ]

  // Consider loading until we've completed the initial query
  const isLoading = isInitializing || isQueryLoading

  // Store auth tokens
  const storeToken = async (token: string) => {
    await Preferences.set({
      key: 'auth_token',
      value: token,
    })
  }

  return {
    user: isLoading ? null : user,
    isLoading,
    isError: !isLoading && isError,
    error,
    isSuccess: !isLoading && isSuccess,
    hasSessionCookie: isSuccess && !!user, // Derive from successful auth
    refetchUser,
  }
}
