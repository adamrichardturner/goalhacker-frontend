import { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster as Sonner } from 'sonner'
import { BackToTop } from '@/components/ui/back-to-top'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#744afc',
}

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
    title: 'Goal Hacker',
  },
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
            <main className='container mx-auto w-full flex items-center justify-center sm:pt-0 pt-[90px]'>
              {children}
            </main>
            <BackToTop />
          </Providers>
          <Sonner />
        </ThemeProvider>
      </body>
    </html>
  )
}
