import { useQuery } from '@tanstack/react-query'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/services/authService'
import { User } from '@/types/auth'
import { transformUserData } from '@/utils/transform-user'
import { useState, useEffect } from 'react'

export const useUser = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [hasSessionCookie, setHasSessionCookie] = useState(false)

  useEffect(() => {
    const cookies = document.cookie.split(';')
    const hasSession = cookies.some((cookie) =>
      cookie.trim().startsWith('goalhacker.sid=')
    )
    setHasSessionCookie(hasSession)
  }, [])

  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ]

  const {
    data: user,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch: refetchUser,
  } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      if (publicPaths.includes(pathname) && !hasSessionCookie) {
        return null
      }

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
    staleTime: 1000 * 60 * 5,
    enabled: hasSessionCookie || !publicPaths.includes(pathname),
  })

  return {
    user,
    isLoading,
    isError,
    error,
    isSuccess,
    hasSessionCookie,
    refetchUser,
  }
}
