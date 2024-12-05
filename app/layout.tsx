import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster as Sonner } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GoalHacker',
  description: 'Track and achieve your goals',
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
