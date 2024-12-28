import { Button } from './button'
import Image from 'next/image'

interface GoogleButtonProps {
  onClick?: () => void
  isLoading?: boolean
}

export function GoogleButton({ onClick, isLoading }: GoogleButtonProps) {
  return (
    <Button
      variant='outline'
      onClick={onClick}
      disabled={isLoading}
      className='w-full flex items-center justify-center gap-2'
    >
      {!isLoading && (
        <Image
          src='/google.svg'
          alt='Google logo'
          width={20}
          height={20}
          className='w-5 h-5'
        />
      )}
      {isLoading ? 'Signing in...' : 'Sign in with Google'}
    </Button>
  )
}
