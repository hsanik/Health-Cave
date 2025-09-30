'use client'

import { useEffect } from 'react'

export default function ThemeProvider({ children }) {
  useEffect(() => {
    // Ensure theme is applied and listen for system preference changes
    try {
      const storedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark

      document.documentElement.classList.toggle('dark', shouldUseDark)

      // Listen for system theme changes only if user hasn't set a preference
      if (!storedTheme) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e) => {
          // Only update if user hasn't manually set a theme
          if (!localStorage.getItem('theme')) {
            document.documentElement.classList.toggle('dark', e.matches)
          }
        }
        
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      }
    } catch (_) {
    }
  }, [])

  return children
}

