/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import Link from 'next/link'
import { useTheme } from 'next-themes'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = !mounted
    ? '/goalhacker-logo.svg'
    : theme === 'dark'
      ? '/goalhacker-logo-dark.svg'
      : '/goalhacker-logo.svg'

  if (submitted) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <AuthCard
          title='Check your email'
          description="We've sent you a password reset link to your email address."
        >
          <Link href='/login'>
            <Button className='w-full'>Return to login</Button>
          </Link>
        </AuthCard>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Link href='/' className='w-full pb-6 flex justify-center'>
        <img src={logoSrc} alt='Goal Hacker' className='h-8 sm:h-12 mb-4' />
      </Link>
      <AuthCard
        title='Forgot password'
        description="Enter your email address and we'll send you a reset link"
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type='submit' className='w-full'>
            Send reset link
          </Button>
          <div className='text-sm text-center'>
            <Link href='/login' className='text-blue-600 hover:underline'>
              Back to login
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  )
}
