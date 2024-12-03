import { Goal } from '@/types/goal'
import { Skeleton } from '../ui/skeleton'
import useGoalImageDisplay from '@/hooks/useGoalImageDisplay'
import { AspectRatio } from '../ui/aspect-ratio'
import { getGoalStatus } from '@/utils/goalStatus'
import { getPriorityConfig } from '@/utils/goalPriority'
import { Badge } from '../ui/badge'

interface GoalImageProps {
  goal: Goal
  className?: string
}

const badgeBaseStyles =
  'px-2 py-1 font-[500] rounded-full text-[10px] backdrop-blur'
const targetBadgeStyles =
  'px-2 py-1 rounded-full font-[500] text-[10px] bg-muted/40 text-white leading-[18px]'

export default function GoalImage({ goal, className = '' }: GoalImageProps) {
  const { imageUrl, isLoading } = useGoalImageDisplay(goal)

  if (!goal) return null

  const statusConfig = getGoalStatus(goal.status)
  const priorityConfig = getPriorityConfig(goal.priority)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <AspectRatio ratio={16 / 9} className={className}>
      {isLoading ? (
        <Skeleton className='h-full w-full rounded-2xl' />
      ) : (
        <div
          className='relative w-full h-full rounded-2xl overflow-hidden group'
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
                  🎯 {formatDate(goal.target_date)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </AspectRatio>
  )
}
