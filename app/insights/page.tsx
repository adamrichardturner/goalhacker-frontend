'use client'

import DashboardCharts from '@/components/Dashboard/DashboardCharts'
import GoalInsights from '@/components/Dashboard/GoalInsights'
import { Footer } from '@/components/Footer'
import Header from '@/components/Header'
import Loading from '@/components/ui/loading'
import useAuth from '@/hooks/useAuth'
import { useGoal } from '@/hooks/useGoal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function InsightsPage() {
  const { user, isLoading: userIsLoading } = useAuth()
  const { goals, isLoading: goalsLoading } = useGoal()

  if (!user) {
    return null
  }

  return (
    <div className='container max-w-3xl flex flex-col gap-6 sm:px-4 w-full'>
      {userIsLoading ? (
        <Loading className='h-screen' />
      ) : (
        <Header user={user} loading={userIsLoading} />
      )}
      <div className='flex flex-col gap-6 w-full px-4 sm:px-0'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='flex flex-col gap-4'>
            <Tabs defaultValue='insights' className='w-full'>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
