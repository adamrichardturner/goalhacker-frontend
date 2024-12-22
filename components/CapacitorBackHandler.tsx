'use client'

import { useEffect } from 'react'
import { App } from '@capacitor/app'

export function CapacitorBackHandler() {
  useEffect(() => {
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back()
      } else {
        App.exitApp()
      }
    })
  }, [])

  return null
}
