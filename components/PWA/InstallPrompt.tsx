'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Share2 } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface ExtendedNavigator extends Navigator {
  standalone?: boolean
}

interface ExtendedWindow extends Window {
  MSStream?: boolean
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false)

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as ExtendedWindow).MSStream
    setIsIOS(isIOSDevice)

    // Check if already installed
    setIsInStandaloneMode(
      window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as ExtendedNavigator).standalone ||
        false
    )

    // For non-iOS devices, listen for install prompt
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    if (!isIOSDevice) {
      window.addEventListener('beforeinstallprompt', handler as EventListener)
    }

    return () => {
      if (!isIOSDevice) {
        window.removeEventListener(
          'beforeinstallprompt',
          handler as EventListener
        )
      }
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  // Don't show if already installed or no prompt available
  if (isInStandaloneMode || (!showPrompt && !isIOS)) return null

  // iOS-specific install instructions
  if (isIOS) {
    return (
      <div className='fixed bottom-4 left-4 bg-card text-card-foreground p-4 rounded-lg shadow-lg max-w-sm'>
        <div className='flex items-start gap-4'>
          <div>
            <h3 className='font-semibold'>Install Goal Hacker</h3>
            <p className='text-sm text-muted-foreground mb-2'>
              Install this app on your iPhone:
            </p>
            <ol className='text-sm text-muted-foreground list-decimal list-inside space-y-1'>
              <li>
                Tap the <Share2 className='h-4 w-4 inline-block mx-1' /> share
                button
              </li>
              <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
            </ol>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setShowPrompt(false)}
          >
            ✕
          </Button>
        </div>
      </div>
    )
  }

  // Default install prompt for other platforms
  return (
    <div className='fixed bottom-4 left-4 bg-card text-card-foreground p-4 rounded-lg shadow-lg flex items-center gap-4'>
      <div>
        <h3 className='font-semibold'>Install Goal Hacker</h3>
        <p className='text-sm text-muted-foreground'>
          Get quick access from your home screen
        </p>
      </div>
      <Button onClick={handleInstallClick} variant='default'>
        <Download className='h-4 w-4 mr-2' />
        Install
      </Button>
    </div>
  )
}
