import { User } from '@/types/auth'
import { api } from './api'
import { AxiosError } from 'axios'

interface LoginResponse {
  success: boolean
  user: User
  error?: string
}

interface RegisterResponse {
  success: boolean
  message: string
  user: User
  error?: string
}

interface ProfileResponse {
  success: boolean
  user: User
  error?: string
}

export const authService = {
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    try {
      const response = await api.post<LoginResponse>(
        '/api/users/login',
        {
          email: email.trim(),
          password: password.trim(),
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.error || 'Login failed')
      }

      // Add a small delay to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 100))

      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Invalid email or password')
      }
      throw error
    }
  },

  async register(userData: Partial<User>) {
    try {
      const response = await api.post<RegisterResponse>('/api/users/register', userData, {
        withCredentials: true,
      })

      if (!response.data.success) {
        throw new Error(response.data.error || 'Registration failed')
      }

      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to register user')
      }
      throw error
    }
  },

  async getProfile() {
    try {
      const response = await api.get<ProfileResponse>('/api/users/profile', {
        withCredentials: true,
      })

      if (!response.data.success) {
        throw new Error('Failed to get user profile')
      }

      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to get user profile')
      }
      throw error
    }
  },

  async logout() {
    try {
      // Call backend to destroy session
      const response = await api.post<{ success: boolean; message: string }>(
        '/api/users/logout',
        {},
        {
          withCredentials: true,
        }
      )

      if (!response.data.success) {
        throw new Error('Failed to logout')
      }

      // Clear local storage if you're storing anything there
      localStorage.clear()

      return response.data
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },

  async verifyEmail(token: string, email: string) {
    const response = await api.post<{ success: boolean }>(
      '/api/users/verify-email',
      { token, email },
      { withCredentials: true }
    )
    return response.data
  },

  async resendVerificationEmail(email: string) {
    const response = await api.post<{ success: boolean }>(
      '/api/users/resend-verification',
      { email },
      { withCredentials: true }
    )
    return response.data
  },

  async forgotPasswordRequest(email: string) {
    try {
      const response = await api.post<{ success: boolean }>(
        '/api/users/reset-password',
        { email },
        { withCredentials: true }
      )
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to send reset password email')
      }
      throw error
    }
  },

  async resetPasswordConfirm(token: string, email: string, newPassword: string) {
    try {
      const response = await api.post<{ success: boolean }>(
        '/api/users/reset-password/confirm',
        { token, email, newPassword },
        { withCredentials: true }
      )
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to reset password')
      }
      throw error
    }
  },
}
