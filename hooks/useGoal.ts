'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { goalsService } from '@/services/goalsService'
import { Goal, Subgoal, SubgoalStatus, ProgressNote } from '@/types/goal'
import { toast } from 'sonner'
import { useUser } from './auth/useUser'
import { useGoalsWithOffline } from './useGoalsWithOffline'

export function useGoal(id?: string) {
  const { user, isLoading: userLoading, hasSessionCookie } = useUser()
  const queryClient = useQueryClient()
  const {
    createGoal: createGoalOffline,
    updateSubgoalStatus: updateSubgoalStatusOffline,
    updateSubgoalsOrder: updateSubgoalsOrderOffline,
    isOnline,
  } = useGoalsWithOffline()

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
    enabled: hasSessionCookie,
  })

  const {
    data: goal,
    isLoading: isIndividualGoalLoading,
    isError,
    error,
  } = useQuery<Goal | null>({
    queryKey: ['goal', id],
    queryFn: async () => {
      if (!id) return null
      const response = await goalsService.getGoalById(id)
      return response
    },
    enabled: !!id && hasSessionCookie,
  })

  const { data: progressNotes = [], isLoading: isProgressNotesLoading } =
    useQuery({
      queryKey: ['goal', id, 'progress-notes'],
      queryFn: async () => {
        if (!id) return []
        return goalsService.getProgressNotes(id)
      },
      enabled: !!id && hasSessionCookie,
    })

  const isLoading =
    userLoading ||
    isGoalsLoading ||
    isIndividualGoalLoading ||
    isProgressNotesLoading

  const { mutate: createSubgoal, isPending: isCreatingSubgoal } = useMutation<
    { subgoal: Subgoal },
    Error,
    {
      title: string
      target_date?: string | null
      status?: SubgoalStatus
    },
    {
      previousGoal: Goal | undefined
      previousGoals: Goal[] | undefined
    }
  >({
    mutationFn: async ({ title, target_date, status = 'planned' }) => {
      if (!goal?.goal_id) {
        throw new Error('Goal not found')
      }

      const data = {
        title,
        target_date: target_date || undefined,
        status,
      }

      if (!isOnline) {
        await createGoalOffline(data)
        return { subgoal: { ...data, subgoal_id: 'temp-' + Date.now() } }
      }

      const response = await fetch(`/api/goals/${goal.goal_id}/subgoals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create subgoal')
      }

      return response.json()
    },
    onMutate: async (newSubgoal) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['goal', id] })
      await queryClient.cancelQueries({ queryKey: ['goals'] })

      // Snapshot the previous values
      const previousGoal = queryClient.getQueryData<Goal>(['goal', id])
      const previousGoals = queryClient.getQueryData<Goal[]>(['goals'])

      // Create an optimistic subgoal
      const optimisticId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const optimisticSubgoal: Subgoal = {
        subgoal_id: optimisticId,
        goal_id: id!,
        title: newSubgoal.title,
        target_date: newSubgoal.target_date || undefined,
        status: newSubgoal.status || 'planned',
        order: previousGoal?.subgoals?.length || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Optimistically update the individual goal
      if (previousGoal) {
        queryClient.setQueryData<Goal>(['goal', id], {
          ...previousGoal,
          subgoals: [...(previousGoal.subgoals || []), optimisticSubgoal],
        })
      }

      // Optimistically update the goals list
      if (previousGoals) {
        queryClient.setQueryData<Goal[]>(
          ['goals'],
          previousGoals.map((g) =>
            g.goal_id === id
              ? {
                  ...g,
                  subgoals: [...(g.subgoals || []), optimisticSubgoal],
                }
              : g
          )
        )
      }

      return { previousGoal, previousGoals }
    },
    onError: (err, newSubgoal, context) => {
      // Rollback to the previous values if there's an error
      if (context?.previousGoal) {
        queryClient.setQueryData(['goal', id], context.previousGoal)
      }
      if (context?.previousGoals) {
        queryClient.setQueryData(['goals'], context.previousGoals)
      }
      toast.error('Failed to create subgoal')
    },
    onSuccess: (data) => {
      // Get the current cache
      const currentGoal = queryClient.getQueryData<Goal>(['goal', id])
      const currentGoals = queryClient.getQueryData<Goal[]>(['goals'])

      // Update the individual goal with the real subgoal ID
      if (currentGoal) {
        queryClient.setQueryData<Goal>(['goal', id], {
          ...currentGoal,
          subgoals: currentGoal.subgoals?.map((s) =>
            s?.subgoal_id?.startsWith('temp-') && s.title === data.subgoal.title
              ? { ...s, subgoal_id: data.subgoal.subgoal_id }
              : s
          ),
        })
      }

      // Update the goals list with the real subgoal ID
      if (currentGoals) {
        queryClient.setQueryData<Goal[]>(
          ['goals'],
          currentGoals.map((g) =>
            g.goal_id === id
              ? {
                  ...g,
                  subgoals: g.subgoals?.map((s) =>
                    s?.subgoal_id?.startsWith('temp-') &&
                    s.title === data.subgoal.title
                      ? { ...s, subgoal_id: data.subgoal.subgoal_id }
                      : s
                  ),
                }
              : g
          )
        )
      }

      toast.success('Subgoal created successfully')
    },
  })

  const { mutate: updateSubgoalStatus } = useMutation({
    mutationFn: async ({
      subgoalId,
      status,
    }: {
      subgoalId: string
      status: SubgoalStatus
    }) => {
      if (!goal?.goal_id) throw new Error('Goal not found')

      if (!isOnline) {
        await updateSubgoalStatusOffline(subgoalId, status)
        return { status }
      }

      const response = await fetch(
        `/api/goals/${goal.goal_id}/subgoals/${subgoalId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ status }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update subgoal status')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Status updated successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update status')
    },
  })

  const { mutate: updateSubgoalTitle } = useMutation({
    mutationFn: async ({
      subgoalId,
      title,
    }: {
      subgoalId: string
      title: string
    }) => {
      if (!goal?.goal_id) throw new Error('Goal not found')

      const response = await fetch(
        `/api/goals/${goal.goal_id}/subgoals/${subgoalId}/title`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ title }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update subgoal title')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Title updated successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update title')
    },
  })

  const { mutate: updateSubgoalTargetDate } = useMutation({
    mutationFn: async ({
      subgoalId,
      target_date,
    }: {
      subgoalId: string
      target_date: string | undefined
    }) => {
      if (!goal?.goal_id) throw new Error('Goal not found')

      const response = await fetch(
        `/api/goals/${goal.goal_id}/subgoals/${subgoalId}/target-date`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ target_date: target_date || undefined }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update target date')
      }

      return response.json()
    },
    onMutate: async ({ subgoalId, target_date }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['goal', id] })

      // Snapshot the previous value
      const previousGoal = queryClient.getQueryData(['goal', id])

      // Optimistically update to the new value
      queryClient.setQueryData(['goal', id], (old: Goal) => {
        if (!old) return old
        return {
          ...old,
          subgoals: old.subgoals?.map((subgoal: Subgoal) =>
            subgoal.subgoal_id === subgoalId
              ? { ...subgoal, target_date }
              : subgoal
          ),
        }
      })

      // Return a context object with the snapshotted value
      return { previousGoal }
    },
    onError: (err, newTodo, context) => {
      // Rollback to the previous value if there's an error
      if (context?.previousGoal) {
        queryClient.setQueryData(['goal', id], context.previousGoal)
      }
      toast.error('Failed to update target date')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Target date updated successfully')
    },
  })

  const { mutate: deleteSubgoal } = useMutation({
    mutationFn: async (subgoalId: string) => {
      if (!goal?.goal_id) throw new Error('Goal not found')

      const response = await fetch(
        `/api/goals/${goal.goal_id}/subgoals/${subgoalId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete subgoal')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Subgoal deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete subgoal')
    },
  })

  const { mutate: updateGoal } = useMutation({
    mutationFn: async (goalData: Partial<Goal>) => {
      if (!id) throw new Error('Goal ID is required')
      return goalsService.updateGoal(id, goalData)
    },
    onSuccess: () => {
      // Invalidate both the individual goal and the goals list
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
    onError: (error) => {
      toast.error('Failed to update goal')
      console.error('Error updating goal:', error)
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
      return goalsService.addProgressNote(id, { title, content })
    },
    onMutate: async (newNote) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['goal', id] })
      await queryClient.cancelQueries({
        queryKey: ['goal', id, 'progress-notes'],
      })

      // Snapshot the previous values
      const previousGoal = queryClient.getQueryData<Goal>(['goal', id])
      const previousNotes = queryClient.getQueryData<ProgressNote[]>([
        'goal',
        id,
        'progress-notes',
      ])

      // Create an optimistic note
      const optimisticNote = {
        note_id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        goal_id: id!,
        title: newNote.title,
        content: newNote.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Optimistically update both caches
      if (previousGoal) {
        queryClient.setQueryData<Goal>(['goal', id], {
          ...previousGoal,
          progress_notes: [
            optimisticNote,
            ...(previousGoal.progress_notes || []),
          ],
        })
      }

      queryClient.setQueryData<ProgressNote[]>(
        ['goal', id, 'progress-notes'],
        [optimisticNote, ...(previousNotes || [])]
      )

      return { previousGoal, previousNotes }
    },
    onError: (err, newNote, context) => {
      // Rollback on error
      if (context?.previousGoal) {
        queryClient.setQueryData(['goal', id], context.previousGoal)
      }
      if (context?.previousNotes) {
        queryClient.setQueryData(
          ['goal', id, 'progress-notes'],
          context.previousNotes
        )
      }
      toast.error(
        err instanceof Error ? err.message : 'Failed to create progress note'
      )
    },
    onSuccess: (newNote) => {
      // Get the current caches
      const currentGoal = queryClient.getQueryData<Goal>(['goal', id])
      const currentNotes = queryClient.getQueryData<ProgressNote[]>([
        'goal',
        id,
        'progress-notes',
      ])

      // Update both caches with the real note
      if (currentGoal) {
        queryClient.setQueryData<Goal>(['goal', id], {
          ...currentGoal,
          progress_notes: currentGoal.progress_notes?.map((note) =>
            note?.note_id?.startsWith('temp-') && note.title === newNote.title
              ? { ...note, note_id: newNote.note_id }
              : note
          ),
        })
      }

      if (currentNotes) {
        queryClient.setQueryData<ProgressNote[]>(
          ['goal', id, 'progress-notes'],
          currentNotes.map((note) =>
            note?.note_id?.startsWith('temp-') && note.title === newNote.title
              ? { ...note, note_id: newNote.note_id }
              : note
          )
        )
      }

      toast.success('Progress note created successfully')
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
      return goalsService.updateProgressNote(id, noteId, { title, content })
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
      toast.error(
        err instanceof Error ? err.message : 'Failed to update progress note'
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

  const { mutate: deleteProgressNote } = useMutation({
    mutationFn: async (noteId: string) => {
      if (!id) throw new Error('Goal ID is required')
      return goalsService.deleteProgressNote(id, noteId)
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
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete progress note'
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })

  let reorderTimeout: NodeJS.Timeout | null = null

  const { mutate: updateSubgoalsOrder } = useMutation({
    mutationFn: async (updates: { subgoal_id: string; order: number }[]) => {
      if (!id) throw new Error('Goal ID is required')
      return goalsService.updateSubgoalsOrder(id, updates)
    },
    onMutate: async (updates) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['goal', id] })

      // Snapshot the previous value
      const previousGoal = queryClient.getQueryData<Goal>(['goal', id])

      if (previousGoal?.subgoals) {
        // Create a new array with updated orders
        const updatedSubgoals = [...previousGoal.subgoals]
        updates.forEach(({ subgoal_id, order }) => {
          const subgoal = updatedSubgoals.find(
            (s) => s.subgoal_id === subgoal_id
          )
          if (subgoal) {
            subgoal.order = order
          }
        })

        // Sort by new order
        updatedSubgoals.sort((a, b) => (a.order || 0) - (b.order || 0))

        // Update the cache with new order
        queryClient.setQueryData<Goal>(['goal', id], {
          ...previousGoal,
          subgoals: updatedSubgoals,
        })
      }

      return { previousGoal }
    },
    onError: (err, updates, context) => {
      if (context?.previousGoal) {
        // Revert to the previous state on error
        queryClient.setQueryData(['goal', id], context.previousGoal)
      }
      toast.error('Failed to reorder subgoals')
    },
    onSuccess: () => {
      // Remove success toast
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['goal', id] })
    },
  })

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: Partial<Goal>) => {
      if (!user?.user_id) {
        throw new Error('User not authenticated')
      }

      const response = await goalsService.createGoal({
        ...goalData,
        user_id: user.user_id,
        status: 'planned',
        progress: 0,
        category_id: goalData.category_id || undefined,
      })
      return response
    },
    onSuccess: (newGoal) => {
      // Invalidate and refetch goals list
      queryClient.invalidateQueries({ queryKey: ['goals'] })

      // Add the new goal to the cache
      queryClient.setQueryData<Goal[]>(['goals'], (old = []) => [
        ...old,
        newGoal,
      ])

      toast.success('Goal created successfully')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create goal'
      )
    },
  })

  return {
    goals,
    goal,
    isLoading,
    isError,
    error,
    createSubgoal,
    isCreatingSubgoal,
    updateSubgoalStatus,
    updateSubgoalTitle,
    updateSubgoalTargetDate,
    deleteSubgoal,
    refetchGoals,
    isOnline,
    updateSubgoalsOrder,
    updateGoal,
    deleteGoal,
    updateProgressNote,
    addProgressNote,
    deleteProgressNote,
    progressNotes,
  }
}
