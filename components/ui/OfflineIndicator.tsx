'use client'

import { useOfflineSync } from '@/hooks/useOfflineSync'
import { WifiOff } from 'lucide-react'

export function OfflineIndicator() {
  const { isOnline } = useOfflineSync()

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
      <WifiOff className="h-4 w-4" />
      <span>You&apos;re offline. Changes will sync when back online.</span>
    </div>
  )
} 