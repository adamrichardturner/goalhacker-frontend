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
import { useState, useEffect } from 'react'
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
import { API_URL } from '@/config'
import { useTheme } from 'next-themes'

interface HeaderProps {
  user: User
  loading: boolean
}

const Header = ({ user, loading }: HeaderProps) => {
  const { logout } = useAuth()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [selectedLink, setSelectedLink] = useState('Goals')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const links = [
    { name: 'Goals', href: '/goals' },
    { name: 'Dashboard', href: '/dashboard' },
  ]

  const avatarSrc = user.avatar_url
    ? `${API_URL}${user.avatar_url}`
    : '/avatar.png'

  const logoSrc = !mounted
    ? '/goalhacker-logo.svg'
    : theme === 'dark'
      ? '/goalhacker-logo-dark.svg'
      : '/goalhacker-logo.svg'

  const handleLogout = async () => {
    await logout()
  }

  console.log(user)

  return (
    <header className='w-full bg-card h-[70px] sm:mt-8 sm:rounded-lg p-6 flex justify-between items-center shadow-sm'>
      <div className='hidden sm:flex w-full justify-between items-center'>
        <Link href='/goals'>
          <Image
            src={logoSrc}
            alt='GoalHacker'
            width={150}
            height={30}
            priority
          />
        </Link>
        <div className='flex items-center gap-8'>
          <nav className='flex gap-8'>
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  selectedLink === link.name
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setSelectedLink(link.name)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className='cursor-pointer'>
                <AvatarImage src={avatarSrc} alt={user.username} />
                <AvatarFallback>
                  {user.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem asChild>
                <Link href='/settings'>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
                <SheetTitle className='text-sm text-left font-semibold'>
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
