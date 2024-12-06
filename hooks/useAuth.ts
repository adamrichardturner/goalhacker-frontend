import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/services/authService'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { User, ApiUser, RegisterCredentials } from '@/types/auth'

export const useAuth = () => {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const publicPaths = [
    '/login',
    '/signup',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ]

  const transformUserData = (apiUser: ApiUser | User): User => ({
    user_id: 'id' in apiUser ? apiUser.id : apiUser.user_id,
    email: apiUser.email,
    username: apiUser.username,
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,
    plan_type: apiUser.plan_type,
    email_verified: apiUser.email_verified,
    avatar_url: apiUser.avatar_url,
    created_at: apiUser.created_at,
    updated_at: apiUser.updated_at,
  })

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
      // Skip the profile check on public paths
      if (publicPaths.includes(pathname)) {
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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    enabled: !publicPaths.includes(pathname), // Only run query on protected routes
  })

  const signUpMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await authService.register(credentials)
      return response
    },
    onSuccess: () => {
      toast.success(
        'Account created! Please check your email to verify your account.'
      )
      router.push('/login')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create account')
    },
  })

  const signup = async (credentials: RegisterCredentials) => {
    const response = signUpMutation.mutate(credentials)
    return response !== undefined
  }

  const login = async (email: string, password: string) => {
    try {
      // First, perform the login
      await authService.login(email, password)

      // Then fetch the full profile
      const profileResponse = await authService.getProfile()
      const transformedUser = transformUserData(profileResponse.user)

      // Set the user data in the cache
      queryClient.setQueryData(['user'], transformedUser)

      // Show success message
      toast.success('Login successful')

      // Navigate to goals page
      router.push('/goals')

      return transformedUser
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      queryClient.setQueryData(['user'], null)
      document.cookie =
        'goalhacker.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost; sameSite=none;'
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Logout failed')
      throw error
    }
  }

  const verifyEmail = async (token: string, email: string) => {
    try {
      await authService.verifyEmail(token, email)
      await refetchUser() // Refresh user data to update email_verified status
      toast.success('Email verified successfully!')
      router.push('/goals')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Email verification failed'
      )
      throw error
    }
  }

  const resendVerificationEmail = async (email: string) => {
    try {
      await authService.resendVerificationEmail(email)
      toast.success('Verification email sent! Please check your inbox.')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to send verification email'
      )
      throw error
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email)
      toast.success('Password reset email sent! Please check your inbox.')
      return true
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to send password reset email'
      )
      throw error
    }
  }

  const resetPassword = async (
    token: string,
    email: string,
    newPassword: string
  ) => {
    try {
      await authService.resetPassword(token, email, newPassword)
      toast.success('Password reset successful! You can now log in.')
      router.push('/login')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to reset password'
      )
      throw error
    }
  }

  return {
    user,
    isLoading,
    isError,
    error,
    isSuccess,
    login,
    logout,
    signup,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
  }
}

export default useAuth
