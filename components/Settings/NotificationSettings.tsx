'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useNotifications } from '@/hooks/useNotifications'
import { NotificationPreferences } from '@/types/notifications'
import { BellIcon, BellOffIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const REMINDER_OPTIONS = [
  { value: '1', label: '1 day before' },
  { value: '3', label: '3 days before' },
  { value: '7', label: '7 days before' },
  { value: '14', label: '14 days before' },
  { value: '30', label: '30 days before' },
] as const

const isValidPreferences = (
  prefs: unknown
): prefs is NotificationPreferences => {
  if (!prefs || typeof prefs !== 'object') return false
  const p = prefs as NotificationPreferences
  return (
    typeof p.enabled === 'boolean' &&
    typeof p.goalReminders?.enabled === 'boolean' &&
    Array.isArray(p.goalReminders?.daysBeforeDeadline) &&
    typeof p.subgoalReminders?.enabled === 'boolean' &&
    Array.isArray(p.subgoalReminders?.daysBeforeDeadline)
  )
}

export default function NotificationSettings() {
  const {
    isSupported,
    permission,
    settings,
    isLoading,
    isUpdating,
    requestPermission,
    unsubscribe,
    updatePreferences,
  } = useNotifications()

  const defaultPreferences: NotificationPreferences = {
    enabled: true,
    goalReminders: {
      enabled: true,
      daysBeforeDeadline: [1],
    },
    subgoalReminders: {
      enabled: true,
      daysBeforeDeadline: [1],
    },
  }

  // Initialize preferences with default values if settings are not available
  const initialPreferences = useMemo(() => {
    if (!settings?.preferences || !isValidPreferences(settings.preferences)) {
      return defaultPreferences
    }

    // Ensure there's always at least one day selected if reminders are enabled
    return {
      enabled: settings.preferences.enabled,
      goalReminders: {
        enabled: settings.preferences.goalReminders.enabled,
        daysBeforeDeadline:
          settings.preferences.goalReminders.enabled &&
          settings.preferences.goalReminders.daysBeforeDeadline.length === 0
            ? [1]
            : settings.preferences.goalReminders.daysBeforeDeadline,
      },
      subgoalReminders: {
        enabled: settings.preferences.subgoalReminders.enabled,
        daysBeforeDeadline:
          settings.preferences.subgoalReminders.enabled &&
          settings.preferences.subgoalReminders.daysBeforeDeadline.length === 0
            ? [1]
            : settings.preferences.subgoalReminders.daysBeforeDeadline,
      },
    }
  }, [settings])

  const [preferences, setPreferences] =
    useState<NotificationPreferences>(initialPreferences)

  // Update preferences when settings change
  useEffect(() => {
    setPreferences(initialPreferences)
  }, [initialPreferences])

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Your browser does not support push notifications
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const handleToggleNotifications = async () => {
    try {
      if (permission !== 'granted') {
        // Update state optimistically
        const newPreferences: NotificationPreferences = {
          enabled: true,
          goalReminders: {
            enabled: true,
            daysBeforeDeadline: [1],
          },
          subgoalReminders: {
            enabled: true,
            daysBeforeDeadline: [1],
          },
        }
        setPreferences(newPreferences)

        // Request permission and get subscription
        await requestPermission()

        // After permission is granted, update backend
        await updatePreferences(newPreferences)
      } else if (preferences.enabled) {
        // Update state optimistically
        const newPreferences: NotificationPreferences = {
          enabled: false,
          goalReminders: {
            enabled: false,
            daysBeforeDeadline: [],
          },
          subgoalReminders: {
            enabled: false,
            daysBeforeDeadline: [],
          },
        }
        setPreferences(newPreferences)

        // Then unsubscribe
        await unsubscribe()
      } else {
        // Update state optimistically
        const newPreferences: NotificationPreferences = {
          enabled: true,
          goalReminders: {
            enabled: true,
            daysBeforeDeadline: [1],
          },
          subgoalReminders: {
            enabled: true,
            daysBeforeDeadline: [1],
          },
        }
        setPreferences(newPreferences)

        // Request permission again to get a new subscription
        await requestPermission()

        // Then update backend
        await updatePreferences(newPreferences)
      }
    } catch (err) {
      // If there's an error, revert the state
      setPreferences(initialPreferences)
      console.error('Error toggling notifications:', err)
    }
  }

  const handlePreferenceChange = async (
    type: 'goalReminders' | 'subgoalReminders',
    enabled: boolean
  ) => {
    if (!preferences) return

    const newPreferences: NotificationPreferences = {
      ...preferences,
      [type]: {
        ...preferences[type],
        enabled,
      },
    }

    setPreferences(newPreferences)
    await updatePreferences(newPreferences)
  }

  const handleReminderDayChange = async (
    type: 'goalReminders' | 'subgoalReminders',
    day: string
  ) => {
    if (!preferences) return

    const newPreferences: NotificationPreferences = {
      ...preferences,
      [type]: {
        ...preferences[type],
        daysBeforeDeadline: [Number(day)],
      },
    }

    setPreferences(newPreferences)
    await updatePreferences(newPreferences)
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>
              Get notified about your goals and deadlines
            </CardDescription>
          </div>
          <Button
            variant='outline'
            size='icon'
            onClick={handleToggleNotifications}
            disabled={isLoading || isUpdating}
          >
            {permission === 'granted' && preferences.enabled ? (
              <BellIcon className='h-4 w-4' />
            ) : (
              <BellOffIcon className='h-4 w-4' />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {permission === 'granted' && preferences.enabled && (
          <>
            <div className='flex items-center justify-between space-x-2'>
              <Label htmlFor='goal-reminders'>Goal Reminders</Label>
              <Switch
                id='goal-reminders'
                checked={preferences.goalReminders.enabled}
                onCheckedChange={(checked) =>
                  handlePreferenceChange('goalReminders', checked)
                }
                disabled={isUpdating}
              />
            </div>

            {preferences.goalReminders.enabled && (
              <div className='space-y-2'>
                <Label>Remind me before goal deadline</Label>
                <Select
                  value={String(
                    preferences.goalReminders.daysBeforeDeadline[0]
                  )}
                  onValueChange={(value) =>
                    handleReminderDayChange('goalReminders', value)
                  }
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select reminder time' />
                  </SelectTrigger>
                  <SelectContent>
                    {REMINDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className='flex items-center justify-between space-x-2'>
              <Label htmlFor='subgoal-reminders'>Subgoal Reminders</Label>
              <Switch
                id='subgoal-reminders'
                checked={preferences.subgoalReminders.enabled}
                onCheckedChange={(checked) =>
                  handlePreferenceChange('subgoalReminders', checked)
                }
                disabled={isUpdating}
              />
            </div>

            {preferences.subgoalReminders.enabled && (
              <div className='space-y-2'>
                <Label>Remind me before subgoal deadline</Label>
                <Select
                  value={String(
                    preferences.subgoalReminders.daysBeforeDeadline[0]
                  )}
                  onValueChange={(value) =>
                    handleReminderDayChange('subgoalReminders', value)
                  }
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select reminder time' />
                  </SelectTrigger>
                  <SelectContent>
                    {REMINDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
