'use client'

import { ArrowUp } from 'lucide-react'
import { motion, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Button } from './button'

export function BackToTop() {
  const { scrollY } = useScroll()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => {
      const currentScrollY = scrollY.get()
      setIsVisible(currentScrollY > 400)
    }

    const unsubscribe = scrollY.on('change', updateVisibility)
    return () => unsubscribe()
  }, [scrollY])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.div
      className='fixed bottom-8 right-8 hidden sm:block'
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      transition={{ duration: 0.2 }}
    >
      <Button
        size='icon'
        onClick={scrollToTop}
        className='h-10 w-10 rounded-full bg-electricPurple hover:bg-electricPurple/90 transition-all'
        aria-label='Back to top'
      >
        <ArrowUp className='h-4 w-4 text-white' />
      </Button>
    </motion.div>
  )
}
