'use client'

import { useState } from 'react'
import { Goal } from '@/types/goal'
import { NewGoalStages } from './NewGoalStages'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { goalsService } from '@/services/goalsService'
import { Loading } from '../ui/loading'
import SmartDialog from '../SmartDialog'
import GoalCreationTimeline from './GoalCreationTimeline'
import { useUser } from '@/hooks/auth/useUser'
import { useQueryClient } from '@tanstack/react-query'

export const stages = [
  'BasicInfo',
  'Timeline',
  'Measure',
  'Steps',
  'Review',
] as const
export type Stage = (typeof stages)[number]

export default function NewGoalView() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, isLoading: userLoading } = useUser()
  const [currentStage, setCurrentStage] = useState<Stage>('BasicInfo')
  const [goalData, setGoalData] = useState<Partial<Goal>>({
    status: 'planned',
    progress: 0,
    priority: 'medium',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateGoalData = (data: Partial<Goal>) => {
    setGoalData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    const currentIndex = stages.indexOf(currentStage)
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const currentIndex = stages.indexOf(currentStage)
    if (currentIndex > 0) {
      setCurrentStage(stages[currentIndex - 1])
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to create a goal')
      return
    }

    try {
      setIsSubmitting(true)
      const subgoals = goalData.subgoals?.filter((subgoal) => subgoal.title)
      await goalsService.createGoal({
        ...goalData,
        subgoals: subgoals?.length ? subgoals : undefined,
        user_id: user.user_id,
      })
      await queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Goal created successfully!')
      router.push('/goals')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create goal'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNavigateToStep = (stepIndex: number) => {
    setCurrentStage(stages[stepIndex - 1])
  }

  if (userLoading) {
    return <Loading className='h-screen' />
  }

  const renderStage = () => {
    const props = {
      onNext: handleNext,
      onBack: handleBack,
      updateGoalData,
      goalData,
      onSubmit: handleSubmit,
      isSubmitting,
    }

    switch (currentStage) {
      case 'BasicInfo':
        return <NewGoalStages.BasicInfo {...props} />
      case 'Timeline':
        return <NewGoalStages.Timeline {...props} />
      case 'Measure':
        return <NewGoalStages.Measure {...props} />
      case 'Steps':
        return <NewGoalStages.Steps {...props} />
      case 'Review':
        return (
          <NewGoalStages.Review
            {...props}
            onNavigateToStep={handleNavigateToStep}
          />
        )
    }
  }

  const goalCreationStage = renderStage()

  return (
    <div className='w-full mx-auto bg-card px-4 sm:p-12 py-8 rounded-2xl'>
      <div className='w-full'>
        <div className='flex flex-col sm:flex-row items-start justify-between border-b border-border'>
          <div>
            <h1 className='text-xl font-semibold'>Create a new goal</h1>
            <div className='flex flex-col gap-0 text-xs'>
              <p className='text-muted-foreground'>
                Plan your goal for success with the SMART framework.
              </p>
              <div className='flex pb-6'>
                <SmartDialog />
              </div>
            </div>
          </div>
          <div className='w-full sm:w-auto'>
            <GoalCreationTimeline
              stages={stages}
              currentStage={currentStage}
              onNavigateToStep={handleNavigateToStep}
              goalData={goalData}
            />
          </div>
        </div>
      </div>
      {goalCreationStage}
    </div>
  )
}
