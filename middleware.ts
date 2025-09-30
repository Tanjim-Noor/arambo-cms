import { NextResponse } from 'next/server'

// Define public routes that don't require authentication
// const publicRoutes = ['/login']

// Define protected routes that require authentication
// const protectedRoutes = ['/dashboard', '/properties', '/trips', '/trucks', '/furniture']

export function middleware() {
  // const { pathname } = request.nextUrl

  // Check if the current path is a protected route
  // const isProtectedRoute = protectedRoutes.some(route => 
  //   pathname.startsWith(route)
  // )

  // Check if the current path is a public route
  // const isPublicRoute = publicRoutes.some(route => 
  //   pathname.startsWith(route)
  // )

  // Get token from session storage (note: this runs on server, so we'll rely on client-side handling)
  // For now, we'll let the client-side auth handle redirects
  // This middleware is mainly for future server-side token validation if needed

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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}