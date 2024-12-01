"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthCard } from "@/components/form-components"
import Link from "next/link"
import useAuth from "@/hooks/useAuth"
export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  )

  useEffect(() => {
    const verifyUserEmail = async () => {
      const token = searchParams.get("token")
      const email = searchParams.get("email")
      if (!token || !email) {
        setStatus("error")
        return
      }

      try {
        await verifyEmail(token, email)
        setTimeout(() => setStatus("success"), 1000)
      } catch (error) {
        console.error(error)
        setStatus("error")
      }
    }

    verifyUserEmail()
  }, [searchParams])

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <AuthCard
        title={
          status === "loading"
            ? "Verifying your email..."
            : status === "success"
            ? "Email verified!"
            : "Verification failed"
        }
        description={
          status === "loading"
            ? "Please wait while we verify your email address."
            : status === "success"
            ? "Your email has been successfully verified. You can now log in to your account."
            : "We could not verify your email address. The link may have expired or is invalid."
        }
      >
        {status !== "loading" && (
          <Link href='/login'>
            <Button className='w-full'>Go to login</Button>
          </Link>
        )}
      </AuthCard>
    </div>
  )
}
