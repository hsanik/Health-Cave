'use client'

import { useEffect } from 'react'

export default function ThemeProvider({ children }) {
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark

      document.documentElement.classList.toggle('dark', shouldUseDark)
    } catch (_) {
    }
  }, [])

  return children
}

