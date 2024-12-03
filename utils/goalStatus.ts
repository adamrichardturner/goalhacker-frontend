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
        className: 'bg-green-500/10 text-green-500 backdrop-blur-sm',
      }
    case 'in_progress':
      return {
        label: 'In Progress',
        className: 'bg-blue-500/10 text-blue-500 backdrop-blur-sm',
      }
    case 'archived':
      return {
        label: 'Archived',
        className: 'bg-gray-500/10 text-gray-500 backdrop-blur-sm',
      }
    case 'planned':
    default:
      return {
        label: 'Planned',
        className: 'bg-electricPurple text-white backdrop-blur-sm',
      }
  }
}

export const getSubgoalStatus = (
  status: 'planned' | 'in_progress' | 'completed'
): StatusConfig => {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        className: 'bg-green-500/10 text-green-500 backdrop-blur-sm',
      }
    case 'in_progress':
      return {
        label: 'In Progress',
        className: 'bg-blue-500/10 text-blue-500 backdrop-blur-sm',
      }
    case 'planned':
    default:
      return {
        label: 'Planned',
        className: 'bg-purple-500/10 text-purple-500 backdrop-blur-sm',
      }
  }
}
