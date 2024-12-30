import { Button } from '../ui/button'

const Hero = () => {
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

      <img
        src='/mockups/goalhacker-hero.svg'
        alt='Goal Hacker Dashboard'
        className='w-1/2 h-1/2 object-cover object-top'
      />
    </div>
  )
}

export default Hero
