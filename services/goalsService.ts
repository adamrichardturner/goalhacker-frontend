import { api } from './api'
import { Goal } from '@/types/goal'

export const goalsService = {
  async getGoals(): Promise<Goal[]> {
    const response = await api.get('api/goals', {
      withCredentials: true,
    })
    return response.data
  },

  async getGoalById(goalId: string): Promise<Goal> {
    const response = await api.get(`api/goals/${goalId}`, {
      withCredentials: true,
    })
    return response.data
  },

  async createGoal(goalData: Partial<Goal>): Promise<Goal> {
    const response = await api.post('api/goals', goalData, {
      withCredentials: true,
    })
    return response.data
  },

  async updateGoal(goalId: string, goalData: Partial<Goal>): Promise<Goal> {
    const response = await api.patch(`api/goals/${goalId}`, goalData, {
      withCredentials: true,
    })
    return response.data
  },

  async deleteGoal(goalId: string): Promise<void> {
    await api.delete(`api/goals/${goalId}`, {
      withCredentials: true,
    })
  },

  async updateSubgoalStatus(subgoalId: string, status: string): Promise<void> {
    await api.put(
      `api/goals/subgoals/${subgoalId}/status`,
      { status },
      {
        withCredentials: true,
      }
    )
  },

  async updateSubgoalsOrder(
    goalId: string,
    updates: { subgoal_id: string; order: number }[]
  ): Promise<void> {
    await api.put(
      `api/goals/${goalId}/subgoals/reorder`,
      { updates },
      {
        withCredentials: true,
      }
    )
  },
}
