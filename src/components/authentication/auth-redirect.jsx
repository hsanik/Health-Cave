'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthRedirect({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    // Only redirect if user is authenticated and on auth pages
    if (session && (pathname === '/login' || pathname === '/register')) {
      router.replace('/dashboard')
    }
  }, [session, status, router, pathname])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#435ba1] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated and on auth pages, show loading while redirecting
  if (session && (pathname === '/login' || pathname === '/register')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#435ba1] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Redirecting...</p>
        </div>
      </div>
    )
  }

  // User is not authenticated or not on auth pages, render children
  return children
}
