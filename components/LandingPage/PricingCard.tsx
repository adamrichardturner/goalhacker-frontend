import { cn } from '@/lib/utils'
import { CircleCheck, Flame } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

type Plan = {
  pricingPlan: {
    name: string
    price: number
    period: string
    features: []
    buttonText: string
    popular: boolean
  }
}

const PricingCard = ({ pricingPlan }: Plan) => {
  const { name, price, period, features, buttonText, popular } = pricingPlan

  return (
    <div
      className={`w-full sm:w-max bg-gray-25 rounded-[15] sm:px-[60] sm:py-[40] px-[30] py-[30] ${name === 'Pro' && 'bg-[linear-gradient(90deg,_#0C101D_0%,_#364883_100%)] border-[3px] border-[white] shadow-xl'} `}
    >
      {popular && (
        <Badge className='bg-accent-secondary px-[10] py-[6] mb-[42]'>
          <div className='flex items-center gap-[10]'>
            <Flame size='15' />
            MOST POPULAR
          </div>
        </Badge>
      )}
      <p className='text-h3-desktop mb-[50]'>{name}</p>

      {/* price */}
      <div className='flex items-end gap-[10] mb-[40]'>
        {price !== '$0' && (
          <>
            <p className='text-h2-desktop font-bold'>{price}</p>
            <span>{period}</span>
          </>
        )}
      </div>

      {/* features */}
      {features.map((feature) => (
        <div key={feature} className='flex items-center gap-[15] mb-[20]'>
          <CircleCheck />
          <p
            className={cn(
              'text-h5-desktop',
              feature.includes('Everything') && 'font-bold'
            )}
          >
            {feature}
          </p>
        </div>
      ))}

      <Link href='/signup'>
        <Button
          size='sm'
          className={cn(
            'font-semibold w-full',
            popular ? 'bg-accent-secondary text-white' : 'bg-white text-black'
          )}
          variant='ghost'
        >
          {buttonText}
        </Button>
      </Link>
    </div>
  )
}

export default PricingCard
