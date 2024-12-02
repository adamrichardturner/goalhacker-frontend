import { useQuery } from '@tanstack/react-query'
import { goalsService } from '@/services/goalsService'
import { Goal } from '@/types/goal'

export const useGoals = () => {
  const {
    data: goals,
    isLoading,
    isError,
    error,
    refetch: refetchGoals,
  } = useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: async () => {
      const goals = await goalsService.getGoals()
      return goals
    },
    staleTime: 1000 * 60, // Cache for 1 minute
    refetchOnWindowFocus: true,
  })

  return {
    goals,
    isLoading,
    isError,
    error,
    refetchGoals,
  }
}

export default useGoals
