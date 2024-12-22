'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TabNavigation() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const newUrl = value === 'all' ? '/goals' : `/goals?tab=${value}`
    router.push(newUrl)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value='all'>All Goals</TabsTrigger>
        <TabsTrigger value='active'>Active</TabsTrigger>
        <TabsTrigger value='completed'>Completed</TabsTrigger>
        <TabsTrigger value='archived'>Archived</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
