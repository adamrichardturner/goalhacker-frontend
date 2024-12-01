import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Goal, Subgoal } from "@/types/goal"
import { X, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface SubGoalsListProps {
  goalData: Partial<Goal>
  updateGoalData: (data: Partial<Goal>) => void
}

export const SubGoalsList = ({
  goalData,
  updateGoalData,
}: SubGoalsListProps) => {
  const [subGoals, setSubGoals] = useState<Partial<Subgoal>[]>([
    { title: "", due_date: undefined },
  ])

  const addSubGoal = () => {
    setSubGoals([...subGoals, { title: "", due_date: undefined }])
  }

  const removeSubGoal = (index: number) => {
    if (subGoals.length > 1) {
      const newSubGoals = subGoals.filter((_, i) => i !== index)
      setSubGoals(newSubGoals)
      updateGoalData({ subgoals: newSubGoals })
    }
  }

  const updateSubGoal = (index: number, updates: Partial<Subgoal>) => {
    const newSubGoals = subGoals.map((subGoal, i) =>
      i === index ? { ...subGoal, ...updates } : subGoal
    )
    setSubGoals(newSubGoals)
    updateGoalData({ subgoals: newSubGoals })
  }

  return (
    <div className='space-y-4'>
      {subGoals.map((subGoal, index) => (
        <div key={index} className='flex flex-col gap-2'>
          <div className='flex gap-2'>
            <Input
              placeholder={`Sub-goal ${index + 1}`}
              value={subGoal.title}
              onChange={(e) => updateSubGoal(index, { title: e.target.value })}
            />
            {subGoals.length > 1 && (
              <Button
                variant='ghost'
                size='icon'
                onClick={() => removeSubGoal(index)}
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !subGoal.due_date && "text-muted"
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {subGoal.due_date ? (
                  format(new Date(subGoal.due_date), "PPP")
                ) : (
                  <span>Set deadline for this sub-goal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={
                  subGoal.due_date ? new Date(subGoal.due_date) : undefined
                }
                onSelect={(date) =>
                  updateSubGoal(index, {
                    due_date: date ? date.toISOString() : undefined,
                  })
                }
                disabled={(date) =>
                  date < new Date() ||
                  (goalData.target_date
                    ? date > new Date(goalData.target_date)
                    : false)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      ))}
      <Button
        type='button'
        variant='outline'
        onClick={addSubGoal}
        className='w-full'
      >
        Add Sub-Goal
      </Button>
    </div>
  )
}
