'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GoalInsights from './GoalInsights'
import DashboardCharts from './DashboardCharts'
import { Goal } from '@/types/goal'

interface TabNavigationProps {
  goals: Goal[]
  goalsLoading: boolean
}

export function TabNavigation({ goals, goalsLoading }: TabNavigationProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('insights')

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('tab', value)
    const newUrl = `/dashboard?${searchParams.toString()}`
    router.push(newUrl)
  }

  return (
    <div className='space-y-6'>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className='flex gap-4 justify-start'>
          <TabsTrigger value='insights'>AI Insights</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === 'insights' && <GoalInsights />}
      {activeTab === 'analytics' && <DashboardCharts goals={goals} isLoading={goalsLoading} />}
    </div>
  )
}
