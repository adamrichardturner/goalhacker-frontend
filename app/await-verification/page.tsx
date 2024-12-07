'use client'

import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import { PublicLogo } from '@/components/PublicLogo'
import { Footer } from '@/components/Footer'
import { useSearchParams } from 'next/navigation'

export default function AwaitVerificationPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const handleOpenEmail = () => {
    window.location.href = 'mailto:'
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <PublicLogo />
      <AuthCard
        title='Verify your email'
        description='Please check your inbox and click the verification link to activate your account.'
      >
        <div className='space-y-4'>
          <Alert variant='info' className='mb-4'>
            {email ? (
              <>We sent a verification link to {email}</>
            ) : (
              <>Please check your email for the verification link.</>
            )}
          </Alert>
          <div className='space-y-4'>
            <Button onClick={handleOpenEmail} className='w-full'>
              Open Email Client
            </Button>
            <p className='text-sm text-center text-muted-foreground'>
              Can&apos;t find the email? Check your spam folder.
            </p>
          </div>
          <div className='pt-4 border-t'>
            <p className='text-sm text-center text-muted-foreground'>
              Already verified?{' '}
              <Link href='/login' className='text-blue-600 hover:underline'>
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </AuthCard>
      <Footer />
    </div>
  )
}
