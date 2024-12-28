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

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#744afc" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Goal Hacker" />
        <link rel="apple-touch-icon" href="/icons/favicon-192x192.png" />
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
          </Providers>
          <Sonner />
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
