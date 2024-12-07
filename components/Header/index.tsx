/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePathname } from 'next/navigation'
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
import BetaButton from './BetaButton'
import { Logo } from '../Logo'

interface HeaderProps {
  user: User
  loading: boolean
}

const Header = ({ user, loading }: HeaderProps) => {
  const { logout } = useAuth()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const links = [
    { name: 'Goals', href: '/goals' },
    { name: 'Insights', href: '/insights' },
  ]

  const mobileLinks = [...links, { name: 'Settings', href: '/settings' }]

  const avatarSrc = user.avatar_url
    ? `${API_URL}${user.avatar_url}`
    : '/avatar.png'

  const burgerSrc = !mounted
    ? '/burger-menu.svg'
    : theme === 'dark'
      ? '/burger-menu-dark.svg'
      : '/burger-menu.svg'

  const burgerCloseSrc = !mounted
    ? '/burger-close.svg'
    : theme === 'dark'
      ? '/burger-close-dark.svg'
      : '/burger-close.svg'

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className='w-full bg-card h-[70px] sm:mt-8 sm:rounded-lg p-6 flex justify-between items-center shadow-sm'>
      <div className='hidden sm:flex w-full justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Link href='/goals'>
            <Logo size='sm' />
          </Link>
          <BetaButton />
        </div>

        <div className='flex items-center gap-8'>
          <nav className='flex gap-8'>
            {links.map((link) => (
              <motion.div key={link.href} className='relative'>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === link.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </Link>
                {pathname === link.href && (
                  <motion.div
                    className='absolute h-[1.5px] w-full bg-electricPurple'
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                )}
              </motion.div>
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
            <DropdownMenuContent align='end' className='w-48 cursor-pointer'>
              <DropdownMenuItem asChild className='cursor-pointer'>
                <Link href='/settings'>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className='cursor-pointer'>
                <Link href='/terms-conditions'>Terms & Conditions</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className='cursor-pointer'>
                <Link href='/support'>Support</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className='cursor-pointer'
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='sm:hidden flex justify-between items-center w-full'>
        <div className='flex items-center gap-4'>
          <Link href='/goals'>
            <Logo size='sm' />
          </Link>
          <BetaButton />
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>
            <motion.div
              initial={false}
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <img
                src={isOpen ? burgerCloseSrc : burgerSrc}
                width={20}
                height={20}
                alt='Burger Menu'
                className='transition-opacity duration-200'
                style={{
                  opacity: isOpen ? 0.8 : 1,
                }}
              />
            </motion.div>
          </SheetTrigger>
          <SheetContent className='top-[70px] sm:hidden flex flex-col justify-between h-[calc(100vh-70px)] bg-background'>
            <SheetHeader>
              <div className='flex items-center gap-4'>
                <Avatar>
                  <AvatarImage src={avatarSrc} alt={user.username} />
                  <AvatarFallback>
                    {user.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <SheetTitle className='text-sm text-left font-semibold'>
                  Welcome, <br /> {user?.first_name} {user?.last_name}! 👋
                </SheetTitle>
              </div>

              <div className='flex pt-8 flex-col items-start gap-8 mt-4'>
                {mobileLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => {
                      setIsOpen(false)
                    }}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      pathname === link.href
                        ? 'text-primary border-b-2 border-electricPurple'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </SheetHeader>
            <SheetFooter className='flex flex-col gap-4'>
              <span
                className='text-md text-primary cursor-pointer'
                onClick={handleLogout}
              >
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
