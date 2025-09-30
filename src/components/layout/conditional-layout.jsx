'use client'

import { usePathname } from 'next/navigation'
import NavConditional from '@/components/nav/nav-conditional'
import FooterConditional from '@/components/footer/footer-conditional'
import BackToTop from '@/components/back-to-top/back-to-top'
import ChatbotComponent from '@/app/chatbot/ChatbotComponent'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  if (isDashboard) {
    // For dashboard pages, render only the children (no navbar, footer, or main wrapper)
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
