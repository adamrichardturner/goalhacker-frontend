import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that should be protected
const protectedPaths = ['/dashboard', '/profile', '/goals']

// Add paths that should be publicly accessible
const publicPaths = [
  '/',
  '/await-verification',
  '/reset-password',
  '/error',
  '/404',
  '/not-found',
]

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const sessionCookie = request.cookies.get('goalhacker.sid')
  const isAuthenticated = !!sessionCookie?.value

  // Skip middleware for API routes and static assets
  if (
    pathname.startsWith('/api') ||
    pathname.includes('_next') ||
    pathname.includes('static')
  ) {
    return NextResponse.next()
  }

  // Handle verify-email access
  if (pathname === '/verify-email') {
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    if (!token || !email) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Handle login page access
  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/goals', request.url))
    }
    return NextResponse.next()
  }

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Protect private paths
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
}
