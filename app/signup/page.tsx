'use client'

import { useState, Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AuthCard } from '@/components/form-components'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import { PublicLogo } from '@/components/PublicLogo'
import { processAuthError } from '@/utils/auth-errors'
import { Footer } from '@/components/Footer'
import { useSignup } from '@/hooks/auth/useSignup'

interface ValidationErrors {
  email?: string
  password?: string
  username?: string
  general?: string
}

interface RegistrationState {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

function SignupForm() {
  const [formData, setFormData] = useState<RegistrationState>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  })
  const [showCheckEmail, setShowCheckEmail] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const { signup, isLoading } = useSignup()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: ValidationErrors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    }

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long'
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username =
        'Username can only contain letters, numbers, underscores, and hyphens'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      await signup({
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      setShowCheckEmail(true)
    } catch (err) {
      setErrors({ general: processAuthError(err) })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange =
    (field: keyof RegistrationState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors({})
    }

  const handleOpenEmail = () => {
    window.location.href = 'mailto:'
  }

  if (showCheckEmail) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <PublicLogo />
        <AuthCard
          title='Verify your email'
          description='Please check your inbox and click the verification link to activate your account.'
        >
          <div className='space-y-4'>
            <Alert variant='info' className='mb-4'>
              We sent a verification link to {formData.email}
            </Alert>
            <div className='space-y-2'>
              <Button onClick={handleOpenEmail} className='w-full'>
                Open Email Client
              </Button>
              <p className='text-sm text-center text-muted-foreground'>
                Can&apos;t find the email? Check your spam folder or{' '}
                <button
                  onClick={() =>
                    signup({
                      first_name: formData.firstName,
                      last_name: formData.lastName,
                      username: formData.username,
                      email: formData.email,
                      password: formData.password,
                    })
                  }
                  className='text-blue-600 hover:underline'
                >
                  click here to resend
                </button>
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

  const isValidForm =
    formData.firstName &&
    formData.lastName &&
    formData.username &&
    formData.email &&
    formData.password &&
    Object.keys(errors).length === 0

  return (
    <AuthCard
      title='Create an account'
      description='Enter your details to create your account'
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        {errors.general && (
          <Alert variant='destructive' className='mb-4 dark:text-white'>
            {errors.general}
          </Alert>
        )}
        <div className='grid grid-cols-2 gap-4'>
          <Input
            type='text'
            placeholder='First Name'
            value={formData.firstName}
            onChange={handleInputChange('firstName')}
            required
            disabled={isLoading}
          />
          <Input
            type='text'
            placeholder='Last Name'
            value={formData.lastName}
            onChange={handleInputChange('lastName')}
            required
            disabled={isLoading}
          />
        </div>
        <div className='space-y-2'>
          <Input
            type='text'
            placeholder='Username'
            value={formData.username}
            onChange={handleInputChange('username')}
            required
            disabled={isLoading}
            className={errors.username ? 'border-destructive' : ''}
          />
          {errors.username && (
            <p className='text-xs text-destructive dark:text-white'>
              {errors.username}
            </p>
          )}
        </div>
        <div className='space-y-2'>
          <Input
            type='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleInputChange('email')}
            required
            disabled={isLoading}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className='text-xs text-destructive dark:text-white'>
              {errors.email}
            </p>
          )}
        </div>
        <div className='space-y-2'>
          <Input
            type='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleInputChange('password')}
            required
            disabled={isLoading}
            className={errors.password ? 'border-destructive' : ''}
          />
          {errors.password && (
            <p className='text-xs text-destructive dark:text-white'>
              {errors.password}
            </p>
          )}
        </div>
        <Button
          type='submit'
          className='w-full'
          disabled={isLoading || isSubmitting || !isValidForm}
        >
          {isLoading || isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
        <p className='text-sm text-center text-muted-foreground'>
          Already have an account?{' '}
          <Link href='/login' className='text-blue-600 hover:underline'>
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}

export default function SignupPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 sm:px-0'>
      <PublicLogo />
      <Suspense fallback={<div>Loading signup form...</div>}>
        <SignupForm />
      </Suspense>
      <Footer />
    </div>
  )
}
