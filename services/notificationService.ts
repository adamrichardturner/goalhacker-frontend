import {
  NotificationPreferences,
  UserNotification,
} from '../types/notifications'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const notificationService = {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications')
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  },

  async subscribe(): Promise<void> {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })

    await fetch(`${API_URL}/api/notifications/subscribe`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })
  },

  async unsubscribe(): Promise<void> {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
      await fetch(`${API_URL}/api/notifications/unsubscribe`, {
        method: 'DELETE',
        credentials: 'include',
      })
    }
  },

  async getSettings(): Promise<UserNotification | null> {
    const response = await fetch(`${API_URL}/api/notifications/settings`, {
      credentials: 'include',
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch notification settings')
    }

    const data = await response.json()
    return data
  },

  async updatePreferences(preferences: NotificationPreferences): Promise<void> {
    const response = await fetch(`${API_URL}/api/notifications/preferences`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    })

    if (!response.ok) {
      throw new Error('Failed to update notification preferences')
    }
  },
}
