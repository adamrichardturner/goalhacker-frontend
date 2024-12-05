import { Goal } from '@/types/goal'
import { Skeleton } from '../ui/skeleton'
import { AspectRatio } from '../ui/aspect-ratio'
import { getGoalStatus } from '@/utils/goalStatus'
import { getPriorityConfig } from '@/utils/goalPriority'
import { Badge } from '../ui/badge'
import useGoalImageDisplay from '@/hooks/useGoalImageDisplay'
import { formatDate } from '@/utils/dateFormat'
import { useSettings } from '@/hooks/useSettings'

interface GoalImageProps {
  goal: Goal
  className?: string
}

const badgeBaseStyles =
  'px-2 py-1 font-[500] text-white rounded-full text-[10px] backdrop-blur'
const targetBadgeStyles =
  'px-2 py-1 rounded-full font-[500] text-[10px] bg-muted/40 text-white leading-[18px]'

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
          className='relative w-full h-full rounded-2xl overflow-hidden group'
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: !imageUrl ? 'hsl(var(--muted))' : undefined,
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60' />
          <div className='absolute inset-0 p-4 flex flex-col justify-between md:justify-between'>
            <h3 className='text-white font-semibold text-[1.25rem] leading-tight drop-shadow-lg line-clamp-3 mb-auto mt-auto text-left'>
              {goal.title}
            </h3>
            <div className='flex flex-wrap gap-2 justify-start'>
              <Badge
                className={`${badgeBaseStyles} ${statusConfig.className} pointer-events-none`}
                style={{
                  backgroundColor: `${statusConfig.className}40`,
                  borderColor: `${statusConfig.className}33`,
                  boxShadow: `0 0 12px ${statusConfig.className}40`,
                }}
              >
                {statusConfig.label}
              </Badge>
              <Badge
                className={`${badgeBaseStyles} ${priorityConfig.className} pointer-events-none`}
                style={{
                  backgroundColor: `${priorityConfig.color}40`,
                  borderColor: `${priorityConfig.color}33`,
                  boxShadow: `0 0 12px ${priorityConfig.color}40`,
                }}
              >
                {priorityConfig.label}
              </Badge>
              {goal.target_date && (
                <Badge className={`${targetBadgeStyles} pointer-events-none`}>
                  🎯 {formatDate(goal.target_date, settings?.date_format)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </AspectRatio>
  )
}
