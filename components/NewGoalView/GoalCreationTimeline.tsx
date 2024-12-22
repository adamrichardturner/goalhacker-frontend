import { Stage } from '.'
import { Goal } from '@/types/goal'

const GoalCreationTimeline = ({
  stages,
  currentStage,
  onNavigateToStep,
  goalData,
}: {
  stages: readonly Stage[]
  currentStage: Stage
  onNavigateToStep: (step: number) => void
  goalData: Partial<Goal>
}) => {
  const isStepCompleted = (stage: Stage) => {
    switch (stage) {
      case 'BasicInfo':
        return !!goalData.title
      case 'Timeline':
        return !!goalData.aims
      case 'Measure':
        return !!goalData.measurement_method
      case 'Steps':
        return !!goalData.steps_to_completion
      case 'Review':
        return false // Review is never "completed" until submission
      default:
        return false
    }
  }

  return (
    <div className="flex w-full items-end justify-end pt-2 pb-4">
      {stages.map((stage, index) => {
        const completed = isStepCompleted(stage)
        const current = stage === currentStage
        const clickable = completed || current

        return (
          <div
            key={stage}
            onClick={() => clickable && onNavigateToStep(index + 1)}
            className={`flex items-center ${clickable ? 'cursor-pointer' : ''} ${
              index < stages.indexOf(currentStage)
                ? 'text-electricPurple'
                : index === stages.indexOf(currentStage)
                  ? 'text-foreground'
                  : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-4 h-4 text-xs p-2 rounded-full flex items-center justify-center border 
                ${index <= stages.indexOf(currentStage) ? 'border-electricPurple' : 'border-muted'}
                ${clickable ? 'hover:bg-accent/50 transition-colors' : ''}
              `}
            >
              {index + 1}
            </div>
            {index < stages.length - 1 && (
              <div
                className={`w-full h-[1px] px-2 ${
                  index < stages.indexOf(currentStage) ? 'bg-electricPurple' : 'bg-muted'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default GoalCreationTimeline
