'use client'

import { useParams } from 'next/navigation'
import ResetPasswordClient from './reset-password-client'

export default function ResetPasswordPage() {
  const params = useParams()
  const token = params?.token as string

  return <ResetPasswordClient token={token} />
}
