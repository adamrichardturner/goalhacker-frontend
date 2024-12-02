import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  ProfileResponse,
} from '@/types/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      credentials: 'include',
      headers: defaultHeaders,
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    return response.json()
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      credentials: 'include',
      headers: defaultHeaders,
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    return response.json()
  },

  async logout(): Promise<void> {
    const response = await fetch(`${API_URL}/api/users/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: defaultHeaders,
    })

    if (!response.ok) {
      throw new Error('Logout failed')
    }
  },

  async getProfile(): Promise<ProfileResponse> {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      credentials: 'include',
      headers: defaultHeaders,
    })

    if (response.status === 401) {
      throw new Error('Unauthorized - Please log in')
    }

    if (!response.ok) {
      throw new Error('Failed to get user profile')
    }

    return response.json()
  },

  async verifyEmail(token: string, email: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/users/verify-email`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ token, email }),
    })

    if (!response.ok) {
      throw new Error('Email verification failed')
    }
  },

  async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error('Failed to send reset password email')
    }
  },

  async resetPassword(token: string, password: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/users/reset-password`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ token, password }),
    })

    if (!response.ok) {
      throw new Error('Password reset failed')
    }
  },

  async resendVerificationEmail(): Promise<void> {
    const response = await fetch(
      `${API_URL}/api/users/resend-verification-email`,
      {
        method: 'POST',
        credentials: 'include',
        headers: defaultHeaders,
      }
    )

    if (!response.ok) {
      throw new Error('Failed to resend verification email')
    }
  },
}
