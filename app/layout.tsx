import { Metadata, Viewport } from 'next'
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Goal Hacker',
  },
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
      {
        url: '/icons/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icons/favicon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [{ url: '/icons/favicon-192x192.png' }],
  },
}

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
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
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Goal Hacker' />
        <link rel='apple-touch-icon' href='/icons/favicon-192x192.png' />
      </head>
      <body className={`${inter.className} overflow-y-scroll`}>
        <ClientLayout>{children}</ClientLayout>
        <GoogleAnalytics />
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
