import { Goal } from '@/types/goal'
import { Skeleton } from '../ui/skeleton'
import { AspectRatio } from '../ui/aspect-ratio'
import { getGoalStatus } from '@/utils/goalStatus'
import { getPriorityConfig } from '@/utils/goalPriority'
import { StatusBadge } from '../ui/status-badge'
import useGoalImageDisplay from '@/hooks/useGoalImageDisplay'
import { formatDate } from '@/utils/dateFormat'
import { useSettings } from '@/hooks/useSettings'

interface GoalImageProps {
  goal: Goal
  className?: string
}

export default function GoalImage({ goal, className = '' }: GoalImageProps) {
  const { imageUrl, isLoading } = useGoalImageDisplay(goal)
  const { settings } = useSettings()
  if (!goal) return null

  const statusConfig = getGoalStatus(goal.status)
  const priorityConfig = getPriorityConfig(goal.priority)

  return (
    <AspectRatio ratio={16 / 9} className={className}>
      {isLoading ? (
        <Skeleton className='h-full w-full rounded-2xl' />
      ) : (
        <div
          className='relative w-full h-[200px] rounded-t-2xl sm:rounded-2xl overflow-hidden group'
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60' />
          <div className='absolute inset-0 p-4 flex flex-col justify-between md:justify-between'>
            <h3 className='text-white font-semibold text-[1.25rem] leading-tight drop-shadow-lg line-clamp-3 mb-auto mt-auto text-left'>
              {goal.title}
            </h3>
            <div className='flex flex-wrap gap-2 justify-start'>
              <StatusBadge className='text-[10px] rounded-full'>
                {statusConfig.label}
              </StatusBadge>
              <StatusBadge className='text-[10px] rounded-full'>
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
      )}
    </AspectRatio>
  )
}
