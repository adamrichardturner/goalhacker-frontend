import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'
import { useNotifications } from '@/hooks/useNotifications'

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const { requestPermission, updatePreferences } = useNotifications()

  useEffect(() => {
    const checkNotifications = async () => {
      // Check if browser supports service workers and notifications
      if (!('serviceWorker' in navigator) || !('Notification' in window)) {
        return
      }

      // Check if we've already asked
      const hasAsked = localStorage.getItem('notificationsPrompted')
      if (hasAsked) return

      // Check if notifications are already enabled
      if (Notification.permission === 'granted') {
        localStorage.setItem('notificationsPrompted', 'true')
        return
      }

      // Wait for service worker registration
      try {
        const registration = await navigator.serviceWorker.ready
        if (registration.pushManager) {
          // Show prompt if we haven't asked before and notifications aren't enabled
          setShowPrompt(true)
        }
      } catch (err) {
        console.error('Error checking service worker:', err)
      }
    }

    checkNotifications()
  }, [])

  const handleEnable = async () => {
    try {
      // Request permission using the notifications hook
      await requestPermission()

      if (Notification.permission === 'granted') {
        // Wait for service worker registration
        const registration = await navigator.serviceWorker.ready

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        })

        // Only update preferences after successful subscription
        if (subscription) {
          // Enable notifications in settings
          await updatePreferences({
            enabled: true,
            goalReminders: {
              enabled: true,
              daysBeforeDeadline: [1, 3, 7],
            },
            subgoalReminders: {
              enabled: true,
              daysBeforeDeadline: [1, 3, 7],
            },
          })
        }
      }
    } catch (err) {
      console.error('Error enabling notifications:', err)
    }

    localStorage.setItem('notificationsPrompted', 'true')
    setShowPrompt(false)
  }

  const handleSkip = () => {
    localStorage.setItem('notificationsPrompted', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Notifications</DialogTitle>
          <DialogDescription>
            Would you like to receive notifications for your goals and
            reminders?
          </DialogDescription>
        </DialogHeader>
        <div className='flex justify-end gap-4 mt-4'>
          <Button variant='outline' onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleEnable}>Enable Notifications</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
