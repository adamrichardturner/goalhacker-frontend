import { toast } from 'sonner'
import { authService } from '@/services/authService'
import { useUser } from '@/hooks/auth/useUser'

export const useEmailVerification = () => {
  const { refetchUser } = useUser()

  const verifyEmail = async (token: string, email: string) => {
    try {
      await authService.verifyEmail(token, email)
      await refetchUser()
      toast.success('Email verified successfully! Redirecting to login...')
      await new Promise((resolve) => setTimeout(resolve, 5000))
      window.location.href = '/login'
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Email verification failed'
      )
      window.location.href = '/error'
      throw error
    }
  }

  const resendVerification = async (email: string) => {
    try {
      await authService.resendVerificationEmail(email)
      toast.success('Verification email sent! Please check your inbox.')
      window.location.href = '/await-verification'
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to send verification email'
      )
      throw error
    }
  }

  return { verifyEmail, resendVerification }
}
