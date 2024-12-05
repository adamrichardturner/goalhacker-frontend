import { Goal } from '@/types/goal'

interface StatusConfig {
  label: string
  className: string
}

export const getGoalStatus = (status: Goal['status']): StatusConfig => {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        className: '#22c55e',
      }
    case 'in_progress':
      return {
        label: 'In Progress',
        className: '#7C3AED',
      }
    case 'archived':
      return {
        label: 'Archived',
        className: '#6b7280',
      }
    case 'planned':
    default:
      return {
        label: 'Planned',
        className: '#7C3AED',
      }
  }
}

export const getSubgoalStatus = (
  status: 'planned' | 'in_progress' | 'completed' | 'archived'
): StatusConfig => {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        className: 'text-success',
      }
    case 'in_progress':
      return {
        label: 'In Progress',
        className: 'text-electricPurple',
      }
    case 'archived':
      return {
        label: 'Archived',
        className: 'text-muted-foreground',
      }
    case 'planned':
    default:
      return {
        label: 'Planned',
        className: 'text-foreground',
      }
  }
}
