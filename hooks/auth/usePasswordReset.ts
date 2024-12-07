import { toast } from 'sonner'
import { authService } from '@/services/authService'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

export const usePasswordReset = () => {
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async ({
      token,
      email,
      password,
    }: {
      token: string
      email: string
      password: string
    }) => {
      await authService.resetPasswordConfirm(token, email, password)
    },
    onSuccess: () => {
      toast.success('Password reset successful! You can now log in.')
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : 'Failed to reset password'
      setError(message)
      toast.error(message)
    },
  })

  const forgotPasswordRequest = async (email: string) => {
    try {
      await authService.forgotPasswordRequest(email)
      toast.success('Password reset email sent! Please check your inbox.')
      return true
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send reset email'
      toast.error(message)
      throw error
    }
  }

  return {
    forgotPasswordRequest,
    resetPasswordConfirm: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error,
  }
}
