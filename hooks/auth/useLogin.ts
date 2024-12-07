import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { processAuthError } from '@/utils/auth-errors'
import { useQueryClient } from '@tanstack/react-query'
import { transformUserData } from '@/utils/transform-user'
import { useState } from 'react'

export const useLogin = () => {
  const queryClient = useQueryClient()
  const [loginError, setLoginError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      const loginResponse = await authService.login(email, password)
      if (!loginResponse.success) {
        throw new Error(loginResponse.error || 'Login failed')
      }
      const profileResponse = await authService.getProfile()
      return transformUserData(profileResponse.user)
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user)
      setTimeout(() => {
        window.location.href = '/goals'
      }, 500)
    },
    onError: (error) => {
      const errorMessage = processAuthError(error)
      setLoginError(errorMessage)
    },
    retry: 0,
    networkMode: 'always',
  })

  return {
    login: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: loginError,
  }
}
