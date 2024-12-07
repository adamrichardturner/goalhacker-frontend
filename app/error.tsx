'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background'>
      <div className='mx-auto flex w-full max-w-[400px] flex-col items-center space-y-8 px-4'>
        <Logo size='lg' />
        <div className='flex flex-col items-center space-y-4 text-center'>
          <div className='rounded-full bg-red-100 p-3 dark:bg-red-900/20'>
            <AlertCircle className='h-6 w-6 text-red-600 dark:text-red-500' />
          </div>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Something went wrong
          </h1>
          <p className='text-sm text-muted-foreground'>
            We&apos;re having trouble connecting to our services. This could be
            a temporary issue.
          </p>
        </div>
        <div className='flex w-full flex-col gap-2'>
          <Button onClick={reset} size='lg'>
            Try Again
          </Button>
          <Button variant='outline' size='lg' asChild>
            <Link href='/support'>Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
