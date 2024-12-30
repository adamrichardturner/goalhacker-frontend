import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/notificationService'
import { NotificationPreferences } from '@/types/notifications'
import { toast } from 'sonner'

export function useNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] =
    useState<NotificationPermission>('default')
  const queryClient = useQueryClient()

  useEffect(() => {
    const checkSupport = async () => {
      const hasSupport =
        'Notification' in window && 'serviceWorker' in navigator
      setIsSupported(hasSupport)

      if (hasSupport) {
        setPermission(Notification.permission)

        // Check if service worker is registered
        try {
          const registration = await navigator.serviceWorker.ready
          const subscription = await registration.pushManager.getSubscription()

          // If we have a subscription but permission is denied, clean up
          if (subscription && Notification.permission !== 'granted') {
            await subscription.unsubscribe()
            await notificationService.unsubscribe()
          }
        } catch (error) {
          console.error('Error checking service worker status:', error)
        }
      }
    }

    checkSupport()

    // Add permission change listener
    const handlePermissionChange = () => {
      setPermission(Notification.permission)
    }

    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'notifications' as PermissionName })
        .then((status) => {
          status.addEventListener('change', handlePermissionChange)
        })
    }

    return () => {
      if ('permissions' in navigator) {
        navigator.permissions
          .query({ name: 'notifications' as PermissionName })
          .then((status) => {
            status.removeEventListener('change', handlePermissionChange)
          })
      }
    }
  }, [])

  const { data: settings, isLoading } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: notificationService.getSettings,
    retry: false,
  })

  const { mutateAsync: updatePreferences, isPending: isUpdating } = useMutation(
    {
      mutationFn: notificationService.updatePreferences,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notificationSettings'] })
      },
      onError: () => {
        toast.error('Failed to update notification preferences')
      },
    }
  )

  const requestPermission = async () => {
    try {
      const granted = await notificationService.requestPermission()
      setPermission(granted ? 'granted' : 'denied')

      if (granted) {
        // First update preferences to enable notifications
        await updatePreferences({
          enabled: true,
          goalReminders: {
            enabled: true,
            daysBeforeDeadline: [1],
          },
          subgoalReminders: {
            enabled: true,
            daysBeforeDeadline: [1],
          },
        })

        // Then subscribe to push notifications
        await notificationService.subscribe()
        queryClient.invalidateQueries({ queryKey: ['notificationSettings'] })
        toast.success('Notifications enabled successfully')
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      toast.error('Failed to enable notifications')
      // Revert preferences if subscription fails
      try {
        await updatePreferences({
          enabled: false,
          goalReminders: {
            enabled: false,
            daysBeforeDeadline: [],
          },
          subgoalReminders: {
            enabled: false,
            daysBeforeDeadline: [],
          },
        })
      } catch (e) {
        console.error('Error reverting preferences:', e)
      }
    }
  }

  const unsubscribe = async () => {
    try {
      // First update preferences to disable notifications
      await updatePreferences({
        enabled: false,
        goalReminders: {
          enabled: false,
          daysBeforeDeadline: [],
        },
        subgoalReminders: {
          enabled: false,
          daysBeforeDeadline: [],
        },
      })

      // Then unsubscribe from push notifications
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        await notificationService.unsubscribe()
      }

      setPermission(Notification.permission)
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] })
      toast.success('Notifications disabled successfully')
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error)
      toast.error('Failed to disable notifications')
      // Revert preferences if unsubscribe fails
      if (settings?.preferences) {
        try {
          await updatePreferences(settings.preferences)
        } catch (e) {
          console.error('Error reverting preferences:', e)
        }
      }
    }
  }

  return {
    isSupported,
    permission,
    settings,
    isLoading,
    isUpdating,
    requestPermission,
    unsubscribe,
    updatePreferences,
  }
}
