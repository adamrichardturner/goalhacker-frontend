import { Goal } from '@/types/goal'

type GoalPriority = Goal['priority']

interface PriorityConfig {
  label: string
  className: string
  color: string
}

const defaultConfig: PriorityConfig = {
  label: 'Low',
  className: 'text-white border',
  color: '#64748B', // slate-500
}

export const getPriorityConfig = (priority?: GoalPriority): PriorityConfig => {
  if (!priority) return defaultConfig

  const configs: Record<GoalPriority, PriorityConfig> = {
    high: {
      label: 'High',
      className: 'text-white border',
      color: '#EF4444', // red-500
    },
    medium: {
      label: 'Medium',
      className: 'text-white border',
      color: '#EAB308', // yellow-500
    },
    low: {
      label: 'Low',
      className: 'text-white border',
      color: '#64748B', // slate-500
    },
  }

  return configs[priority] || defaultConfig
}
