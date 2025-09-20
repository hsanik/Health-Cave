import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Define which routes require authentication
        const protectedRoutes = ['/dashboard']
        const isProtectedRoute = protectedRoutes.some(route => 
          req.nextUrl.pathname.startsWith(route)
        )
        
        // If it's a protected route, user must be authenticated
        if (isProtectedRoute) {
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
    // Add other protected routes here
  ]
}
