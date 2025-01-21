import { Button } from '../ui/button'
import Section from './Section'

const CTASection = () => {
  return (
    <Section title='Ready to  Achieve Your Goals?'>
      <div className='sm:w-1/2 w-full mx-auto bg-gray-30 text-white rounded-[15] sm:px-[67] sm:py-[54] px-[50] py-[40] text-center hover:bg-gray-25'>
        <p className='text-left'>
          Take the first step toward turning your ambitions into reality. Join
          thousands who are already crushing their goals with our{' '}
          <span className='font-bold'>SMART tracking tools</span>.
          <br />
          <br />
          <span className='font-bold'>It&apos;s free</span> to get started — no
          credit card required.
        </p>
        <Button
          size='sm'
          className='bg-accent-secondary font-semibold text-white mt-[50] px-[44]'
          variant='ghost'
        >
          Get started For Free
        </Button>
      </div>
    </Section>
  )
}

export default CTASection
