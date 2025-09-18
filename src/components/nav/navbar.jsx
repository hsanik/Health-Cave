'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X } from 'lucide-react'
import Image from 'next/image'

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/contact', label: 'Contact' },
  { href: '/dashboard', label: 'Dashboard' },
]

const authLinks = [
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' },
]

export default function Navbar() {
  const [isDark, setIsDark] = useState(false)
  const [open, setOpen] = useState(false)

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
    } catch (_) {
      
    }
    if (next) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <header className="w-full sticky top-0 z-50 border-b bg-background/60 dark:bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30">
      <nav className="mx-auto w-11/12 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center py-3 gap-4">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/images/logo_light.png" alt="HealthCave" width={132} height={36} className="block dark:hidden object-contain" style={{ width: 'auto' }} />
            <Image src="/images/logo_dark.png" alt="HealthCave" width={132} height={36} className="hidden dark:block object-contain" style={{ width: 'auto' }} />
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center gap-4 text-sm">
          {mainLinks.map(link => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-3 justify-self-end">
          <div className="hidden md:flex items-center gap-3">
            {authLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
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
                  <Link key={link.href} href={link.href} className="hover:underline" onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-border my-1" />
                {authLinks.map(link => (
                  <Link key={link.href} href={link.href} className="hover:underline" onClick={() => setOpen(false)}>
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

