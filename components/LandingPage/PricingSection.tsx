import PricingCard from './PricingCard'
import Section from './Section'

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

const PricingSection = () => {
  return (
    <Section title='Pricing'>
      <div className='flex gap-[28] items-center flex-wrap'>
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.name} pricingPlan={plan} />
        ))}
      </div>
    </Section>
  )
}

export default PricingSection
