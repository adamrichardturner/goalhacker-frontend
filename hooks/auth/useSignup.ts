import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authService } from '@/services/authService'
import { RegisterCredentials } from '@/types/auth'

export const useSignup = () => {
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await authService.register(credentials)
      return response
    },
    onSuccess: async (_, variables) => {
      toast.success(
        'Account created! Please check your email to verify your account.'
      )
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Redirect to await-verification page with email
      router.push(
        `/await-verification?email=${encodeURIComponent(variables.email)}`
      )
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create account')
    },
  })

  return {
    signup: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  }
}
