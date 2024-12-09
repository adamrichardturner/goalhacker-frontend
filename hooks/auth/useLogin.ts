'use client'

import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { processAuthError } from '@/utils/auth-errors'
import { useQueryClient } from '@tanstack/react-query'
import { transformUserData } from '@/utils/transform-user'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const useLogin = () => {
  const queryClient = useQueryClient()
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()

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

      // Add a delay to ensure cookie is set
      await new Promise((resolve) => setTimeout(resolve, 500))

      const profileResponse = await authService.getProfile()

      // Check cookies after successful login
      const cookies = document.cookie.split(';')
      console.log('Cookies after login:', cookies)

      return transformUserData(profileResponse.user)
    },
    onSuccess: (user) => {
      console.log('Login successful, setting user data')
      queryClient.setQueryData(['user'], user)
      setTimeout(() => {
        console.log('Redirecting to /goals')
        router.push('/goals')
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
