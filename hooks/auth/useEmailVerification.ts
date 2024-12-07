import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authService } from '@/services/authService'
import { useUser } from '@/hooks/auth/useUser'

export const useEmailVerification = () => {
  const router = useRouter()
  const { refetchUser } = useUser()

  const verifyEmail = async (token: string, email: string) => {
    try {
      await authService.verifyEmail(token, email)
      await refetchUser()
      toast.success('Email verified successfully!')
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push('/goals')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Email verification failed'
      )
      throw error
    }
  }

  const resendVerification = async (email: string) => {
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

  return { verifyEmail, resendVerification }
}
