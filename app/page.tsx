'use client'

import React from 'react'
import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/hooks/auth/useUser'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Suspense } from 'react'
import { Users, Brain, BarChart3 } from 'lucide-react'

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

// Add new pricing data
const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Personal goal tracking',
      'Basic goal breakdown',
      'Progress tracking',
      'Up to 5 active goals',
    ],
    buttonText: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    features: [
      'Everything in Free',
      'Unlimited goals',
      'AI-powered insights',
      'Advanced analytics',
      'Priority support',
    ],
    buttonText: 'Try Pro Free',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'per organization',
    features: [
      'Everything in Pro',
      'Team goal management',
      'Performance tracking',
      'Custom integrations',
      'Dedicated support',
      'Employee insights',
    ],
    buttonText: 'Contact Sales',
    popular: false,
  },
]

function LandingPageClient() {
  const { user, isLoading } = useUser()
  const year = new Date().getFullYear()

  return (
    <div className='min-h-screen container pt-20 bg-primary-background text-primary-foreground flex flex-col gap-6 px-0 sm:px-4 w-full'>
      {/* Hero Section - Updated messaging */}
      <div className='container mx-auto sm:px-4'>
        <div className='flex flex-col min-h-screen items-center justify-center w-full mb-16'>
          <div className='text-center flex flex-col gap-4 mx-auto mb-16 py-10'>
            <motion.div
              className='text-md text-white sm:text-2xl font-bold mb-6'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Empower Your Team &{' '}
              <motion.span
                className='text-white inline-block'
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
              >
                Personal Growth
              </motion.span>
            </motion.div>

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
              <Logo size='5xl' mode='dark' />
            </motion.div>

            <motion.p
              className='text-xl sm:text-2xl text-white/90 mb-4'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              The complete platform for goal setting and achievement
            </motion.p>

            <motion.p
              className='text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Whether you&apos;re managing team performance or pursuing personal
              goals, Goal Hacker provides the tools you need to succeed.
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
                        className='bg-primary-foreground text-primary hover:bg-primary-foreground/90'
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
                <Link href='/goals'>
                  <Button
                    size='lg'
                    className='bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                  >
                    Go to Your Goals
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>

          {/* Updated Features Section with Lucide Icons */}
          <motion.div
            className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'
            variants={staggerContainer}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-100px' }}
          >
            {[
              {
                title: 'Team Management',
                description:
                  'Set and track team goals, monitor progress, and provide meaningful feedback to drive performance.',
                icon: Users,
              },
              {
                title: 'AI-Powered Insights',
                description:
                  'Get intelligent recommendations for goal optimization and personalized strategies for success.',
                icon: Brain,
              },
              {
                title: 'Progress Analytics',
                description:
                  'Comprehensive dashboards showing individual and team performance metrics, trends, and achievements.',
                icon: BarChart3,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className='p-8 bg-card rounded-lg text-primary shadow-sm hover:shadow-md transition-all cursor-pointer'
                variants={fadeIn}
                whileHover={{ y: -5 }}
              >
                <div className='text-4xl mb-4 text-primaryActive'>
                  {React.createElement(feature.icon, {
                    size: 40,
                    strokeWidth: 1.5,
                  })}
                </div>
                <h3 className='text-xl font-semibold mb-3'>{feature.title}</h3>
                <p className='text-muted-foreground'>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* New Pricing Section */}
          <motion.div
            className='w-full max-w-6xl mx-auto mb-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
          >
            <motion.h2
              className='text-3xl font-bold text-center mb-12'
              variants={fadeIn}
            >
              Choose Your Plan
            </motion.h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-xl border-2 ${
                    plan.popular
                      ? 'border-primaryActive shadow-lg scale-105'
                      : 'border-border'
                  } relative`}
                  variants={scaleIn}
                  whileHover={{ y: -5 }}
                >
                  <div className='text-center mb-6'>
                    <h3 className='text-xl font-bold mb-2'>{plan.name}</h3>
                    <div className='text-3xl font-bold mb-1'>{plan.price}</div>
                    <div className='text-sm text-muted-foreground'>
                      {plan.period}
                    </div>
                  </div>
                  <ul className='space-y-3 mb-6'>
                    {plan.features.map((feature, i) => (
                      <li key={i} className='flex items-center'>
                        <span className='text-green-500 mr-2'>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primaryActive to-[#FF6B6B]'
                        : ''
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

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
                    className='w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4'
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span className='text-xl font-semibold text-white'>
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
            <h2 className='text-2xl sm:text-3xl text-primary font-bold mb-4'>
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href='/signup'>
                  <Button size='lg'>Sign Up for Beta Access</Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
                <Link href='/terms-conditions' className='hover:text-white'>
                  Terms & Conditions
                </Link>
                {' | '}
                <Link href='/privacy-policy' className='hover:text-white'>
                  Privacy Policy
                </Link>
              </div>
            </div>
          </motion.footer>
        </div>
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
