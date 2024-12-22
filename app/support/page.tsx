'use client'

import { Suspense, useState } from 'react'
import { Logo } from '@/components/Logo'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

function FormSkeleton() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  )
}

function SupportContent() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center">
          <Logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
          <p className="text-sm text-muted-foreground">How can we help you today?</p>
        </div>
        <Suspense fallback={<FormSkeleton />}>
          <SupportForm />
        </Suspense>
      </div>
    </div>
  )
}

export default function SupportPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <SupportContent />
    </Suspense>
  )
}

function SupportForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implement support form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Support request sent! We will get back to you soon.')
      setEmail('')
      setMessage('')
    } catch (err) {
      setError('Failed to send support request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Input
            id="email"
            name="email"
            placeholder="name@example.com"
            type="email"
            autoComplete="email"
            required
            disabled={isLoading}
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-label="Email address"
          />
        </div>
        <div className="grid gap-1">
          <Textarea
            id="message"
            name="message"
            placeholder="How can we help you?"
            required
            disabled={isLoading}
            value={message}
            onChange={e => setMessage(e.target.value)}
            aria-label="Support message"
            rows={4}
          />
        </div>
        {error && (
          <Alert variant="destructive" role="alert">
            {error}
          </Alert>
        )}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Sending...
            </>
          ) : (
            'Send message'
          )}
        </Button>
      </div>
    </form>
  )
}
