import { cn } from '@/lib/utils'
import Section from './Section'

const steps = [
  {
    title: 'Define your goal',
    description:
      'Your goal should be defined clearly. It should be achievable, realistic and measurable.',
  },
  {
    title: 'Break it down',
    description: 'What do you want to achieve? Be specific.',
  },
  {
    title: 'Track Progress',
    description:
      "Define how you'll track progress and measure success. Use clear metrics.",
  },
  {
    title: 'Achieve more',
    description: 'Celebrate your successes!',
  },
]
const HowtoSection = () => {
  return (
    <Section title='How to achieve your goals'>
      {steps.map((step, index) => (
        <div
          key={step.title}
          className={cn('flex gap-[40]', index === 0 && 'mt-[97]')}
        >
          {/* rectangle */}
          {/* TODO: use css var */}
          <div>
            <div className='sm:w-[156] sm:h-[156] w-[70] h-[70] bg-gray-40 text-white rounded-full sm:text-[4rem] text-[2rem] flex justify-center items-center'>
              {index + 1}
            </div>

            {steps[index + 1] && (
              <div className='line w-[2] h-[220] bg-gray-40 mx-auto'></div>
            )}
          </div>

          {/* step info */}
          <div>
            <h4 className='text-h4-desktop font-bold sm:mb-[30] mb-[20] sm:mt-[30]'>{step.title}</h4>
            <p className='text-h5-desktop'>{step.description}</p>
          </div>
        </div>
      ))}
    </Section>
  )
}

export default HowtoSection
