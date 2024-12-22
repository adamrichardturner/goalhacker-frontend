'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'

interface RegisterCredentials {
  email: string
  password: string
  first_name?: string
  last_name?: string
  username?: string
}

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const signup = async (credentials: RegisterCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.register(credentials)
      if (!response.success) {
        throw new Error(response.error || 'Registration failed')
      }
      router.replace('/await-verification')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}
