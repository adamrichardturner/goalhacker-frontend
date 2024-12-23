import { Metadata, Viewport } from 'next'
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

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#744afc',
}

export const metadata: Metadata = {
  title: 'Goal Hacker | Track and achieve your goals',
  description:
    "Goal Hacker - Your intelligent goal tracking and achievement platform. Set meaningful goals, break them down into actionable subgoals, track your progress, and get AI-powered insights to stay motivated. Features smart goal organization, visual progress tracking, collaborative sharing, and personalized achievement strategies. Transform your aspirations into accomplishments with our Goal Hacker's intuitive goal management system.",
  metadataBase: new URL('https://goalhacker.app'),
  openGraph: {
    title: 'Goal Hacker | Track and achieve your goals',
    description:
      "Goal Hacker - Your intelligent goal tracking and achievement platform. Set meaningful goals, break them down into actionable subgoals, track your progress, and get AI-powered insights to stay motivated. Features smart goal organization, visual progress tracking, collaborative sharing, and personalized achievement strategies. Transform your aspirations into accomplishments with our Goal Hacker's intuitive goal management system.",
    url: '/',
    siteName: 'Goal Hacker',
    images: [
      {
        url: 'https://goalhacker.app/goal-hacker-social.png',
        width: 1200,
        height: 630,
        alt: 'Goal Hacker - Track and achieve your goals',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goal Hacker | Track and achieve your goals',
    description:
      "Goal Hacker - Your intelligent goal tracking and achievement platform. Set meaningful goals, break them down into actionable subgoals, track your progress, and get AI-powered insights to stay motivated. Features smart goal organization, visual progress tracking, collaborative sharing, and personalized achievement strategies. Transform your aspirations into accomplishments with our Goal Hacker's intuitive goal management system.",
    images: [
      {
        url: 'https://goalhacker.app/goal-hacker-social.png',
        alt: 'Goal Hacker - Track and achieve your goals',
      },
    ],
    creator: '@devadam88',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [{ url: '/icons/favicon.svg' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Goal Hacker',
  },
}

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Providers>
        <main className='container mx-auto min-h-screen px-0 sm:px-4 w-full flex items-center justify-center'>
          {children}
        </main>
        <Suspense fallback={null}>
          <FloatingInsights />
        </Suspense>
        <BackToTop />
        <CookieConsent />
      </Providers>
      <Sonner />
    </ThemeProvider>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} overflow-y-scroll`}>
        <ClientLayout>{children}</ClientLayout>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
