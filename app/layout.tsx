'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster as Sonner } from 'sonner'
import { BackToTop } from '@/components/ui/back-to-top'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import CookieConsent from '@/components/CookieConsent'
import { ServiceWorkerRegistration } from '@/components/PWA/ServiceWorkerRegistration'
import { OfflineIndicator } from '@/components/ui/OfflineIndicator'
import { InstallPrompt } from '@/components/PWA/InstallPrompt'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#0c121d' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Goal Hacker' />
        <link rel='apple-touch-icon' href='/icons/apple-touch-icon.png' />
        <link rel='apple-touch-startup-image' href='/icons/splash.png' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='application-name' content='Goal Hacker' />
        <meta name='msapplication-TileColor' content='#0c121d' />
        <meta name='msapplication-tap-highlight' content='no' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0'
        />
        <meta name='text-size-adjust' content='none' />
        <ServiceWorkerRegistration />
      </head>
      <body className={`${inter.className} bg-background overflow-y-scroll`}>
        <ThemeProvider>
          <Providers>
            <main className='container mx-auto min-h-screen px-0 sm:px-4 w-full flex items-center justify-center'>
              {children}
            </main>
            <BackToTop />
            <CookieConsent />
            <OfflineIndicator />
            <InstallPrompt />
          </Providers>
          <Sonner />
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
