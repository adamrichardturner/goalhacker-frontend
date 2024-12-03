import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { config } from '@/config'

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

  // Allow public paths without session
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // If no session and not on public path, redirect to login
  if (!sessionCookie && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If there's a session, verify it's still valid
  if (sessionCookie) {
    try {
      const response = await fetch(`${config.API_URL}/api/users/profile`, {
        credentials: 'include',
        headers: {
          Cookie: `goalhacker.sid=${sessionCookie}`,
        },
      })

      if (!response.ok) {
        // Session is invalid, remove cookie and redirect to homepage
        const redirectResponse = NextResponse.redirect(
          new URL('/', request.url)
        )
        // Delete the cookie with the correct options
        redirectResponse.cookies.set('goalhacker.sid', '', {
          maxAge: 0,
          path: '/',
          domain: 'localhost',
          sameSite: 'none',
          secure: true,
        })
        return redirectResponse
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_unused) {
      // On any error, assume session is invalid
      const redirectResponse = NextResponse.redirect(new URL('/', request.url))
      // Delete the cookie with the correct options
      redirectResponse.cookies.set('goalhacker.sid', '', {
        maxAge: 0,
        path: '/',
        domain: 'localhost',
        sameSite: 'none',
        secure: true,
      })
      return redirectResponse
    }
  }

  return NextResponse.next()
}

// Middleware configuration for Next.js
export const middlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
