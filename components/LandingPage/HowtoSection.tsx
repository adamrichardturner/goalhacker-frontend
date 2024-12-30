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
          className='flex justifiy-center items-center gap-[40] mt-[97] mb-[225] relative'
        >
          {/* rectangle */}
          {/* TODO: use css var */}
          <div className='w-[156] h-[156] bg-[rgba(140,140,140,0.38)] text-white rounded-full text-[4rem] flex justify-center items-center'>
            {index + 1}
          </div>

          {/* step info */}
          <div className=''>
            <h4 className='text-h4-desktop font-bold mb-[30]'>{step.title}</h4>
            <p className='text-h5-desktop'>{step.description}</p>
          </div>

          {steps[index + 1] && (
            <div className='line w-[2] h-[220] bg-[rgba(140,140,140,0.38)] absolute top-[160] left-[75]'></div>
          )}
        </div>
      ))}
    </Section>
  )
}

export default HowtoSection
