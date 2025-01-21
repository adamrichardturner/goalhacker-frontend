import useMobile from '@/hooks/useMobile'
import { motion } from 'framer-motion'
import {
  Bell,
  Brush,
  ChartBar,
  ListChecks,
  Sparkles,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardTitle } from '../ui/card'
import Section from './Section'

const features = [
  {
    name: 'AI-Powered Insights',
    description:
      'Get intelligent recommendations for goal optimization and personalized strategies for success.',
    icon: Sparkles,
  },
  {
    name: 'Progress Analytics',
    description:
      'Comprehensive dashboards showing individual and team performance metrics, trends, and achievements.',
    icon: ChartBar,
  },
  {
    name: 'Team Management',
    description:
      'Set and track team goals, monitor progress, and provide meaningful feedback to drive performance.',
    icon: Users,
  },
  {
    name: 'Subgoal System',
    description:
      'Break down larger goals into achievable subgoals, making complex objectives more manageable and trackable.',
    icon: ListChecks,
  },
  {
    name: 'Customization',
    description:
      'Personalize your goal tracker with custom categories, motivational wallpapers, and your own images to make it uniquely yours.',
    icon: Brush,
  },
  {
    name: 'Reminders',
    description:
      'Stay on track with customizable reminders and notifications that keep you motivated and focused on your goals.',
    icon: Bell,
  },
]

const section = {
  title: 'Unlock your full potential',
  paragraph:
    'With SMART goal-tracking tools, break down your ambitions into actionable steps and stay on track with personalized features.',
}

const FeatureSection = () => {
  const { isMobile } = useMobile()

  return (
    <Section id='features' title={section.title} paragraph={section.paragraph}>
      {/* CARDS */}
      <motion.div
        className='flex flex-wrap justify-center sm:gap-[50] gap-[30]'
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
      >
        {features.map((feature) => (
          <Card
            key={feature.name}
            className='bg-gray-25 text-white sm:flex sm:items-center justify-center px-[20] py-[20] border-none hover:bg-gray-500'
          >
            {/* <CardHeader>
            </CardHeader> */}

            {isMobile ? (
              <>
                <div className='flex items-center gap-[10]'>
                  {
                    <feature.icon className='text-black bg-white rounded-full w-[45] h-[45] py-[10] px-[10]' />
                  }
                  <CardTitle className='text-h4-mobile'>
                    {feature.name}
                  </CardTitle>
                </div>
                <CardContent className='px-0 py-[10]'>
                  {/* description */}
                  <p className='text-h5-mobile text-sm '>
                    {feature.description}
                  </p>
                </CardContent>
              </>
            ) : (
              // DESKTOP
              <>
                <div className='flex justify-center items-center w-[100] h-[100] text-black bg-white rounded-full'>
                  {<feature.icon className='sm:w-1/2 sm:h-1/2 w-1/3 h-1/3' />}
                </div>

                <CardContent className='w-[70%]'>
                  <CardTitle className='text-h4-desktop mb-[20]'>
                    {feature.name}
                  </CardTitle>

                  {/* description */}
                  <p className='text-h5-desktop text-sm max-w-[400px] mb-6'>
                    {feature.description}
                  </p>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </motion.div>
    </Section>
  )
}

export default FeatureSection
