/* eslint-disable @next/next/no-img-element */
'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ModeToggle } from '@/components/ThemeSwitcher'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

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
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignIn = () => {
    if (user) {
      router.push('/goals')
    } else {
      router.push('/login')
    }
  }

  const logoSrc = !mounted
    ? '/goalhacker-logo.svg'
    : theme === 'dark'
      ? '/goalhacker-logo-dark.svg'
      : '/goalhacker-logo.svg'

  const year = new Date().getFullYear()

  return (
    <div className='min-h-screen container flex flex-col gap-6 sm:px-4 w-full'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 pt-8 sm:pt-16'>
        <motion.nav
          className='flex justify-end w-full items-center mb-16'
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className='flex items-center gap-4'>
            <ModeToggle />
            <Button variant='ghost' onClick={handleSignIn}>
              {user ? 'Go to Goals' : 'Sign in'}
            </Button>
            <Link href='/signup'>
              <Button>Get Started</Button>
            </Link>
          </div>
        </motion.nav>

        <div className='text-center max-w-3xl flex flex-col gap-4 mx-auto mb-16 py-10'>
          <motion.img
            src={logoSrc}
            alt='Goal Hacker'
            className='h-8 sm:h-12 mb-4'
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
          />
          <motion.h1
            className='text-4xl sm:text-6xl font-bold mb-6'
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Transform Your Goals into{' '}
            <motion.span
              className='text-electricPurple inline-block'
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href='/signup'>
                <Button
                  size='lg'
                  className='bg-gradient-to-r from-electricPurple to-[#FF6B6B]'
                >
                  Register for Beta Access
                </Button>
              </Link>
            </motion.div>
            <p className='text-sm text-muted-foreground mt-2'>
              (...Beta access is free!)
            </p>
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
              title: 'Progress Tracking',
              description:
                'Visual progress bars and statistics help you stay motivated and understand your journey.',
            },
            {
              title: 'Insights Dashboard',
              description:
                'Get valuable insights about your goal completion patterns and productivity trends.',
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
                  className='w-12 h-12 bg-electricPurple/10 rounded-full flex items-center justify-center mx-auto mb-4'
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className='text-xl font-semibold text-electricPurple'>
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href='/signup'>
              <Button size='lg'>Sign Up for Beta Access</Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className='text-center text-sm text-muted-foreground py-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>© {year} Goal Hacker. All rights reserved.</p>
        </motion.footer>
      </div>
    </div>
  )
}
