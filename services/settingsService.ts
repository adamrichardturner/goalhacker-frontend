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
    const { data } = await api.get('/api/users/preferences/date-format')
    return data
  },

  async updateDateFormat(format: DateFormat): Promise<void> {
    await api.patch('/api/users/preferences/date-format', {
      date_format: format,
    })
  },

  async updateProfile(data: ProfileUpdateData): Promise<void> {
    await api.patch('/api/users/profile', {
      first_name: data.firstName,
      last_name: data.lastName,
    })
  },

  async requestPasswordReset(): Promise<void> {
    await api.post(
      '/api/users/reset-password',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/api/users/reset-password/confirm', { token, password })
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/api/users/delete')
  },
}
