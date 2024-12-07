'use client'

import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import { PublicLogo } from '@/components/PublicLogo'
import { Footer } from '@/components/Footer'

export default function AwaitVerificationPage() {
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
            We sent you a verification link. Please check your email.
          </Alert>
          <div className='space-y-2'>
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
