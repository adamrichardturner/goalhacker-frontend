import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'
import { Footer } from '@/components/Footer'

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='max-w-md w-full px-6 py-12 text-center space-y-6'>
        <div className='flex justify-center'>
          <Link href='/'>
            <Logo size='md' showIcon={true} />
          </Link>
        </div>

        <h1 className='text-4xl font-bold text-foreground'>Page Not Found</h1>

        <p className='text-lg text-muted-foreground'>
          Oops! It seems you&apos;ve wandered into uncharted territory.
        </p>

        <div className='space-y-4'>
          <Link href='/goals'>
            <Button variant='default' className='w-full' size='lg'>
              View Goals
            </Button>
          </Link>

          <div className='space-y-2'>
            <Link href='/support'>
              <Button variant='secondary' className='w-full' size='lg'>
                Contact Support
              </Button>
            </Link>

            <p className='text-sm text-muted-foreground'>
              or email us at{' '}
              <a
                href='mailto:support@goalhacker.app'
                className='text-primary hover:underline'
              >
                support@goalhacker.app
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
