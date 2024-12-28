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

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
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
          </Providers>
          <Sonner />
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
