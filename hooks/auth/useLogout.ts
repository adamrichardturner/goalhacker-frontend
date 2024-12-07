import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authService } from '@/services/authService'

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const clearSessionCookie = () => {
    // Clear cookie for all possible domains and paths
    const cookieOptions = [
      'goalhacker.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;',
      'goalhacker.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;',
      'goalhacker.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;',
      'goalhacker.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost; sameSite=none;',
    ]

    cookieOptions.forEach((option) => {
      document.cookie = option
    })
  }

  const logout = async () => {
    try {
      await authService.logout()
      queryClient.setQueryData(['user'], null)
      queryClient.clear() // Clear all queries
      clearSessionCookie()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Logout failed')
      throw error
    }
  }

  return { logout }
}
