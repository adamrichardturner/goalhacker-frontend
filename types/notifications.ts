export interface NotificationPreferences {
  enabled: boolean
  goalReminders: {
    enabled: boolean
    daysBeforeDeadline: number[]
  }
  subgoalReminders: {
    enabled: boolean
    daysBeforeDeadline: number[]
  }
}

export interface UserNotification {
  id: string
  userId: string
  subscription: PushSubscription
  preferences: NotificationPreferences
  createdAt: Date
  updatedAt: Date
}
