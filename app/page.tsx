'use client'

import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/hooks/auth/useUser'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Suspense } from 'react'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
}

const slideIn = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
}

function LandingPageClient() {
  const { user, isLoading } = useUser()
  const year = new Date().getFullYear()

  return (
    <div className='min-h-screen container flex flex-col gap-6 sm:px-4 w-full'>
      {/* Hero Section */}
      <div className='container mx-auto px-4'>
        <div className='flex flex-col min-h-screen items-center justify-center w-full mb-16'>
          <div className='text-center max-w-3xl flex flex-col gap-4 mx-auto mb-16 py-10'>
            <motion.div
              className='flex justify-center'
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
            >
              <Logo size='xl' />
            </motion.div>
            <motion.h1
              className='text-4xl sm:text-6xl font-bold mb-6'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Transform Your Goals into{' '}
              <motion.span
                className='text-primaryActive inline-block'
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
              >
                Achievements
              </motion.span>
            </motion.h1>
            <motion.p
              className='text-lg sm:text-xl text-muted-foreground mb-8'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Goal Hacker helps you break down big goals into manageable steps,
              track your progress, and stay motivated with powerful insights.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {isLoading ? (
                <Button
                  size='lg'
                  className='bg-gradient-to-r from-primaryActive to-[#FF6B6B]'
                  disabled
                >
                  Loading...
                </Button>
              ) : !user ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href='/signup'>
                      <Button
                        size='lg'
                        className='bg-gradient-to-r from-primaryActive to-[#FF6B6B]'
                      >
                        Register for Beta Access
                      </Button>
                    </Link>
                  </motion.div>
                  <p className='text-sm text-muted-foreground mt-2'>
                    (...Beta access is free!)
                  </p>
                </>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href='/goals'>
                    <Button
                      size='lg'
                      className='bg-gradient-to-r from-primaryActive to-[#FF6B6B]'
                    >
                      Go to Your Goals
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'
            variants={staggerContainer}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              {
                title: 'Smart Goal Breakdown',
                description:
                  'Break complex goals into actionable subgoals. Track progress and celebrate small wins along the way.',
              },
              {
                title: 'AI-Powered Insights',
                description:
                  'Get personalized advice on goal optimization, progress patterns, and actionable recommendations to improve your success rate.',
              },
              {
                title: 'Progress Analytics',
                description:
                  'Visual dashboards and detailed analytics help you understand your productivity trends and achievement patterns.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className='p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow'
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <h3 className='text-xl font-semibold mb-3'>{feature.title}</h3>
                <p className='text-muted-foreground'>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* How It Works Section */}
        <motion.div
          className='max-w-4xl mx-auto mb-16'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2
            className='text-3xl font-bold text-center mb-12'
            variants={fadeIn}
          >
            How It Works
          </motion.h2>
          <motion.div
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
            variants={staggerContainer}
          >
            {[
              {
                step: '1',
                title: 'Create a Goal',
                desc: 'Define your main goal and target date',
              },
              {
                step: '2',
                title: 'Break It Down',
                desc: 'Split into manageable subgoals',
              },
              {
                step: '3',
                title: 'Track Progress',
                desc: 'Update and monitor your journey',
              },
              {
                step: '4',
                title: 'Achieve More',
                desc: 'Celebrate your successes',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className='text-center'
                variants={scaleIn}
              >
                <motion.div
                  className='w-12 h-12 bg-primaryActive/10 rounded-full flex items-center justify-center mx-auto mb-4'
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className='text-xl font-semibold text-primaryActive'>
                    {item.step}
                  </span>
                </motion.div>
                <h3 className='font-semibold mb-2'>{item.title}</h3>
                <p className='text-sm text-muted-foreground'>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className='text-center bg-card rounded-lg p-8 sm:p-12 mb-16'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={slideIn}
        >
          <h2 className='text-2xl sm:text-3xl font-bold mb-4'>
            Ready to Start Achieving Your Goals?
          </h2>
          <p className='text-muted-foreground mb-8'>
            Join the beta and be among the first to experience Goal Hacker.
          </p>
          {isLoading ? (
            <Button size='lg' disabled>
              Loading...
            </Button>
          ) : !user ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href='/signup'>
                <Button size='lg'>Sign Up for Beta Access</Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href='/goals'>
                <Button size='lg'>View Your Goals</Button>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.footer
          className='text-center text-xs text-muted-foreground py-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className='flex flex-col items-center justify-center gap-1'>
            <p className='text-xs'>
              © {year} Goal Hacker. All rights reserved.
            </p>
            <div className='flex items-center gap-2 text-xs'>
              <Link href='/terms-conditions' className='hover:text-primary'>
                Terms & Conditions
              </Link>
              {' | '}
              <Link href='/privacy-policy' className='hover:text-primary'>
                Privacy Policy
              </Link>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}

function HomePageSkeleton() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-8 w-[200px]' />
      <div className='grid gap-4'>
        <Skeleton className='h-[200px] rounded-xl' />
      </div>
    </div>
  )
}

function HomeContent() {
  return <LandingPageClient />
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent />
    </Suspense>
  )
}
