'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import Link from 'next/link'
import { useLogin } from '@/hooks/auth/useLogin'
import { AuthCard } from '@/components/form-components'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRouting, setIsRouting] = useState(false)
  const { login, isLoading, error } = useLogin()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsRouting(true)
    try {
      await login({ email, password })
      await new Promise(resolve => setTimeout(resolve, 1100))
    } catch {
      // Error handled by mutation
    } finally {
      setIsRouting(false)
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidForm = email && password && validateEmail(email)
  const isDisabled = isLoading || isRouting || !isValidForm

  return (
    <AuthCard title="Login" description="Enter your credentials to access your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={isLoading || isRouting}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={isLoading || isRouting}
        />
        {error && <Alert variant="destructive">{error}</Alert>}
        <Button type="submit" className="w-full" disabled={isDisabled} size="lg">
          {isLoading || isRouting ? 'Logging in...' : 'Login'}
        </Button>
        <div className="space-y-2">
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-sm text-center text-muted-foreground">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  )
}
