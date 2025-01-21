import useMobile from '@/hooks/useMobile'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '../ui/button'

const images = [
  '/mockups/goalhacker-hero-1.jpg',
  '/mockups/goalhacker-hero-2.jpg',
  '/mockups/goalhacker-hero-3.jpg',
]

const variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.3,
    },
    y: 0,
  },
}

const Hero = () => {
  const { isMobile } = useMobile()
  const overlapDistance = isMobile ? -10 : 80 // Distance for vertical overlap
  const horizontalShift = 50 // Distance for horizontal shift

  return (
    <div className='sm:min-h-screen flex flex-col sm:gap-[40] text-white mt-[80]'>
      <div className='sm:flex sm:gap-[98]'>
        <div className='flex flex-col gap-[35] sm:w-1/2'>
          <h1 className='sm:text-h1-desktop text-h1-mobile'>
            <span className='font-bold'>Track and achieve your goals</span> with
            AI-powered insights
          </h1>

          <p className='sm:w-[75%]'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            tincidunt sagittis eros.
          </p>
        </div>
        {/* REF: https://www.youtube.com/watch?v=6YOPRk8mTn0 */}
        <motion.div
          variants={variants}
          className='sm:w-1/2 sm:h-1/2 w-[70%] px-[30] py-[30] sm:px-0 sm:py-0'
          initial='hidden'
          animate='visible'
        >
          <div className='img-wrapper relative mt-[40]'>
            {images.map((img, index) => {
              return (
                <motion.div
                  variants={variants}
                  key={img}
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    top: index * overlapDistance, // Offset each image down
                    left: index * horizontalShift, // Offset each image right
                  }}
                >
                  <img src={img} alt='Goal Hacker' className='rounded-[25]' />
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <Link href='/signup'>
        <Button
          size='lg'
          className='bg-accent-secondary font-semibold sm:max-w-max w-full'
          variant='ghost'
        >
          Get started
        </Button>
      </Link>
    </div>
  )
}

export default Hero
