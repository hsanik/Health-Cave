'use client'

import { usePathname } from 'next/navigation'
import NavConditional from '@/components/nav/nav-conditional'
import FooterConditional from '@/components/footer/footer-conditional'
import BackToTop from '@/components/back-to-top/back-to-top'
import ChatbotComponent from '@/app/chatbot/ChatbotComponent'
import { useEffect, useState } from 'react'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')
  const [isNotFound, setIsNotFound] = useState(false)

  useEffect(() => {
    // Check if we're on a not-found page by looking for the NotFound component
    // This will be true when the not-found.jsx component is rendered
    const checkNotFound = () => {
      const isNotFoundPage = document.querySelector('[data-not-found-page]')
      setIsNotFound(!!isNotFoundPage)
    }
    
    checkNotFound()
    // Recheck on pathname change
    const timer = setTimeout(checkNotFound, 0)
    return () => clearTimeout(timer)
  }, [pathname])

  if (isDashboard || isNotFound) {
    // For dashboard and not-found pages, render only the children (no navbar, footer, or main wrapper)
    return (
      <>
        {children}
        <div className="chatbot-container">
          <ChatbotComponent />
        </div>
        <BackToTop />
      </>
    )
  }

  // For non-dashboard pages, render with navbar, footer, and main wrapper
  return (
    <>
      <NavConditional />
      <main className="mx-auto w-11/12 py-6">
        {children}
      </main>
      <div className="chatbot-container">
        <ChatbotComponent />
      </div>
      <FooterConditional />
      <BackToTop />
    </>
  )
}
