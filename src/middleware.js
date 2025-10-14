import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
    console.log('Middleware running for:', req.nextUrl.pathname)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        
        // Define which routes require authentication
        const protectedRoutes = ['/dashboard', '/book-appointment', '/chat']
        const isProtectedRoute = protectedRoutes.some(route => 
          pathname.startsWith(route)
        )
        
        // If it's a protected route, user must be authenticated
        if (isProtectedRoute) {
          console.log('Protected route access:', pathname, 'Token exists:', !!token)
          return !!token
        }
        
        // For non-protected routes, allow access
        return true
      },
    },
  }
)

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/book-appointment/:path*',
    '/chat/:path*',
  ]
}
