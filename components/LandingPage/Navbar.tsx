import Link from 'next/link'
import Logo from '../Logo'
import { Button } from '../ui/button'

const links = ['Features', 'FAQ']

const Navbar = () => {
  return (
    <div className='flex justify-between items-center'>
      <Link href='/'>
        <Logo size='2xl' mode='dark' />
      </Link>
      {/* links */}
      <div className='text-white flex gap-[26px] items-center'>
        {links.map((name) => (
          <Link key={name} href={`/#${name.toLowerCase()}`}>
            {name}{' '}
          </Link>
        ))}
        <Button
          size='sm'
          className='bg-accent-secondary font-bold'
          variant='ghost'
        >
          Get started
        </Button>
      </div>
    </div>
  )
}

export default Navbar
