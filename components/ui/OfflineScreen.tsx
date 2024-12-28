import { WifiOff } from 'lucide-react'
import { Button } from './button'

export function OfflineScreen() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <div className='max-w-md w-full space-y-8 text-center'>
        <div className='space-y-4'>
          <div className='flex justify-center'>
            <div className='h-24 w-24 rounded-full bg-muted/20 flex items-center justify-center'>
              <WifiOff className='h-12 w-12 text-muted-foreground' />
            </div>
          </div>
          <h1 className='text-3xl font-bold tracking-tight text-primary'>
            No Internet Connection
          </h1>
          <div className='space-y-2 text-muted-foreground'>
            <p>We couldn&apos;t load the content you requested.</p>
            <p className='text-sm'>
              Please check your internet connection and try again. Your changes
              will be saved and synced when you&apos;re back online.
            </p>
          </div>
        </div>
        <div className='space-y-4'>
          <Button
            onClick={() => window.location.reload()}
            className='bg-primaryActive hover:bg-primaryActive/90'
          >
            Try Again
          </Button>
          <div>
            <Button
              variant='ghost'
              onClick={() => window.history.back()}
              className='text-muted-foreground hover:text-primary'
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
