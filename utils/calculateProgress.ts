import { Subgoal } from '@/types/goal'

const STATUS_WEIGHTS = {
  planned: 0,
  in_progress: 0.5,
  completed: 1,
} as const

export const calculateProgress = (subgoals: Subgoal[] | undefined): number => {
  if (!subgoals || subgoals.length === 0) return 0

  const totalSubgoals = subgoals.length
  const weightedSum = subgoals.reduce((sum, subgoal) => {
    return sum + STATUS_WEIGHTS[subgoal.status]
  }, 0)

  // Calculate percentage (weighted sum / total possible weight) * 100
  // Total possible weight is when all subgoals are completed (weight of 1 each)
  const progressPercentage = (weightedSum / totalSubgoals) * 100

  // Round to nearest whole number
  return Math.round(progressPercentage)
}
