import { Goal } from '@/types/goal'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const goalsService = {
  async createGoal(goalData: Partial<Goal>): Promise<Goal> {
    const response = await fetch(`${API_URL}/api/goals`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create goal')
    }

    return response.json()
  },

  async getGoals(): Promise<Goal[]> {
    const response = await fetch(`${API_URL}/api/goals`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch goals')
    }

    return response.json()
  },
}
