'use client'

import { Suspense } from 'react'
import { Logo } from '@/components/Logo'
import { Skeleton } from '@/components/ui/skeleton'
import { ResetPasswordForm } from '@/components/Auth/ResetPasswordForm'

function FormSkeleton() {
  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <Skeleton className='h-8 w-full' />
          <Skeleton className='h-4 w-3/4 mx-auto' />
        </div>
        <Skeleton className='h-[200px] w-full' />
      </div>
    </div>
  )
}

function ResetPasswordContent() {
  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <Logo className='mx-auto h-6 w-6' />
          <h1 className='text-2xl font-semibold tracking-tight'>
            Reset Password
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter your new password below.
          </p>
        </div>
        <Suspense fallback={<FormSkeleton />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
