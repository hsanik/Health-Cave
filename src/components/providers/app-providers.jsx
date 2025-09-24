'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'

export default function AppProviders({ children }) {
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark

      document.documentElement.classList.toggle('dark', shouldUseDark)
    } catch (_) {
    }
  }, [])

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
