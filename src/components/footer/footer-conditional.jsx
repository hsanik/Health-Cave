'use client'

import { usePathname } from 'next/navigation'
import Footer from './footer'

export default function FooterConditional() {
  const pathname = usePathname()
  if (pathname?.startsWith('/dashboard')) return null
  return <Footer />
}
