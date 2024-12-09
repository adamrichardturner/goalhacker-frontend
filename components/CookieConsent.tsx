'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    gtag: (
      command: 'consent',
      action: 'update',
      config: { analytics_storage: string; ad_storage: string }
    ) => void
  }
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Only show on root path and if no consent choice made
    const hasConsent = localStorage.getItem('cookieConsent')
    if (!hasConsent && pathname === '/') {
      setShowBanner(true)
    } else {
      setShowBanner(false)
    }
  }, [pathname])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'granted')
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
    })
    setShowBanner(false)
  }

  const handleDeny = () => {
    localStorage.setItem('cookieConsent', 'denied')
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
    })
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50'>
      <div className='max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4'>
        <p className='text-sm text-gray-600'>
          We use essential cookies for our service to work and analytics cookies
          to understand how you use our site. Would you like to accept analytics
          cookies?
        </p>
        <div className='flex gap-2'>
          <Button
            onClick={handleDeny}
            className='px-4 py-2 text-sm text-gray-600 bg-card border border-gray-300 rounded hover:bg-gray-100'
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            className='px-4 py-2 text-sm text-white bg-electricPurple rounded hover:bg-electricPurple/80'
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
