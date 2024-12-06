import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster as Sonner } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Goal Hacker | Track and achieve your goals',
  description: 'Track and achieve your goals',
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/icons/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icons/favicon.svg' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GoalHacker',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#6D28D9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} overflow-y-scroll`}>
        <ThemeProvider>
          <Providers>
            <main className='container mx-auto pb-8 w-full flex items-center justify-center'>
              {children}
            </main>
          </Providers>
          <Sonner />
        </ThemeProvider>
      </body>
    </html>
  )
}
