import { Goal } from '@/types/goal'
import { getPriorityConfig } from '@/utils/goalPriority'
import { StatusBadge } from '../../ui/status-badge'
import { formatDate } from '@/utils/dateFormat'
import { EditGoalImage } from './EditGoalImage'
import { getGoalStatus } from '@/utils/goalStatus'
import { useSettings } from '@/hooks/useSettings'
import useGoalImageDisplay from '@/hooks/useGoalImageDisplay'

interface GoalBannerProps {
  goal: Goal
}

export default function GoalBanner({ goal }: GoalBannerProps) {
  const statusConfig = getGoalStatus(goal.status)
  const priorityConfig = getPriorityConfig(goal.priority)
  const { settings } = useSettings()
  const { imageUrl } = useGoalImageDisplay(goal)

  return (
    <>
      <div
        className='h-[270px] relative sm:rounded-lg overflow-hidden shadow-sm -mx-4 sm:mx-auto'
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute top-6 right-6 flex items-start gap-2'>
          <EditGoalImage goal={goal} />
        </div>
        <div className='absolute bottom-6 space-y-4 left-6 right-6 text-white'>
          <h1 className='text-3xl font-bold mt-2 line-clamp-2'>{goal.title}</h1>
          <div className='flex items-center gap-2'>
            <StatusBadge
              variant={
                goal.status === 'completed' ? 'success' : 'primaryActive'
              }
              className='text-[10px] rounded-full'
            >
              {statusConfig.label}
            </StatusBadge>
            <StatusBadge variant='primary' className='text-[10px] rounded-full'>
              {priorityConfig.label}
            </StatusBadge>
            {goal.target_date && (
              <StatusBadge className='text-[10px] rounded-full'>
                🎯 {formatDate(goal.target_date, settings?.date_format)}
              </StatusBadge>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
