import Link from 'next/link'
import { Button } from '../ui/button'

export default function EmptyGoalsState() {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center space-y-8'>
      <div className='text-center text-primary space-y-4 max-w-lg'>
        <h1 className='text-xl sm:text-3xl font-bold'>
          Start your journey by creating a goal
        </h1>
        <p className='text-muted-foreground text-sm sm:text-base'>
          Welcome to GoalHacker! To get started, create your first goal. You can
          also{' '}
          <Link
            href='/settings'
            className='text-primaryActive hover:text-primaryActive/90 underline'
          >
            customise your profile and settings
          </Link>{' '}
          to make your goal-tracking experience more personal.
        </p>
      </div>

      <Link href='/goals/new'>
        <Button
          size='lg'
          className='bg-primaryActive text-primary h-12 hover:bg-primaryActive/95 hover:drop-shadow-lg'
        >
          New Goal
        </Button>
      </Link>
    </div>
  )
}
