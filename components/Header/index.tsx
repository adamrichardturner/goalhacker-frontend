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
import { Search } from '../Search'

interface HeaderProps {
  user: User
}

const Header = ({ user }: HeaderProps) => {
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
    { name: 'Dashboard', href: '/dashboard' },
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
                    layoutId='activeSection'
                  />
                )}
              </motion.div>
            ))}
          </nav>

          <Search />

          <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-none'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={avatarSrc} alt={user.first_name || ''} />
                <AvatarFallback>
                  {user.first_name?.[0]?.toUpperCase()}
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

      <div className='flex sm:hidden w-full items-center justify-between'>
        <Link href='/goals'>
          <Logo size='sm' />
        </Link>

        <div className='flex items-center gap-4'>
          <Search />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className='focus:outline-none'
              >
                <img
                  src={isOpen ? burgerCloseSrc : burgerSrc}
                  alt='Menu'
                  className='w-6 h-6'
                />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className='flex flex-col gap-4 mt-8'>
                {mobileLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      pathname === link.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <SheetFooter className='absolute bottom-8 w-full pr-6'>
                <button
                  onClick={handleLogout}
                  className='w-full text-left text-lg font-medium text-muted-foreground hover:text-primary transition-colors'
                >
                  Log out
                </button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
