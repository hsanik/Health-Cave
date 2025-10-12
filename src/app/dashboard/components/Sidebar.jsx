'use client'


import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  X,
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  MessageSquare,
  BarChart3,
  BookText,
  Clock,
  SquareUserRound,
  House,
  UserSearch,
  CreditCard
} from 'lucide-react'

export default function Sidebar({ sidebarOpen, setSidebarOpen, onBackToHome }) {

  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isDoctor, setIsDoctor] = useState(false)


  // Check if user is a doctor - simplified version without API call
  useEffect(() => {
    if (status === 'loading') return

    if (status !== 'authenticated' || !session?.user) {
      setIsDoctor(false)
      return
    }

    // Simple check based on user role or email
    const isDoctorRole = session.user.role === 'doctor'
    const isAdminEmail = ['admin@healthcave.com', 'admin@example.com', 'admin@gmail.com'].includes(session.user.email)

    setIsDoctor(isDoctorRole && !isAdminEmail)
  }, [session, status])

  // Determine user role
  const [userRole, setUserRole] = useState('patient')

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return

    let role = session.user.role || 'patient'

    // Simple role determination without API calls
    if (!session.user.role || session.user.role === 'user') {
      const adminEmails = ['admin@healthcave.com', 'admin@example.com', 'admin@gmail.com']
      if (adminEmails.includes(session.user.email)) {
        role = 'admin'
      } else {
        // Default to patient if no specific role is set
        role = 'patient'
      }
    }

    setUserRole(role)
    setIsDoctor(role === 'doctor')
  }, [session, status])

  // Role-based sidebar items
  const getSidebarItems = () => {
    const commonItems = [
      { icon: Home, label: "Dashboard", href: "/dashboard" },
    ]

    const adminItems = [
      { icon: BookText, label: 'Doctor Applications', href: '/dashboard/makeDoctor' },
      { icon: SquareUserRound, label: 'Doctors', href: '/dashboard/doctorList' },
      { icon: UserSearch, label: 'All Users', href: '/dashboard/allUsers' },
      { icon: Users, label: "Patients", href: "/dashboard/patients" },
      { icon: Calendar, label: "All Appointments", href: "/dashboard/appointments" },
      { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
      { icon: BarChart3, label: "System Analytics", href: "/dashboard/analytics" },
    ]

    const doctorItems = [
      { icon: Calendar, label: "My Appointments", href: "/dashboard/appointments" },
      { icon: Clock, label: "Availability", href: "/dashboard/availability" },
      { icon: Users, label: "My Patients", href: "/dashboard/patients" },
      { icon: FileText, label: "Medical Records", href: "/dashboard/records" },
      { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
      { icon: BarChart3, label: "Practice Analytics", href: "/dashboard/analytics" },
    ]

    const patientItems = [
      { icon: Calendar, label: "My Appointments", href: "/dashboard/appointments" },
      { icon: FileText, label: "Medical Records", href: "/dashboard/records" },
      { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
    ]

    const profileItems = [
      { icon: Settings, label: "Profile", href: "/dashboard/profile" },
      { icon: House, label: "Back To Home", href: "/" },
    ]

    let roleItems = []
    switch (userRole) {
      case 'admin':
        roleItems = adminItems
        break
      case 'doctor':
        roleItems = doctorItems
        break
      case 'patient':
        roleItems = patientItems
        break
      default:
        roleItems = patientItems
    }

    return [...commonItems, ...roleItems, ...profileItems]
  }

  const sidebarItems = getSidebarItems()

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onBackToHome}
          >
            <img
              src="/images/logo01.png"
              alt="HealthCave Logo"
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">HealthCave</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-8 px-4 flex-1">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href || '#'}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    className={`w-full justify-start ${pathname === item.href
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}