'use client'

import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from './button'
import { useInsights } from '@/hooks/useInsights'

export function FloatingInsights() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fromInsights = searchParams.get('from') === 'insights'
  const { insight: currentInsight } = useInsights()

  // Check if we have enough data for insights
  const hasEnoughData =
    currentInsight &&
    currentInsight.goal_stats.total > 0 &&
    currentInsight.goal_stats.completionRates.some(
      (g) => g.completion > 0 || g.title.length > 0
    )

  // Only show on goal-related pages
  const isGoalRelatedPage =
    pathname === '/goals' || pathname.startsWith('/goals/')

  if (!hasEnoughData || fromInsights || !isGoalRelatedPage) {
    return null
  }

  const handleClick = () => {
    router.push('/dashboard')
  }

  return (
    <motion.div
      className='fixed bottom-24 right-8 sm:bottom-40'
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={handleClick}
        className='h-12 w-12 rounded-full bg-[#7148FC] hover:bg-[#7148FC]/90 transition-all'
        aria-label='View AI Insights'
      >
        <Sparkles className='h-6 w-6 text-white' />
      </Button>
    </motion.div>
  )
}
