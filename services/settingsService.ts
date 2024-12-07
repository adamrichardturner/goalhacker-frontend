import { api } from './api'
import { DateFormat } from '@/hooks/useSettings'

interface UserSettings {
  date_format: DateFormat | null
  username?: string
}

interface ProfileUpdateData {
  firstName: string
  lastName: string
}

export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    const { data } = await api.get('/api/users/preferences/date-format', {
      withCredentials: true,
    })
    return data
  },

  async updateDateFormat(format: DateFormat): Promise<void> {
    await api.patch(
      '/api/users/preferences/date-format',
      {
        date_format: format,
      },
      {
        withCredentials: true,
      }
    )
  },

  async updateProfile(data: ProfileUpdateData): Promise<void> {
    await api.patch(
      '/api/users/profile',
      {
        first_name: data.firstName,
        last_name: data.lastName,
      },
      {
        withCredentials: true,
      }
    )
  },

  async requestPasswordReset(): Promise<void> {
    const { data: user } = await api.get('/api/users/profile', {
      withCredentials: true,
    })
    await api.post(
      '/api/users/reset-password',
      { email: user.email },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post(
      '/api/users/reset-password/confirm',
      { token, password },
      {
        withCredentials: true,
      }
    )
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/api/users/delete', {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Clear session cookie
    document.cookie =
      'goalhacker.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost; sameSite=none;'
    localStorage.clear()
  },
}
