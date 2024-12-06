import { Stage } from '.'

const GoalCreationTimeline = ({
  stages,
  currentStage,
}: {
  stages: readonly Stage[]
  currentStage: Stage
}) => {
  return (
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
  )
}

export default GoalCreationTimeline
