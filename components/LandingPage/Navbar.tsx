import useMobile from '@/hooks/useMobile'
import Link from 'next/link'
import Logo from '../Logo'
import { Button } from '../ui/button'

const links = ['Features', 'Pricing', 'FAQ']

const Navbar = () => {
  const { isMobile } = useMobile()

  return (
    <div className='flex justify-between items-center'>
      <Link href='/'>
        <Logo size='2xl' mode='dark' />
      </Link>
      {/* links */}
      <div className='text-white flex gap-[26px] items-center'>
        {!isMobile &&
          links.map((name) => (
            <Link
              key={name}
              href={`/#${name.toLowerCase()}`}
              className='hover:underline underline-offset-8'
            >
              {name}{' '}
            </Link>
          ))}
        <Link href='/signup'>
          <Button
            size='sm'
            className='bg-accent-secondary font-bold'
            variant='ghost'
          >
            Sign up
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
