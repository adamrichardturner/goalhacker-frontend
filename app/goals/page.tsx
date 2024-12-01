"use client"

import GoalsView from "@/components/GoalsView"
import Header from "@/components/Header"
import { useUser } from "@/hooks/useUser"

export default function GoalsPage() {
  const { data: user, isLoading } = useUser()
  if (!user) {
    return null
  }
  return (
    <div className='container max-w-3xl flex flex-col gap-6 sm:px-4 w-full'>
      <Header user={user} loading={isLoading} />
      <main className='flex flex-col gap-4 w-full bg-card sm:p-16 rounded-lg shadow-sm'>
        <GoalsView goals={[]} user={user} />
      </main>
    </div>
  )
}
