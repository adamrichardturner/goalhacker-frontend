import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type Section = {
  id?: string
  title?: string
  paragraph?: string
  className?: string
  children?: ReactNode
}

const Section = ({ id, title, paragraph, className, children }: Section) => {
  return (
    <div
      id={id}
      className={cn('mx-auto text-white sm:mt-[80] mt-[50]', className)}
    >
      <h2 className='text-h2-desktop text-center font-bold mb-[35] '>
        {title}
      </h2>

      {paragraph && (
        <p className='text-h5-desktop text-center mb-[100] sm:w-1/2 mx-auto'>
          {paragraph}
        </p>
      )}

      {children}
    </div>
  )
}

export default Section
