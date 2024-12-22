'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login(email, password)
      if (!response.success) {
        throw new Error(response.error || 'Login failed')
      }
      router.replace('/goals')
    } catch (err: any) {
      setError(err.message || 'Failed to login')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
