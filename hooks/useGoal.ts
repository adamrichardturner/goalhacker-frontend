'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { goalsService } from '@/services/goalsService'
import { Goal, SubgoalStatus } from '@/types/goal'
import { API_URL } from '@/config'

export function useGoal(id?: string) {
  const queryClient = useQueryClient()

  const {
    data: goals = [],
    isLoading: isGoalsLoading,
    isError: isGoalsError,
    error: goalsError,
    refetch: refetchGoals,
  } = useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: async () => {
      const goals = await goalsService.getGoals()
      return goals
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: false,
  })

  const {
    data: goal,
    isLoading,
    isError,
    error,
  } = useQuery<Goal | null>({
    queryKey: ['goal', id],
    queryFn: () => (id ? goalsService.getGoalById(id) : null),
    enabled: !!id,
  })

  const { mutate: createSubgoal } = useMutation({
    mutationFn: async ({
      title,
      target_date,
    }: {
      title: string
      target_date?: string
    }) => {
      if (!goal) throw new Error('Goal not found')

      const newSubgoal = {
        title,
        target_date,
        status: 'NOT_STARTED' as SubgoalStatus,
        subgoal_id: crypto.randomUUID(),
      }

      const updatedGoal = {
        ...goal,
        subgoals: [...(goal.subgoals || []), newSubgoal],
      }

      const response = await fetch(`${API_URL}/api/goals/${goal.goal_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedGoal),
      })

      if (!response.ok) {
        throw new Error('Failed to create subgoal')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

  const { mutate: updateSubgoal } = useMutation({
    mutationFn: async ({
      subgoalId,
      status,
      target_date,
    }: {
      subgoalId: string
      status?: SubgoalStatus
      target_date?: string
    }) => {
      if (!goal) throw new Error('Goal not found')

      const updatedGoal = {
        ...goal,
        subgoals: goal.subgoals?.map((subgoal) =>
          subgoal.subgoal_id === subgoalId
            ? {
                ...subgoal,
                ...(status && { status }),
                ...(target_date && { target_date }),
              }
            : subgoal
        ),
      }

      const response = await fetch(`${API_URL}/api/goals/${goal.goal_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedGoal),
      })

      if (!response.ok) {
        throw new Error('Failed to update goal')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

  const { mutate: deleteSubgoal } = useMutation({
    mutationFn: async (subgoalId: string) => {
      if (!goal) throw new Error('Goal not found')

      const updatedGoal = {
        ...goal,
        subgoals: goal.subgoals?.filter(
          (subgoal) => subgoal.subgoal_id !== subgoalId
        ),
      }

      const response = await fetch(`${API_URL}/api/goals/${goal.goal_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedGoal),
      })

      if (!response.ok) {
        throw new Error('Failed to update goal')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

  const { mutate: updateGoal } = useMutation({
    mutationFn: async (data: Partial<Goal>) => {
      const response = await fetch(`${API_URL}/api/goals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update goal')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

  const { mutate: deleteGoal } = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Goal ID is required')
      return goalsService.deleteGoal(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

  return {
    goals,
    isGoalsLoading,
    isGoalsError,
    goalsError,
    refetchGoals,
    goal,
    isLoading,
    isError,
    error,
    createSubgoal,
    updateSubgoal,
    deleteSubgoal,
    updateGoal,
    deleteGoal,
  }
}
