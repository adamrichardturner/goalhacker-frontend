'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { usePasswordReset } from '@/hooks/auth/usePasswordReset'

export function ResetPasswordForm() {
  const [params, setParams] = useState<{
    token: string | null
    email: string | null
  }>({ token: null, email: null })
  const { resetPasswordConfirm, isLoading, error } = usePasswordReset()
  const [password, setPassword] = useState('')

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setParams({
      token: searchParams.get('token'),
      email: searchParams.get('email'),
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!params.token || !params.email) return
    try {
      await resetPasswordConfirm({
        token: params.token,
        email: params.email,
        password,
      })
    } catch (error) {
      // Error is handled by the hook
    }
  }

  if (!params.token || !params.email) {
    return (
      <Alert variant="destructive">Invalid reset password link. Please request a new one.</Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Input
            id="password"
            name="password"
            placeholder="New password"
            type="password"
            autoComplete="new-password"
            required
            disabled={isLoading}
            value={password}
            onChange={e => setPassword(e.target.value)}
            aria-label="New password"
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
              Resetting...
            </>
          ) : (
            'Reset password'
          )}
        </Button>
      </div>
    </form>
  )
}
