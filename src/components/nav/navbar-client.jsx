'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X } from 'lucide-react'
import Image from 'next/image'
import UserProfileDropdown from '@/components/authentication/user-profile-dropdown'
import { useAuth } from '@/hooks/useAuth'

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/about', label: 'About' },
  { href: '/music', label: 'Music Therapy' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
  { href: '/doctorApply', label: 'Become A Doctor', roleRestricted: true }, // Only show for users
]

export default function NavbarClient() {
  const { data: session, status } = useSession()
  const [isDark, setIsDark] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { isLoading, isAuthenticated } = useAuth()
  
  // Get user role - only set after session is loaded
  const sessionLoading = status === 'loading'
  const userRole = session?.user?.role || 'user'

  const onDashboard = pathname?.startsWith('/dashboard')

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const dark = stored ? stored === 'dark' : prefersDark
      setIsDark(dark)
      document.documentElement.classList.toggle('dark', dark)
    } catch (_) {}
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
  }

  // ✅ Fixed here — removed ": string"
  const isActiveLink = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Filter links based on user role
  const getVisibleLinks = () => {
    return mainLinks.filter(link => {
      // If link is role-restricted (Become A Doctor)
      if (link.roleRestricted) {
        // Hide during session loading to prevent flash
        if (sessionLoading) {
          return false
        }
        // Only show for regular users or not authenticated
        return userRole === 'user'
      }
      return true
    })
  }

  const visibleLinks = getVisibleLinks()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/60 dark:bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30">
      <nav
        className={`mx-auto w-11/12 grid items-center gap-4 py-3 ${
          onDashboard
            ? 'grid-cols-[1fr]'
            : 'grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr]'
        }`}
      >
        {/* Logo */}
        {!onDashboard && (
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/logo_light.png"
                alt="HealthCave"
                width={200}
                height={50}
                className="block dark:hidden object-contain"
              />
              <Image
                src="/images/logo_dark.png"
                alt="HealthCave"
                width={200}
                height={50}
                className="hidden dark:block object-contain"
              />
            </Link>
          </div>
        )}

        {/* Navigation Links */}
        {!onDashboard && (
          <div className="hidden md:flex items-center justify-center gap-5 text-base font-medium">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 ${
                  isActiveLink(link.href)
                    ? 'bg-[#136afb] text-white shadow-md'
                    : 'text-foreground hover:text-[#136afb]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right-side items */}
        <div className="flex items-center justify-end gap-2 md:gap-3 justify-self-end">
          {mounted && (
            <>
              {isLoading && (
                <div className="hidden md:flex items-center gap-3 animate-pulse">
                  <div className="h-4 w-12 rounded bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-4 w-16 rounded bg-gray-300 dark:bg-gray-600"></div>
                </div>
              )}

              {!isLoading && !isAuthenticated && (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-md text-sm font-medium bg-[#136afb] text-white hover:bg-[#42a5f6] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-md text-sm font-medium bg-[#43d5cb] text-black hover:bg-[#42a5f6] transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}

              {!isLoading && isAuthenticated && <UserProfileDropdown />}
            </>
          )}

          {/* Theme toggle */}
          <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            <Sun
              className={`transition-all ${
                isDark
                  ? 'absolute scale-0 opacity-0'
                  : 'scale-100 opacity-100'
              }`}
            />
            <Moon
              className={`transition-all ${
                isDark
                  ? 'scale-100 opacity-100'
                  : 'absolute scale-0 opacity-0'
              }`}
            />
          </Button>

          {/* Mobile menu toggle */}
          {!onDashboard && (
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Toggle menu"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile dropdown */}
      {!onDashboard && open && (
        <div className="md:hidden">
          <div className="mx-auto w-11/12 pb-3">
            <div className="rounded-xl border bg-background/70 dark:bg-background/30 backdrop-blur-md p-4">
              <div className="flex flex-col gap-3 text-base font-medium">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`px-3 py-1.5 rounded-md transition-all duration-200 ${
                      isActiveLink(link.href)
                        ? 'bg-[#136afb] text-white shadow-md'
                        : 'text-foreground hover:text-[#136afb]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="my-1 h-px bg-border" />

                {!isLoading && !isAuthenticated && (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded-md text-sm font-medium bg-[#136afb] text-white hover:bg-[#42a5f6] transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded-md text-sm font-medium bg-[#43d5cb] text-black hover:bg-[#42a5f6] transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
