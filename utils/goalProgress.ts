import { Goal } from '@/types/goal'

interface ProgressResult {
  progress: number | null
  completedSteps: number
  totalSteps: number
  hasSubgoals: boolean
}

export const calculateGoalProgress = (goal: Goal): ProgressResult => {
  // Check if subgoals array exists and has items
  const hasSubgoals = Array.isArray(goal.subgoals) && goal.subgoals.length > 0

  // Return null values if no subgoals exist
  if (!hasSubgoals) {
    return {
      progress: null,
      completedSteps: 0,
      totalSteps: 0,
      hasSubgoals: false,
    }
  }

  const completedSteps = goal.subgoals!.filter(
    (subgoal) => subgoal.status === 'completed'
  ).length
  const totalSteps = goal.subgoals!.length

  return {
    progress: Math.round((completedSteps / totalSteps) * 100),
    completedSteps,
    totalSteps,
    hasSubgoals: true,
  }
}
