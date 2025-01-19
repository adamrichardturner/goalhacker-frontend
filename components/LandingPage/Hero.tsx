import { motion } from 'framer-motion'
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
  const overlapDistance = 80 // Distance for vertical overlap
  const horizontalShift = 50 // Distance for horizontal shift

  return (
    <div className='flex min-h-screen gap-[98] text-white mt-[80]'>
      <div className='flex flex-col gap-[35] w-1/2'>
        <h1 className='text-[40px]'>
          <span className='font-bold'>Track and achieve your goals</span> with
          AI-powered insights
        </h1>

        <p className='w-[75%]'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          tincidunt sagittis eros.
        </p>

        <Button size='lg' className='bg-[#8b00f2] font-semibold max-w-max'>
          Get started
        </Button>
      </div>

      {/* REF: https://www.youtube.com/watch?v=6YOPRk8mTn0 */}
      <motion.div
        variants={variants}
        className='w-1/2 h-1/2'
        initial='hidden'
        animate='visible'
      >
        <div className='img-wrapper relative'>
          {images.map((img, index) => {
            return (
              <motion.div
                variants={variants}
                key={img}
                style={{
                  position: 'absolute',
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
  )
}

export default Hero
