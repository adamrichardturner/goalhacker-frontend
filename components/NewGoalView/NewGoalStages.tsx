'use client'

import { Goal } from '@/types/goal'
import {
  BasicInfo,
  Timeline,
  Measure,
  Steps,
  Review,
  LoadingSkeletons,
} from './stages'

export const stages = [
  'BasicInfo',
  'Timeline',
  'Measure',
  'Steps',
  'Review',
] as const
export type Stage = (typeof stages)[number]

export interface StageProps {
  onNext: () => void
  onBack?: () => void
  updateGoalData: (data: Partial<Goal>) => void
  goalData: Partial<Goal>
  onSubmit?: () => Promise<void>
  isSubmitting?: boolean
  isLoading?: boolean
}

export const NewGoalStages = {
  BasicInfo,
  Timeline,
  Measure,
  Steps,
  Review,
  LoadingSkeletons,
}
