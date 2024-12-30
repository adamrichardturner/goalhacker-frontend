import { cn } from '@/lib/utils'

const Section = ({ id, title, paragraph, className, children }) => {
  return (
    <div id={id} className={cn('mx-auto text-white', className)}>
      <h2 className='text-h2-desktop text-center font-bold mb-[35] '>
        {title}
      </h2>

      {paragraph && (
        <p className='text-h5-desktop text-center mb-[100] w-1/2 mx-auto'>
          {paragraph}
        </p>
      )}

      {children}
    </div>
  )
}

export default Section
