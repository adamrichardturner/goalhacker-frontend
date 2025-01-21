import { useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'

const useMobile = () => {
  const { scrollY } = useScroll()
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // sm breakpoint is 640px
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile) return

    const updateScrollDirection = () => {
      const currentScrollY = scrollY.get()
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY < 50)
      setLastScrollY(currentScrollY)
    }

    const unsubscribe = scrollY.on('change', updateScrollDirection)
    return () => unsubscribe()
  }, [scrollY, lastScrollY, isMobile])

  return {
    scrollY,
    lastScrollY,
    isVisible,
    isMobile,
  }
}

export default useMobile
