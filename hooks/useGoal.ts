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
      const response = await goalsService.getGoals()
      return response
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
    queryFn: async () => {
      if (!id) return null
      const response = await goalsService.getGoalById(id)
      return response
    },
    enabled: !!id,
  })

  const { mutate: createSubgoal } = useMutation({
    mutationFn: async ({
      title,
      target_date,
      status = 'planned',
    }: {
      title: string
      target_date?: string
      status?: SubgoalStatus
    }) => {
      if (!goal) throw new Error('Goal not found')

      const newSubgoal = {
        title,
        target_date,
        status,
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
      title,
    }: {
      subgoalId: string
      status?: SubgoalStatus
      target_date?: string
      title?: string
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
                ...(title && { title }),
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

  const { mutate: addProgressNote } = useMutation({
    mutationFn: async ({
      title,
      content,
    }: {
      title: string
      content: string
    }) => {
      if (!id) throw new Error('Goal ID is required')
      const response = await fetch(`${API_URL}/api/goals/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          goal_id: id,
          title: title,
          content: content,
        }),
      })
      if (!response.ok) throw new Error('Failed to add progress note')
      return response.json()
    },
    onMutate: async (newNote) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['goal', id] })

      // Snapshot the previous value
      const previousGoal = queryClient.getQueryData<Goal>(['goal', id])

      // Optimistically update the goal with new progress note
      if (previousGoal) {
        queryClient.setQueryData<Goal>(['goal', id], {
          ...previousGoal,
          progress_notes: [
            {
              note_id: crypto.randomUUID(),
              goal_id: id!,
              title: newNote.title,
              content: newNote.content,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            ...(previousGoal.progress_notes || []),
          ],
        })
      }

      return { previousGoal }
    },
    onError: (err, newNote, context) => {
      // Rollback on error
      if (context?.previousGoal) {
        queryClient.setQueryData(['goal', id], context.previousGoal)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

  const { mutate: updateProgressNote } = useMutation({
    mutationFn: async ({
      noteId,
      title,
      content,
    }: {
      noteId: string
      title: string
      content: string
    }) => {
      if (!id) throw new Error('Goal ID is required')
      const response = await fetch(
        `${API_URL}/api/goals/${id}/notes/${noteId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            note_id: noteId,
            title: title,
            content: content,
          }),
        }
      )
      if (!response.ok) throw new Error('Failed to update progress note')
      return response.json()
    },
    onMutate: async (updatedNote) => {
      await queryClient.cancelQueries({ queryKey: ['goal', id] })
      const previousGoal = queryClient.getQueryData<Goal>(['goal', id])

      if (previousGoal) {
        queryClient.setQueryData<Goal>(['goal', id], {
          ...previousGoal,
          progress_notes: previousGoal.progress_notes?.map((note) =>
            note.note_id === updatedNote.noteId
              ? {
                  ...note,
                  title: updatedNote.title,
                  content: updatedNote.content,
                  updated_at: new Date().toISOString(),
                }
              : note
          ),
        })
      }

      return { previousGoal }
    },
    onError: (err, updatedNote, context) => {
      if (context?.previousGoal) {
        queryClient.setQueryData(['goal', id], context.previousGoal)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

  const { mutate: deleteProgressNote } = useMutation({
    mutationFn: async (noteId: string) => {
      if (!id) throw new Error('Goal ID is required')
      const response = await fetch(
        `${API_URL}/api/goals/${id}/notes/${noteId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )
      if (!response.ok) throw new Error('Failed to delete progress note')
      return response.json()
    },
    onMutate: async (noteId) => {
      await queryClient.cancelQueries({ queryKey: ['goal', id] })
      const previousGoal = queryClient.getQueryData<Goal>(['goal', id])

      if (previousGoal) {
        queryClient.setQueryData<Goal>(['goal', id], {
          ...previousGoal,
          progress_notes: previousGoal.progress_notes?.filter(
            (note) => note.note_id !== noteId
          ),
        })
      }

      return { previousGoal }
    },
    onError: (err, noteId, context) => {
      if (context?.previousGoal) {
        queryClient.setQueryData(['goal', id], context.previousGoal)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

  return {
    goals,
    goal,
    isLoading,
    isError,
    error,
    isGoalsLoading,
    isGoalsError,
    goalsError,
    refetchGoals,
    createSubgoal,
    updateSubgoal,
    deleteSubgoal,
    updateGoal,
    deleteGoal,
    addProgressNote,
    updateProgressNote,
    deleteProgressNote,
  }
}
