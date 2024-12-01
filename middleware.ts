import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Add paths that should be protected
const protectedPaths = ["/dashboard", "/profile", "/goals"]
// Add paths that should be accessible only to non-authenticated users
const authPaths = ["/login", "/signup", "/forgot-password"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has("connect.sid") // Check for session cookie

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/goals", request.url))
  }

  // Redirect non-authenticated users to login
  if (
    !isAuthenticated &&
    protectedPaths.some((path) => pathname.startsWith(path))
  ) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
