'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if we have a stored session in localStorage
    const storedSession = localStorage.getItem('healthcave-session')
    
    if (status === 'loading') {
      setIsLoading(true)
    } else if (status === 'authenticated') {
      setIsLoading(false)
      setIsAuthenticated(true)
      // Store session in localStorage for persistence
      localStorage.setItem('healthcave-session', JSON.stringify({
        user: session.user,
        expires: session.expires
      }))
    } else if (status === 'unauthenticated') {
      setIsLoading(false)
      setIsAuthenticated(false)
      // Clear stored session
      localStorage.removeItem('healthcave-session')
    }
  }, [session, status])

  // Check localStorage on mount for better UX
  useEffect(() => {
    const storedSession = localStorage.getItem('healthcave-session')
    if (storedSession && !session) {
      try {
        const parsed = JSON.parse(storedSession)
        const now = new Date()
        const expires = new Date(parsed.expires)
        
        if (expires > now) {
          // Session is still valid, user should be authenticated
          setIsAuthenticated(true)
        } else {
          // Session expired, clear it
          localStorage.removeItem('healthcave-session')
        }
      } catch (error) {
        localStorage.removeItem('healthcave-session')
      }
    }
  }, [])

  return {
    session,
    status,
    isLoading,
    isAuthenticated,
    user: session?.user || null
  }
}
