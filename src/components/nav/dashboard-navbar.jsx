'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Search } from 'lucide-react'
import UserProfileDropdown from '@/components/authentication/user-profile-dropdown'

export default function DashboardNavbar() {
  const [isDark, setIsDark] = useState(false) // Start with false to match SSR

  useEffect(() => {
    // Sync with current theme on mount
    try {
      const stored = localStorage.getItem('theme')
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const dark = stored ? stored === 'dark' : prefersDark
      setIsDark(dark)
      document.documentElement.classList.toggle('dark', dark)
    } catch (_) {}
  }, [])

  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', next)
    } catch (_) {}
  }

  return (
    <header className="w-full sticky top-0 z-9999 border-b bg-background/60 dark:bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30">
      <div className="w-11/12 mx-auto py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-[#515151] dark:text-white">Dashboard</h1>
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-300">
            <Search className="h-4 w-4" />
            <span>Search…</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserProfileDropdown />
          <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            <Sun className={`transition-all ${isDark ? 'scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`} />
            <Moon className={`transition-all ${isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute'}`} />
          </Button>
        </div>
      </div>
    </header>
  )
}
