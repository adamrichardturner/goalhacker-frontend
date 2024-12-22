'use client'

import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from './button'

export function BackToInsights() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/dashboard?tab=insights')
  }

  return (
    <motion.div
      className='fixed bottom-8 right-8 sm:bottom-24'
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={handleClick}
        className='rounded-full bg-electricPurple hover:bg-electricPurple/90 transition-all flex items-center gap-2 px-4'
        aria-label='Back to AI Insights'
      >
        <ArrowLeft className='h-4 w-4 text-white' />
        <span className='text-white'>Back to AI Insights</span>
      </Button>
    </motion.div>
  )
}
