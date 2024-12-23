'use client'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import GoalInsights from './GoalInsights'
import DashboardCharts from './DashboardCharts'
import Loading from '../ui/loading'
import { Goal } from '@/types/goal'
import { AnimatedTabs } from '@/components/ui/animated-tabs'

interface TabNavigationProps {
  goals: Goal[]
  goalsLoading: boolean
}

export function TabNavigation({ goals, goalsLoading }: TabNavigationProps) {
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
        className='items-center h-3 w-[272px] flex py-[24px] justify-evenly rounded-lg gap-2 bg-white'
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
