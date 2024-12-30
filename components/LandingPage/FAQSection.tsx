import { useState } from 'react'
import { AnimatedAccordion } from '../ui/animated-accordion'
import Section from './Section'

const FAQSection = () => {
  const accordionItems = [
    {
      title: 'What is SMART goal tracking?',
      content:
        'SMART goal tracking helps you set goals that are Specific, Measurable, Achievable, Relevant, and Time-bound, making it easier to stay focused and achieve success.',
    },
    {
      title: 'Is the app free to use?',
      content: 'Is the app free to use?',
    },
    {
      title: 'Can I customize my goals?',
      content:
        'Absolutely. You can create custom categories, upload motivational wallpapers, and personalize your experience to fit your goals.',
    },
    {
      title: 'How do reminders and notifications work?',
      content: 'How do reminders and notifications work?',
    },
    {
      title: 'Can I track progress on subgoals?',
      content:
        'Yes! You can break down larger goals into smaller, manageable subgoals and track your progress step by step.',
    },
    {
      title: 'Is my data safe?',
      content:
        'Your data is stored securely, and we never share your information without your consent.',
    },
    {
      title: 'Can I change or delete a goal?',
      content:
        'Yes, you have full control over your goals. Edit or delete them anytime to stay aligned with your priorities.',
    },
    {
      title: 'Does the app work offline?',
      content:
        "Certain features may require an internet connection, but your progress is saved and synced once you're back online.",
    },
  ]

  const [openItem, setOpenItem] = useState(null)

  return (
    <Section id='faq' title='Frequently Asked Questions' className='w-1/2'>
      <AnimatedAccordion
        items={accordionItems.map((item) => {
          return { id: item.title, ...item }
        })}
        openItem={openItem}
        onOpenChange={setOpenItem}
        className='text-white bg-[rgba(140,140,140,0.25)]'
      ></AnimatedAccordion>
    </Section>
  )
}

export default FAQSection
