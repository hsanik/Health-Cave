'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession, SessionProvider } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X } from 'lucide-react'
import Image from 'next/image'
import UserProfileDropdown from '@/components/authentication/user-profile-dropdown'

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const authLinks = [
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' },
]

function NavbarContent() {
  const [isDark, setIsDark] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme')
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const dark = stored ? stored === 'dark' : prefersDark
      setIsDark(dark)
    } catch (_) {
      
    }
  }, [])

  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', next)
    } catch (_) {
      
    }
  }

  // Helper function to check if a link is active
  const isActiveLink = (href) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="w-full sticky top-0 z-9999 border-b bg-background/60 dark:bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30">
      <nav className="w-11/12 mx-auto grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center py-3 gap-4">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/images/logo_light.png" alt="HealthCave" width={172} height={36} className="block dark:hidden object-contain" />
            <Image src="/images/logo_dark.png" alt="HealthCave" width={172} height={36} className="hidden dark:block object-contain" />
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center gap-4 text-sm">
          {mainLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`transition-colors ${
                isActiveLink(link.href) 
                  ? 'text-primary font-medium underline' 
                  : 'text-foreground hover:underline'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-3 justify-self-end">
          {/* Show auth links only when user is not logged in */}
          {!session && (
            <div className="hidden md:flex items-center gap-3">
              {authLinks.map(link => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`text-sm transition-colors ${
                    isActiveLink(link.href) 
                      ? 'text-primary font-medium underline' 
                      : 'text-foreground hover:underline'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
          
          {/* Show user dropdown when user is logged in */}
          {session && <UserProfileDropdown />}
          <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            <Sun className={`transition-all ${isDark ? 'scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`} />
            <Moon className={`transition-all ${isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute'}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="transition-transform" /> : <Menu className="transition-transform" />}
          </Button>
        </div>
      </nav>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden">
          <div className="mx-auto w-11/12 pb-3">
            <div className="rounded-xl border bg-background/70 dark:bg-background/30 backdrop-blur-md p-4">
              <div className="flex flex-col gap-3 text-sm">
                {mainLinks.map(link => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={`transition-colors ${
                      isActiveLink(link.href) 
                        ? 'text-primary font-medium underline' 
                        : 'text-foreground hover:underline'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-border my-1" />
                {/* Show auth links in mobile menu only when user is not logged in */}
                {!session && authLinks.map(link => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={`transition-colors ${
                      isActiveLink(link.href) 
                        ? 'text-primary font-medium underline' 
                        : 'text-foreground hover:underline'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default function NavbarClient() {
  return (
    <SessionProvider>
      <NavbarContent />
    </SessionProvider>
  )
}
