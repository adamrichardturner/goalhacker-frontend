'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export function FloatingInsights() {
  const router = useRouter()
  const pathname = usePathname()
  const [showInsights, setShowInsights] = useState(false)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const hasInsights = searchParams.get('insights') === 'true'
    setShowInsights(hasInsights)
  }, [])

  const handleClick = () => {
    if (showInsights) {
      router.push(pathname)
    } else {
      router.push('/dashboard?tab=insights')
    }
    setShowInsights(!showInsights)
  }

  if (!pathname.startsWith('/goals')) return null

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant={showInsights ? 'default' : 'outline'}
      className="fixed bottom-4 right-4 z-50 gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {showInsights ? 'Hide Insights' : 'Show Insights'}
    </Button>
  )
}
