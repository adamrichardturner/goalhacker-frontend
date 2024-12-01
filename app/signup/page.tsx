"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AuthCard } from "@/components/form-components"
import Link from "next/link"
import useAuth from "@/hooks/useAuth"

export default function SignupPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showCheckEmail, setShowCheckEmail] = useState(false)
  const { signupUser, loading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await signupUser({
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      password,
    })
    if (success) {
      setShowCheckEmail(true)
    }
  }

  const handleOpenEmail = () => {
    window.location.href = "mailto:"
  }

  if (showCheckEmail) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <AuthCard
          title='Check your email'
          description='We sent you a verification email. Please check your inbox and click the verification link to activate your account.'
        >
          <div className='space-y-4'>
            <Button onClick={handleOpenEmail} className='w-full'>
              Open Email Client
            </Button>
            <p className='text-sm text-center text-gray-600'>
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={() =>
                  signupUser({
                    first_name: firstName,
                    last_name: lastName,
                    username,
                    email,
                    password,
                  })
                }
                className='text-blue-600 hover:underline'
              >
                click here to resend
              </button>
            </p>
          </div>
        </AuthCard>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <AuthCard
        title='Create an account'
        description='Enter your details to create your account'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              type='text'
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              type='text'
              placeholder='Last Name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <Input
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <Input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='text-sm text-right'>
            <Link href='/login' className='text-blue-600 hover:underline'>
              Already have an account?
            </Link>
          </div>
          <Button type='submit' className='w-full' disabled={loading}>
            Create account
          </Button>
          {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        </form>
      </AuthCard>
    </div>
  )
}
