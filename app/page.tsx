/* eslint-disable @next/next/no-img-element */
'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ModeToggle } from '@/components/ThemeSwitcher'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = !mounted
    ? '/goalhacker-logo.svg'
    : theme === 'dark'
      ? '/goalhacker-logo-dark.svg'
      : '/goalhacker-logo.svg'

  return (
    <div className='min-h-screen container flex flex-col gap-6 sm:px-4 w-full'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 pt-8 sm:pt-16'>
        <nav className='flex justify-end w-full items-center mb-16'>
          <div className='flex items-center gap-4'>
            <ModeToggle />
            <Link href='/login'>
              <Button variant='ghost'>Sign in</Button>
            </Link>
            <Link href='/signup'>
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>

        <div className='text-center max-w-3xl flex flex-col gap-4 mx-auto mb-16 py-10'>
          <img src={logoSrc} alt='Goal Hacker' className='h-8 sm:h-12 mb-4' />
          <h1 className='text-4xl sm:text-6xl font-bold mb-6'>
            Transform Your Goals into{' '}
            <span className='text-electricPurple'>Achievements</span>
          </h1>
          <p className='text-lg sm:text-xl text-muted-foreground mb-8'>
            Goal Hacker helps you break down big goals into manageable steps,
            track your progress, and stay motivated with powerful insights.
          </p>
          <Link href='/signup'>
            <Button
              size='lg'
              className='bg-gradient-to-r from-electricPurple to-[#FF6B6B]'
            >
              Register for Beta Access
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          <div className='p-6 bg-card rounded-lg shadow-sm'>
            <h3 className='text-xl font-semibold mb-3'>Smart Goal Breakdown</h3>
            <p className='text-muted-foreground'>
              Break complex goals into actionable subgoals. Track progress and
              celebrate small wins along the way.
            </p>
          </div>
          <div className='p-6 bg-card rounded-lg shadow-sm'>
            <h3 className='text-xl font-semibold mb-3'>Progress Tracking</h3>
            <p className='text-muted-foreground'>
              Visual progress bars and statistics help you stay motivated and
              understand your journey.
            </p>
          </div>
          <div className='p-6 bg-card rounded-lg shadow-sm'>
            <h3 className='text-xl font-semibold mb-3'>Insights Dashboard</h3>
            <p className='text-muted-foreground'>
              Get valuable insights about your goal completion patterns and
              productivity trends.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className='max-w-4xl mx-auto mb-16'>
          <h2 className='text-3xl font-bold text-center mb-12'>How It Works</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='w-12 h-12 bg-electricPurple/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-xl font-semibold text-electricPurple'>
                  1
                </span>
              </div>
              <h3 className='font-semibold mb-2'>Create a Goal</h3>
              <p className='text-sm text-muted-foreground'>
                Define your main goal and target date
              </p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 bg-electricPurple/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-xl font-semibold text-electricPurple'>
                  2
                </span>
              </div>
              <h3 className='font-semibold mb-2'>Break It Down</h3>
              <p className='text-sm text-muted-foreground'>
                Split into manageable subgoals
              </p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 bg-electricPurple/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-xl font-semibold text-electricPurple'>
                  3
                </span>
              </div>
              <h3 className='font-semibold mb-2'>Track Progress</h3>
              <p className='text-sm text-muted-foreground'>
                Update and monitor your journey
              </p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 bg-electricPurple/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-xl font-semibold text-electricPurple'>
                  4
                </span>
              </div>
              <h3 className='font-semibold mb-2'>Achieve More</h3>
              <p className='text-sm text-muted-foreground'>
                Celebrate your successes
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className='text-center bg-card rounded-lg p-8 sm:p-12 mb-16'>
          <h2 className='text-2xl sm:text-3xl font-bold mb-4'>
            Ready to Start Achieving Your Goals?
          </h2>
          <p className='text-muted-foreground mb-8'>
            Join the beta and be among the first to experience Goal Hacker.
          </p>
          <Link href='/signup'>
            <Button size='lg'>Sign Up for Beta Access</Button>
          </Link>
        </div>

        {/* Footer */}
        <footer className='text-center text-sm text-muted-foreground py-8'>
          <p>© 2023 Goal Hacker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
