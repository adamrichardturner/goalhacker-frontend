import { api } from '@/services/api'
import { Goal } from '@/types/goal'

interface SearchResponse {
  data: Goal[]
  error?: string
}

export const searchService = {
  async searchGoals(query: string): Promise<SearchResponse> {
    try {
      const response = await api.get(`/api/search/goals`, {
        params: { query },
      })
      return { data: response.data }
    } catch (error) {
      console.error('Search error:', error)
      return { data: [], error: 'Failed to search goals' }
    }
  },
}
