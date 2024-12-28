'use client'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import GoalInsights from './GoalInsights'
import DashboardCharts from './DashboardCharts'
import Loading from '../ui/loading'
import { Goal } from '@/types/goal'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { Insights } from '@/types/insights'

export interface TabNavigationProps {
  goals: Goal[]
  goalsLoading: boolean
  insights: Insights | null
  insightsLoading: boolean
}

export function TabNavigation({
  goals,
  goalsLoading,
  insights,
  insightsLoading,
}: TabNavigationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'insights'

  const handleTabChange = (value: string) => {
    router.push(`/dashboard?tab=${value}`)
  }

  const tabs = [
    { id: 'insights', label: 'AI Insights' },
    { id: 'analytics', label: 'Analytics' },
  ]

  return (
    <div className='w-full'>
      <AnimatedTabs
        items={tabs}
        selected={tab}
        onChange={handleTabChange}
        variant='underline'
        className='items-center h-3 w-full sm:w-[220px] flex py-[24px] justify-start sm:justify-center px-4 sm:px-4 sm:rounded-2xl gap-2 bg-white'
      />
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsContent value='insights' className='mt-4'>
          <GoalInsights />
        </TabsContent>
        <TabsContent value='analytics' className='mt-4'>
          {goalsLoading ? (
            <Loading className='h-[400px]' />
          ) : (
            <div>
              <DashboardCharts goals={goals} isLoading={goalsLoading} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
