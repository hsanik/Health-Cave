'use client'

import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleBackToHome = () => {
    // Navigate back to the main website home page
    window.location.href = '/'
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        onBackToHome={handleBackToHome} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 min-h-0">
          {children}
        </main>
      </div>
    </div>
  )
}