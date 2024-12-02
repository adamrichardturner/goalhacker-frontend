'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { User } from '@/types/auth'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  user: User
  loading: boolean
}

const Header = ({ user, loading }: HeaderProps) => {
  const { logout } = useAuth()
  const [selectedLink, setSelectedLink] = useState('Goals')
  const [isOpen, setIsOpen] = useState(false)
  const links = [
    { name: 'Goals', href: '/goals' },
    { name: 'Dashboard', href: '/' },
  ]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className='w-full bg-white h-[70px] sm:mt-8 sm:rounded-lg p-6 flex justify-between items-center shadow-sm'>
      <div className='hidden sm:flex w-full justify-between items-center'>
        <Link href='/goals'>
          <Image
            src='/goalhacker-logo.svg'
            alt='GoalHacker'
            width={126}
            height={14.46}
          />
        </Link>
        <nav className='flex gap-8 items-center'>
          <div className='flex gap-8 items-center'>
            {links.map((link) => (
              <motion.div key={link.name} className='relative'>
                <Link
                  href={link.href}
                  onClick={() => setSelectedLink(link.name)}
                  className={`transition-colors text-sm duration-200 ease-in-out ${
                    selectedLink === link.name
                      ? 'font-[600]'
                      : 'text-primary hover:text-card-foreground'
                  }`}
                >
                  {link.name}
                </Link>
                {selectedLink === link.name && (
                  <motion.div
                    className='absolute bottom-0 h-[1px] bg-[#8B5CF6]'
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-none' asChild>
              <Avatar>
                <AvatarImage src='/profile.jpg' />
                <AvatarFallback>AT</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem>
                <Link href='/account' className='w-full'>
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href='/settings' className='w-full'>
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={loading}>
                {loading ? 'Signing out...' : 'Sign out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
      <div className='sm:hidden flex justify-between items-center w-full'>
        <Link href='/goals'>
          <Image
            src='/goalhacker-logo.svg'
            alt='GoalHacker'
            width={126}
            height={14.46}
          />
        </Link>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>
            <motion.div
              initial={false}
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <Image
                src={isOpen ? '/burger-close.svg' : '/burger-menu.svg'}
                width={20}
                height={20}
                alt={'Burger Menu'}
                className='transition-opacity duration-200'
                style={{
                  opacity: isOpen ? 0.8 : 1,
                }}
              />
            </motion.div>
          </SheetTrigger>
          <SheetContent className='top-[70px] sm:hidden flex flex-col justify-between h-[calc(100vh-70px)] bg-[#f7f7f7]'>
            <SheetHeader>
              <div className='flex items-center gap-4'>
                <Avatar>
                  <AvatarImage src='/profile.jpg' />
                  <AvatarFallback>AT</AvatarFallback>
                </Avatar>
                <SheetTitle className='text-sm font-semibold'>
                  Welcome, {user?.first_name} {user?.last_name}! 👋
                </SheetTitle>
              </div>

              <div className='flex pt-8 flex-col items-start gap-8 mt-4'>
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => {
                      setSelectedLink(link.name)
                      setIsOpen(false)
                    }}
                    className={`text-lg ${
                      selectedLink === link.name
                        ? 'font-[600] border-b-2 border-electricPurple'
                        : 'text-primary hover:text-card-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </SheetHeader>
            <SheetFooter className='flex flex-col gap-4'>
              <span className='text-md text-primary' onClick={handleLogout}>
                {loading ? 'Signing out...' : 'Sign out'}
              </span>
              <Link href='/support'>Support</Link>
              <Link href='/terms-conditions'>Terms & Conditions</Link>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export default Header
