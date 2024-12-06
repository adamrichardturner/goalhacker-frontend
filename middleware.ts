import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
]

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('goalhacker.sid')?.value
  const { pathname } = request.nextUrl

  // Check if current path is public
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path))

  // Allow public paths without any checks
  if (isPublicPath) {
    return NextResponse.next()
  }

  // For protected routes, require session
  if (!sessionCookie) {
    // Store the original URL to redirect back after login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const middlewareConfig = {
  matcher: [
    // Exclude api routes and static files
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
