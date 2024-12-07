import { api } from './api'

export interface GoalStats {
  total: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
  byCategory: Record<string, number>
  completionRates: Array<{
    goal_id: string
    title: string
    completion: number
  }>
}

export interface Insight {
  insight_id: string
  summary: string
  trends: string[]
  recommendations: string[]
  topPerforming?: string[]
  needsWork?: string[]
  goal_stats: GoalStats
  created_at: string
}

export interface InsightResponse {
  insight: Insight
  remainingGenerations: number
}

export const insightsService = {
  async getInsights(forceGenerate = false): Promise<InsightResponse> {
    try {
      const { data } = await api.get<InsightResponse>(
        `api/insights${forceGenerate ? '?generate=true' : ''}`
      )
      return data
    } catch (error) {
      console.error('Insights service error:', error)
      throw error
    }
  },

  async getInsightHistory(): Promise<{
    insights: Insight[]
    remainingGenerations: number
  }> {
    try {
      const { data } = await api.get('api/insights/history')
      return data
    } catch (error) {
      console.error('Insights history error:', error)
      throw error
    }
  },

  async getRemainingGenerations(): Promise<{ remainingGenerations: number }> {
    try {
      const { data } = await api.get('api/insights/remaining')
      return data
    } catch (error) {
      console.error('Remaining generations error:', error)
      throw error
    }
  },
}
