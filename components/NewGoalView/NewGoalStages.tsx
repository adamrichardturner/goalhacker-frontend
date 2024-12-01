import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Goal } from "@/types/goal"
import Image from "next/image"
import lightBulbDrawing from "../../assets/illustrations/lightbulb.svg"
import chartSteppingDrawing from "../../assets/illustrations/chart-stepping.svg"
import metricsDrawing from "../../assets/illustrations/metrics.svg"
import reviewDrawing from "../../assets/illustrations/review.svg"
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SubGoalsList } from "./SubGoalsList"

interface StageProps {
  onNext: () => void
  onBack?: () => void
  updateGoalData: (data: Partial<Goal>) => void
  goalData: Partial<Goal>
}

const BasicInfo = ({ onNext, updateGoalData, goalData }: StageProps) => {
  const handleNext = () => {
    if (goalData.title) {
      onNext()
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2'>
          <div className='text-xs text-muted space-y-2'>
            <h2 className='text-xl text-primary font-semibold pb-2'>
              Step 1: What is your goal?
            </h2>
            <p>
              Your goal should be defined clearly. It should be achievable,
              realistic and measurable.{" "}
            </p>
            <p>Focus on what you want to achieve, avoiding vague statements.</p>
            <p>
              For example, instead of saying &apos;Get healthy,&apos; say
              &apos;Exercise three times a week to improve fitness.&apos;
            </p>
          </div>
          <div>
            <Image
              src={lightBulbDrawing}
              alt='Light Bulb Idea'
              width={175}
              height={175}
            />
          </div>
        </div>

        <div className='space-y-4'>
          <Input
            placeholder='Exercise three times a week to improve fitness'
            value={goalData.title || ""}
            onChange={(e) => updateGoalData({ title: e.target.value })}
            required
          />
        </div>
        <Button
          onClick={handleNext}
          disabled={!goalData.title}
          className='w-full'
        >
          Next Step
        </Button>
      </div>
    </div>
  )
}

const Timeline = ({ onNext, onBack, updateGoalData, goalData }: StageProps) => {
  const handleNext = () => {
    if (goalData.aims) {
      onNext()
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2'>
          <div className='text-xs text-muted space-y-2'>
            <h2 className='text-xl text-primary font-semibold pb-2'>
              Step 2: What do you want to achieve?
            </h2>
            <p>Explain the specific outcome you want to accomplish.</p>
            <p>
              Be detailed and clear about what success looks like, such as
              &apos;Complete a 5K race in under 30 minutes&apos; or &apos;Save
              £500 for a holiday by July 2024.&apos;
            </p>
          </div>
          <div>
            <Image
              src={chartSteppingDrawing}
              alt='Timeline Chart'
              width={175}
              height={175}
            />
          </div>
        </div>
        <div className='space-y-4'>
          <Textarea
            placeholder='Complete a 5K race in under 30 minutes'
            value={goalData.aims || ""}
            onChange={(e) => updateGoalData({ aims: e.target.value })}
            required
            maxLength={200}
            className='max-h-40 resize-none'
          />
        </div>
        <div className='flex gap-2'>
          <Button onClick={onBack} variant='outline' className='flex-1'>
            Go Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!goalData.aims}
            className='flex-1'
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  )
}

const Steps = ({ onNext, onBack, updateGoalData, goalData }: StageProps) => {
  const [useSubGoals, setUseSubGoals] = useState(false)

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2'>
          <div className='text-xs text-muted space-y-2'>
            <h2 className='text-xl text-primary font-semibold pb-2'>
              Step 4: What steps will you take?
            </h2>
            <p>
              Consider the resources, time, or skills you&apos;ll need and
              whether your goal is realistic given your current circumstances.
            </p>
            <p>
              If it feels challenging, you can enable Sub Steps below to break
              the goal down into smaller more manageable targets.
            </p>
          </div>
          <div>
            <Image
              src={chartSteppingDrawing}
              alt='Steps Chart'
              width={175}
              height={175}
            />
          </div>
        </div>

        <div className='space-y-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>
              What steps will you take to reach this goal?
            </label>
            <Textarea
              placeholder="List the key actions you'll take..."
              value={goalData.steps_to_completion || ""}
              onChange={(e) =>
                updateGoalData({ steps_to_completion: e.target.value })
              }
              required
              className='mt-2 max-h-40 resize-none'
            />
          </div>

          <div className='flex items-center space-x-2'>
            <Switch
              checked={useSubGoals}
              onCheckedChange={setUseSubGoals}
              id='use-sub-goals'
            />
            <Label htmlFor='use-sub-goals'>Break down into sub-goals</Label>
          </div>

          {useSubGoals && (
            <SubGoalsList goalData={goalData} updateGoalData={updateGoalData} />
          )}
        </div>

        <div className='flex gap-2'>
          <Button onClick={onBack} variant='outline' className='flex-1'>
            Go Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!goalData.steps_to_completion}
            className='flex-1'
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  )
}

