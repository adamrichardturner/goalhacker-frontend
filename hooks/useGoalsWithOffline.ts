'use client'

import { useOfflineSync } from './useOfflineSync'
import { goalsService } from '@/services/goalsService'
import { Goal } from '@/types/goal'
import { useQueryClient } from '@tanstack/react-query'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function useGoalsWithOffline() {
  const { isOnline, queueOperation } = useOfflineSync()
  const queryClient = useQueryClient()

  const createGoal = async (goalData: Partial<Goal>): Promise<Goal> => {
    if (!isOnline) {
      await queueOperation({
        type: 'create',
        endpoint: `${API_URL}/api/goals`,
        data: goalData,
        timestamp: Date.now(),
      })
      const tempGoal = { ...goalData, goal_id: 'temp-' + Date.now() } as Goal

      // Update cache optimistically
      queryClient.setQueryData(['goals'], (old: Goal[] = []) => [
        ...old,
        tempGoal,
      ])

      return tempGoal
    }

    const goal = await goalsService.createGoal(goalData)
    queryClient.invalidateQueries({ queryKey: ['goals'] })
    return goal
  }

  const updateGoal = async (
    goalId: string,
    goalData: Partial<Goal>
  ): Promise<Goal> => {
    if (!isOnline) {
      await queueOperation({
        type: 'update',
        endpoint: `${API_URL}/api/goals/${goalId}`,
        data: goalData,
        timestamp: Date.now(),
      })

      // Update cache optimistically
      queryClient.setQueryData(['goals'], (old: Goal[] = []) =>
        old.map((g) => (g.goal_id === goalId ? { ...g, ...goalData } : g))
      )

      return { ...goalData, goal_id: goalId } as Goal
    }

    const goal = await goalsService.updateGoal(goalId, goalData)
    queryClient.invalidateQueries({ queryKey: ['goals'] })
    return goal
  }

  const deleteGoal = async (goalId: string): Promise<void> => {
    if (!isOnline) {
      await queueOperation({
        type: 'delete',
        endpoint: `${API_URL}/api/goals/${goalId}`,
        data: null,
        timestamp: Date.now(),
      })

      // Update cache optimistically
      queryClient.setQueryData(['goals'], (old: Goal[] = []) =>
        old.filter((g) => g.goal_id !== goalId)
      )

      return
    }

    await goalsService.deleteGoal(goalId)
    queryClient.invalidateQueries({ queryKey: ['goals'] })
  }

  const updateSubgoalStatus = async (
    subgoalId: string,
    status: string
  ): Promise<void> => {
    if (!isOnline) {
      await queueOperation({
        type: 'update',
        endpoint: `${API_URL}/api/goals/subgoals/${subgoalId}/status`,
        data: { status },
        timestamp: Date.now(),
      })
      return
    }

    await goalsService.updateSubgoalStatus(subgoalId, status)
    queryClient.invalidateQueries({ queryKey: ['goals'] })
  }

  const updateSubgoalsOrder = async (
    goalId: string,
    updates: { subgoal_id: string; order: number }[]
  ): Promise<void> => {
    if (!isOnline) {
      await queueOperation({
        type: 'update',
        endpoint: `${API_URL}/api/goals/${goalId}/subgoals/reorder`,
        data: { updates },
        timestamp: Date.now(),
      })
      return
    }

    await goalsService.updateSubgoalsOrder(goalId, updates)
    queryClient.invalidateQueries({ queryKey: ['goals'] })
  }

  return {
    createGoal,
    updateGoal,
    deleteGoal,
    updateSubgoalStatus,
    updateSubgoalsOrder,
    isOnline,
  }
}
