'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster as Sonner } from 'sonner'
import { BackToTop } from '@/components/ui/back-to-top'
import { FloatingInsights } from '@/components/ui/floating-insights'
import { Suspense } from 'react'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import CookieConsent from '@/components/CookieConsent'
import { CapacitorBackHandler } from '@/components/CapacitorBackHandler'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover'
        />
        <meta name='theme-color' content='#744afc' />
      </head>
      <body className={`${inter.className} scroll-smooth overflow-y-scroll`}>
        <Providers>
          <ThemeProvider>
            {children}
            <Sonner position='top-center' />
            <BackToTop />
            <FloatingInsights />
            <Suspense>
              <GoogleAnalytics />
            </Suspense>
            <CookieConsent />
            <CapacitorBackHandler />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
