'use client'

import { useNotifications } from '@/hooks/useNotifications'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { BellIcon, BellOffIcon } from 'lucide-react'
import { Button } from './ui/button'
import { MultiSelect } from './ui/multi-select'

const REMINDER_OPTIONS = [
  { value: '1', label: '1 day before' },
  { value: '3', label: '3 days before' },
  { value: '7', label: '7 days before' },
  { value: '14', label: '14 days before' },
  { value: '30', label: '30 days before' },
]

export function NotificationSettings() {
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
    if (permission !== 'granted') {
      await requestPermission()
    } else {
      await unsubscribe()
    }
  }

  const handlePreferenceChange = async (
    type: 'goalReminders' | 'subgoalReminders',
    enabled: boolean
  ) => {
    if (!settings?.preferences) return

    await updatePreferences({
      ...settings.preferences,
      [type]: {
        ...settings.preferences[type],
        enabled,
      },
    })
  }

  const handleReminderDaysChange = async (
    type: 'goalReminders' | 'subgoalReminders',
    days: string[]
  ) => {
    if (!settings?.preferences) return

    await updatePreferences({
      ...settings.preferences,
      [type]: {
        ...settings.preferences[type],
        daysBeforeDeadline: days.map(Number),
      },
    })
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
            {permission === 'granted' ? (
              <BellIcon className='h-4 w-4' />
            ) : (
              <BellOffIcon className='h-4 w-4' />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {permission === 'granted' && (
          <>
            <div className='flex items-center justify-between space-x-2'>
              <Label htmlFor='goal-reminders'>Goal Reminders</Label>
              <Switch
                id='goal-reminders'
                checked={settings?.preferences?.goalReminders?.enabled ?? false}
                onCheckedChange={(checked) =>
                  handlePreferenceChange('goalReminders', checked)
                }
                disabled={isUpdating}
              />
            </div>

            {settings?.preferences?.goalReminders?.enabled && (
              <div className='space-y-2'>
                <Label>Remind me before goal deadline</Label>
                <MultiSelect
                  options={REMINDER_OPTIONS}
                  value={(
                    settings?.preferences?.goalReminders?.daysBeforeDeadline ||
                    []
                  ).map(String)}
                  onChange={(values) =>
                    handleReminderDaysChange('goalReminders', values)
                  }
                  disabled={isUpdating}
                />
              </div>
            )}

            <div className='flex items-center justify-between space-x-2'>
              <Label htmlFor='subgoal-reminders'>Subgoal Reminders</Label>
              <Switch
                id='subgoal-reminders'
                checked={
                  settings?.preferences?.subgoalReminders?.enabled ?? false
                }
                onCheckedChange={(checked) =>
                  handlePreferenceChange('subgoalReminders', checked)
                }
                disabled={isUpdating}
              />
            </div>

            {settings?.preferences?.subgoalReminders?.enabled && (
              <div className='space-y-2'>
                <Label>Remind me before subgoal deadline</Label>
                <MultiSelect
                  options={REMINDER_OPTIONS}
                  value={(
                    settings?.preferences?.subgoalReminders
                      ?.daysBeforeDeadline ?? []
                  ).map(String)}
                  onChange={(values) =>
                    handleReminderDaysChange('subgoalReminders', values)
                  }
                  disabled={isUpdating}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