const Measure = ({ onNext, onBack, updateGoalData, goalData }: StageProps) => {
  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2 justify-between'>
          <div className='text-xs text-muted space-y-2'>
            <h2 className='text-xl text-primary font-semibold pb-2'>
              Step 3: Measure the goal
            </h2>
            <p>Define how you&apos;ll track progress and measure success.</p>
          </div>
          <div>
            <Image
              src={metricsDrawing}
              alt='Metrics Chart'
              width={175}
              height={175}
            />
          </div>
        </div>

        <div className='space-y-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>
              How will you track your progress?
            </label>
            <div className='space-y-1'>
              <p className='text-xs text-muted'>
                Define clear metrics to measure your progress. For example:
              </p>
              <ul className='text-xs text-muted list-disc pl-4 space-y-1'>
                <li>Number of workouts completed per week</li>
                <li>Monthly savings amount tracked in a spreadsheet</li>
              </ul>
            </div>
            <Textarea
              placeholder='I will track...'
              value={goalData.measurement_method || ""}
              onChange={(e) =>
                updateGoalData({ measurement_method: e.target.value })
              }
              required
              maxLength={200}
              className='mt-2 max-h-40 resize-none'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-4'>
              <label className='text-sm font-medium'>
                Will you set a deadline? (Optional)
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !goalData.target_date &&
                        "text-muted bg-card hover:bg-card"
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {goalData.target_date ? (
                      format(new Date(goalData.target_date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={
                      goalData.target_date
                        ? new Date(goalData.target_date)
                        : undefined
                    }
                    onSelect={(date) =>
                      updateGoalData({
                        target_date: date ? date.toISOString() : undefined,
                      })
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className='space-y-4'>
              <label className='text-sm font-medium'>
                How important is this goal?
              </label>
              <Select
                value={goalData.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  updateGoalData({ priority: value })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select priority' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className='flex gap-2'>
          <Button onClick={onBack} variant='outline' className='flex-1'>
            Go Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!goalData.measurement_method}
            className='flex-1'
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  )
}

const Review = ({ onBack, goalData }: StageProps) => {
  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2 justify-between'>
          <div className='text-xs text-muted space-y-2'>
            <h2 className='text-xl text-primary font-semibold'>
              Step 5: Review your goal
            </h2>
            <p>Make sure everything looks right before creating your goal.</p>
          </div>
          <div>
            <Image
              src={reviewDrawing}
              alt='Planning Review'
              width={175}
              height={175}
            />
          </div>
        </div>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <p>
              <strong>Title:</strong> {goalData.title}
            </p>
            <p>
              <strong>Aims:</strong> {goalData.aims}
            </p>
            <p>
              <strong>How to measure:</strong> {goalData.measurement_method}
            </p>
            <p>
              <strong>Steps to completion:</strong>{" "}
              {goalData.steps_to_completion}
            </p>
            {goalData.target_date && (
              <p>
                <strong>Target Date:</strong>{" "}
                {format(new Date(goalData.target_date), "PPP")}
              </p>
            )}
            <p>
              <strong>Priority:</strong>{" "}
              <span className='capitalize'>{goalData.priority}</span>
            </p>
          </div>

          {goalData.subgoals && goalData.subgoals.length > 0 && (
            <div className='space-y-2'>
              <p className='font-medium'>Sub-goals:</p>
              <ul className='list-disc pl-4 space-y-1'>
                {goalData.subgoals.map((subgoal, index) => (
                  <li key={index} className='text-sm'>
                    {subgoal.title}
                    {subgoal.due_date && (
                      <span className='text-muted ml-2'>
                        (Due: {format(new Date(subgoal.due_date), "PPP")})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className='flex gap-2'>
          <Button onClick={onBack} variant='outline' className='flex-1'>
            Go Back
          </Button>
          <Button type='submit' className='flex-1'>
            Create Goal
          </Button>
        </div>
      </div>
    </div>
  )
}

export const NewGoalStages = {
  BasicInfo,
  Timeline,
  Steps,
  Measure,
  Review,
}
