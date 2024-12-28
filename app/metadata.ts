import { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0c121d',
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
