import { Goal } from '@/types/goal'
import { getPriorityConfig } from '@/utils/goalPriority'
import { StatusBadge } from '../../ui/status-badge'
import { formatDate } from '@/utils/dateFormat'
import { EditGoalImage } from './EditGoalImage'
import { getGoalStatus } from '@/utils/goalStatus'
import { useSettings } from '@/hooks/useSettings'
import { useGoalImageDisplay } from '@/hooks/useGoalImageDisplay'
import { Layers, Target, AlertTriangle, Flag } from 'lucide-react'

interface GoalBannerProps {
  goal: Goal
}

export default function GoalBanner({ goal }: GoalBannerProps) {
  const statusConfig = getGoalStatus(goal.status)
  const priorityConfig = getPriorityConfig(goal.priority)
  const { settings } = useSettings()
  const { imageUrl } = useGoalImageDisplay(goal)

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className='h-3 w-3' />
      case 'medium':
        return <Flag className='h-3 w-3' />
      default:
        return <Flag className='h-3 w-3' />
    }
  }

  return (
    <>
      <div
        className='h-[270px] relative sm:rounded-2xl overflow-hidden shadow-sm -px-4 sm:mx-auto'
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute top-6 right-4 flex items-start gap-2'>
          <EditGoalImage goal={goal} />
        </div>
        <div className='absolute bottom-6 space-y-4 left-4 right-4 text-white'>
          <h1 className='text-3xl font-bold mt-2 line-clamp-2'>{goal.title}</h1>
          <div className='flex items-center gap-2'>
            <StatusBadge
              className='text-[10px] rounded-full'
              icon={<Layers className='h-3 w-3' />}
            >
              {statusConfig.label}
            </StatusBadge>
            <StatusBadge
              className='text-[10px] rounded-full'
              icon={getPriorityIcon(goal.priority)}
            >
              {priorityConfig.label}
            </StatusBadge>
            {goal.target_date && (
              <StatusBadge
                className='text-[10px] rounded-full'
                icon={<Target className='h-3 w-3' />}
              >
                {formatDate(goal.target_date, settings?.date_format)}
              </StatusBadge>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
