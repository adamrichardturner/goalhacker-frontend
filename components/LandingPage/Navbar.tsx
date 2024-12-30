import Link from 'next/link'
import Logo from '../Logo'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'

const links = ['Features', 'FAQ']

const Navbar = () => {
  return (
    <motion.div
      className='flex justify-between items-center'
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      <Logo size='2xl' mode='dark' />
      {/* links */}
      <div className='text-white flex gap-[26px] items-center'>
        {links.map((name) => (
          <Link key={name} href={`/#${name.toLowerCase()}`}>
            {name}{' '}
          </Link>
        ))}
        <Button size='sm' className='bg-[#8B00F2] font-bold'>
          Get started
        </Button>
      </div>
    </motion.div>
  )
}

export default Navbar
