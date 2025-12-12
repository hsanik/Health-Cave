'use client'

import { usePathname } from 'next/navigation'
import NavbarClient from '@/components/nav/navbar-client'
import DashboardNavbar from '@/components/nav/dashboard-navbar'

export default function NavConditional() {
  const pathname = usePathname()
  if (pathname?.startsWith('/dashboard')) {
    return null
  }
  return <NavbarClient />
}
