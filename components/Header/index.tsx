/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import { motion, useScroll } from 'framer-motion'
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
import { API_URL } from '@/config'
import { useTheme } from 'next-themes'
import BetaButton from './BetaButton'
import { Logo } from '../Logo'
import { Search } from '../Search'
import {
  Settings,
  HelpCircle,
  FileText,
  LogOut,
  Target,
  LayoutDashboard,
} from 'lucide-react'
import { useLogout } from '@/hooks/auth/useLogout'

interface HeaderProps {
  user: User
}

const Header = ({ user }: HeaderProps) => {
  const { logout } = useLogout()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = scrollY.get()
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY < 50)
      setLastScrollY(currentScrollY)
    }

    const unsubscribe = scrollY.on('change', updateScrollDirection)
    return () => unsubscribe()
  }, [scrollY, lastScrollY])

  useEffect(() => {
    setMounted(true)
  }, [])

  const links = [
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ]

  const mobileLinks = [
    ...links,
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

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
    <motion.header
      className='w-full bg-card h-[70px] sm:mt-8 sm:rounded-lg p-6 flex justify-between items-center shadow-sm sm:relative fixed left-0 right-0 top-0'
      initial={{ y: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      style={{
        zIndex: 40,
      }}
    >
      <div className='hidden sm:flex w-full justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Link href='/goals'>
            <Logo size='sm' />
          </Link>
          <BetaButton />
        </div>

        <div className='flex items-center gap-8'>
          <nav className='flex gap-8'>
            {links.map((link) => {
              const isActive =
                link.href === '/goals'
                  ? pathname.startsWith('/goals')
                  : pathname === link.href
              return (
                <motion.div key={link.href} className='relative'>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {isActive && (
                    <motion.div
                      className='absolute h-[1.5px] w-full bg-electricPurple'
                      layoutId='activeSection'
                    />
                  )}
                </motion.div>
              )
            })}
          </nav>

          <Search />

          <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-none'>
              <Avatar className='h-[42px] w-[42px]'>
                <AvatarImage src={avatarSrc} alt={user.first_name || ''} />
                <AvatarFallback>
                  {user.first_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-56 mt-5'
              sideOffset={5}
            >
              <DropdownMenuItem
                asChild
                className={`cursor-pointer py-3 ${pathname === '/settings' ? 'bg-accent' : ''}`}
              >
                <Link href='/settings' className='flex items-center'>
                  <Settings className='mr-2 h-4 w-4' />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className={`cursor-pointer py-3 ${pathname === '/support' ? 'bg-accent' : ''}`}
              >
                <Link href='/support' className='flex items-center'>
                  <HelpCircle className='mr-2 h-4 w-4' />
                  Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className={`cursor-pointer py-3 ${pathname === '/terms-conditions' ? 'bg-accent' : ''}`}
              >
                <Link href='/terms-conditions' className='flex items-center'>
                  <FileText className='mr-2 h-4 w-4' />
                  Terms & Conditions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className='cursor-pointer py-3'
              >
                <LogOut className='mr-2 h-4 w-4' />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='flex sm:hidden w-full items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/goals'>
            <Logo size='sm' />
          </Link>
          <BetaButton />
        </div>

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
            <SheetContent className='top-[70px] sm:hidden flex flex-col justify-between h-[calc(100vh-70px)] bg-background'>
              <SheetHeader>
                <Link href='/settings'>
                  <div className='flex items-center gap-4'>
                    <Avatar className='h-[42px] w-[42px]'>
                      <AvatarImage
                        src={avatarSrc}
                        alt={user.first_name || ''}
                      />
                      <AvatarFallback>
                        {user.first_name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <SheetTitle className='text-sm text-left font-semibold'>
                      Welcome, <br /> {user.first_name}! 👋
                    </SheetTitle>
                  </div>
                </Link>
                <div className='flex pt-8 flex-col items-start gap-8 mt-4'>
                  {mobileLinks.map((link) => {
                    const isActive =
                      link.href === '/goals'
                        ? pathname.startsWith('/goals')
                        : pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-lg font-medium transition-colors hover:text-primary flex items-center ${
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        <link.icon className='mr-2 h-4 w-4' />
                        {link.name}
                      </Link>
                    )
                  })}
                  <Link
                    href='/support'
                    onClick={() => setIsOpen(false)}
                    className='text-lg font-medium text-muted-foreground transition-colors hover:text-primary flex items-center'
                  >
                    <HelpCircle className='mr-2 h-4 w-4' />
                    Support
                  </Link>
                  <Link
                    href='/terms-conditions'
                    onClick={() => setIsOpen(false)}
                    className='text-lg font-medium text-muted-foreground transition-colors hover:text-primary flex items-center'
                  >
                    <FileText className='mr-2 h-4 w-4' />
                    Terms & Conditions
                  </Link>
                </div>
              </SheetHeader>
              <SheetFooter className='flex flex-col gap-4'>
                <div
                  onClick={handleLogout}
                  className='text-lg font-medium text-muted-foreground transition-colors hover:text-primary flex items-center cursor-pointer'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Sign out
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
