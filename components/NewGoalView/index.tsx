'use client'

import { useState } from 'react'
import { Goal } from '@/types/goal'
import { NewGoalStages } from './NewGoalStages'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { goalsService } from '@/services/goalsService'
import useAuth from '@/hooks/useAuth'
import { Loading } from '../ui/loading'

const stages = ['BasicInfo', 'Timeline', 'Measure', 'Steps', 'Review'] as const
type Stage = (typeof stages)[number]

export default function NewGoalView() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useAuth()
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
        return <NewGoalStages.Review {...props} />
    }
  }

  return (
    <div className='w-full mx-auto'>
      <div className='w-full'>
        <div className='flex items-center justify-between border-b border-border pb-4'>
          <div>
            <h1 className='text-xl font-semibold'>Create a new goal</h1>
            <div className='flex flex-col gap-0 text-xs'>
              <p className='text-muted-foreground'>
                Plan your goal for success with the SMART framework.
              </p>
              <p className='text-muted-foreground'>
                Click here for more information
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-full items-end justify-end pt-2 pb-4'>
        {stages.map((stage, index) => (
          <div
            key={stage}
            className={`flex items-center ${
              index < stages.indexOf(currentStage)
                ? 'text-electricPurple'
                : index === stages.indexOf(currentStage)
                  ? 'text-foreground'
                  : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-4 h-4 text-xs p-2 rounded-full flex items-center justify-center border ${
                index <= stages.indexOf(currentStage)
                  ? 'border-electricPurple'
                  : 'border-muted'
              }`}
            >
              {index + 1}
            </div>
            {index < stages.length - 1 && (
              <div
                className={`w-full h-[1px] px-2 ${
                  index < stages.indexOf(currentStage)
                    ? 'bg-electricPurple'
                    : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      {renderStage()}
    </div>
  )
}
