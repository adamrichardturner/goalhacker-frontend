'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import GoalInsights from './GoalInsights'
import DashboardCharts from './DashboardCharts'
import Loading from '../ui/loading'
import { Goal } from '@/types/goal'

interface TabNavigationProps {
  goals: Goal[]
  goalsLoading: boolean
}

export function TabNavigation({ goals, goalsLoading }: TabNavigationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')

  const handleTabChange = (value: string) => {
    router.push(`/dashboard?tab=${value}`)
  }

  return (
    <Tabs
      defaultValue={tab || 'insights'}
      className='w-full'
      onValueChange={handleTabChange}
    >
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='insights'>AI Insights</TabsTrigger>
        <TabsTrigger value='analytics'>Analytics</TabsTrigger>
      </TabsList>
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
  )
}
