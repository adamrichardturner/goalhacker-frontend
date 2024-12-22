'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import GoalInsights from './GoalInsights'
import DashboardCharts from './DashboardCharts'
import { Goal } from '@/types/goal'
import { motion } from 'framer-motion'

interface TabNavigationProps {
  goals: Goal[]
  goalsLoading: boolean
}

export function TabNavigation({ goals, goalsLoading }: TabNavigationProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('insights')

  const hasGoalsWithProgress = goals.some(
    (goal) => goal.progress > 0 || goal.status === 'completed'
  )
  const availableTabs = [
    { id: 'insights', label: 'AI Insights', show: goals.length > 0 },
    { id: 'analytics', label: 'Analytics', show: hasGoalsWithProgress },
  ].filter((tab) => tab.show)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const tab = searchParams.get('tab')
    if (tab && availableTabs.some((t) => t.id === tab)) {
      setActiveTab(tab)
    } else if (availableTabs.length > 0) {
      // If current tab is not available, default to first available tab
      setActiveTab(availableTabs[0].id)
      const newSearchParams = new URLSearchParams(window.location.search)
      newSearchParams.set('tab', availableTabs[0].id)
      router.push(`/dashboard?${newSearchParams.toString()}`)
    }
  }, [availableTabs, router])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('tab', value)
    const newUrl = `/dashboard?${searchParams.toString()}`
    router.push(newUrl)
  }

  if (availableTabs.length === 0) {
    return null
  }

  return (
    <div className='space-y-6'>
      <nav className='flex gap-8'>
        {availableTabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <motion.div key={tab.id} className='relative'>
              <button
                onClick={() => handleTabChange(tab.id)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </button>
              {isActive && (
                <motion.div
                  className='absolute h-[1.5px] w-full bg-electricPurple'
                  layoutId='activeTabUnderline'
                />
              )}
            </motion.div>
          )
        })}
      </nav>

      {activeTab === 'insights' && goals.length > 0 && <GoalInsights />}
      {activeTab === 'analytics' && hasGoalsWithProgress && (
        <DashboardCharts goals={goals} isLoading={goalsLoading} />
      )}
    </div>
  )
}
