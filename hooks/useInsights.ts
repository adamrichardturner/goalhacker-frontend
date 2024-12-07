import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  insightsService,
  InsightResponse,
  Insight,
} from '@/services/insightsService'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import useAuth from './useAuth'

interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export function useInsights(forceGenerate = false) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { user, hasSessionCookie, isLoading: isAuthLoading } = useAuth()

  const {
    data: currentData,
    isLoading: isInsightsLoading,
    error,
  } = useQuery<InsightResponse, ApiError>({
    queryKey: ['insights', forceGenerate],
    queryFn: () => insightsService.getInsights(forceGenerate),
    retry: false,
    enabled: !isAuthLoading && !!user && hasSessionCookie,
  })

  const { data: historyData, isLoading: isHistoryLoading } = useQuery<{
    insights: Insight[]
  }>({
    queryKey: ['insights-history'],
    queryFn: () => insightsService.getInsightHistory(),
    retry: false,
    enabled: !isAuthLoading && !!user && hasSessionCookie,
  })

  const generateMutation = useMutation({
    mutationFn: () => insightsService.getInsights(true),
    onSuccess: (newData) => {
      queryClient.setQueryData(['insights'], newData)
      queryClient.invalidateQueries({ queryKey: ['insights-history'] })
    },
    onError: (error: ApiError) => {
      if (error.status === 401) {
        router.push('/login')
        return
      }
      if (error.status === 429) {
        toast.error('Rate limit reached. Please try again later.')
        return
      }
      toast.error(error.message || 'Failed to generate insights')
    },
  })

  if (error?.status === 401) {
    router.push('/login')
  }

  const generateNewInsights = () => {
    if (!user || !hasSessionCookie) {
      router.push('/login')
      return
    }
    generateMutation.mutate()
  }

  return {
    insight: currentData?.insight ?? null,
    remainingGenerations: currentData?.remainingGenerations ?? 0,
    insightHistory: historyData?.insights ?? [],
    isLoading: isAuthLoading || isInsightsLoading || isHistoryLoading,
    error,
    generateNewInsights,
    isGenerating: generateMutation.isPending,
  }
}
