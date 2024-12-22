import { Subgoal } from '@/types/goal'

const STATUS_WEIGHTS = {
  planned: 0,
  in_progress: 0.5,
  completed: 1,
} as const

interface ProgressStats {
  progressPercentage: number
  completedCount: number
  inProgressCount: number
}

export const calculateProgress = (subgoals: Subgoal[] | undefined): ProgressStats => {
  if (!subgoals || subgoals.length === 0) {
    return {
      progressPercentage: 0,
      completedCount: 0,
      inProgressCount: 0,
    }
  }

  const totalSubgoals = subgoals.length
  let completedCount = 0
  let inProgressCount = 0

  const weightedSum = subgoals.reduce((sum, subgoal) => {
    if (subgoal.status === 'completed') completedCount++
    if (subgoal.status === 'in_progress') inProgressCount++
    return sum + STATUS_WEIGHTS[subgoal.status]
  }, 0)

  // Calculate percentage (weighted sum / total possible weight) * 100
  // Total possible weight is when all subgoals are completed (weight of 1 each)
  const progressPercentage = Math.round((weightedSum / totalSubgoals) * 100)

  return {
    progressPercentage,
    completedCount,
    inProgressCount,
  }
}
