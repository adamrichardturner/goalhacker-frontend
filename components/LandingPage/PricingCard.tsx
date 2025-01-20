import { CircleCheck, Flame } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

const PricingCard = ({ pricingPlan }) => {
  const { name, price, period, features, buttonText, popular } = pricingPlan

  return (
    <div
      className={`bg-gray-25 rounded-[15] px-[40] py-[40] ${name === 'Pro' && 'bg-[linear-gradient(90deg,_#0C101D_0%,_#364883_100%)] border-[3px] border-[white] shadow-xl'} `}
    >
      {popular && (
        <Badge className='bg-[#FF6B6B] px-[13] py-[6] mb-[42]'>
          <div className='flex items-center'>
            <Flame size='20' />
            MOST POPULAR
          </div>
        </Badge>
      )}
      <h2 className='text-h2-desktop mb-[50]'>{name}</h2>

      {/* price */}
      <div className='flex items-end gap-[10] mb-[40]'>
        {price !== '$0' && (
          <>
            <p className='text-h3-desktop'>{price}</p>
            <span>{period}</span>
          </>
        )}
      </div>

      {/* features */}
      {features.map((feature) => (
        <div key={feature} className='flex items-center gap-[10] mb-[18]'>
          <CircleCheck />
          <p className='text-h5-desktop'>{feature}</p>
        </div>
      ))}

      <Button size='sm' className='bg-white font-semibold w-full text-black'>
        {buttonText}
      </Button>
    </div>
  )
}

export default PricingCard
