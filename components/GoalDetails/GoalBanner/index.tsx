import { Goal } from '@/types/goal'
import { getPriorityConfig } from '@/utils/goalPriority'
import { Badge } from '../../ui/badge'
import { formatDate } from '@/utils/dateFormat'
import { EditGoalImage } from './EditGoalImage'
import { getGoalStatus } from '@/utils/goalStatus'
import { useSettings } from '@/hooks/useSettings'

interface GoalBannerProps {
  goal: Goal
}

const badgeBaseStyles =
  'px-2 py-1 font-[500] rounded-full text-[10px] backdrop-blur'
const targetBadgeStyles =
  'px-2 py-1 rounded-full pointer-events-none font-[500] text-[10px] bg-muted/40 text-white leading-[18px]'

export default function GoalBanner({ goal }: GoalBannerProps) {
  const statusConfig = getGoalStatus(goal.status)
  const priorityConfig = getPriorityConfig(goal.priority)
  const { settings } = useSettings()
  return (
    <>
      <div
        className='h-[270px] relative rounded-lg overflow-hidden drop-shadow-lg'
        style={{
          backgroundImage: `url(${goal.image_url})`,
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
              <Badge className={targetBadgeStyles}>
                🎯 {formatDate(goal.target_date, settings?.date_format)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
