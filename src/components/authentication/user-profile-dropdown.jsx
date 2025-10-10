'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Swal from 'sweetalert2'

export default function UserProfileDropdown() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You will be signed out of your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, sign out!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      await signOut({ 
        callbackUrl: '/' 
      })
      setIsOpen(false)
      Swal.fire({
        title: 'Signed out!',
        text: 'You have been successfully signed out.',
        icon: 'success',
        confirmButtonColor: '#435ba1',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  const handleDashboard = () => {
    router.push('/dashboard')
    setIsOpen(false)
  }

  // Don't render if session is loading or user is not authenticated
  if (status === 'loading' || !session?.user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={session.user.image || "https://i.postimg.cc/yxzXkbkL/avatar.jpg"}
            alt={session.user.name || "User"}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="hidden md:block text-sm font-medium text-[#515151] dark:text-white">
          {session.user.name || "User"}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={session.user.image || "https://i.postimg.cc/yxzXkbkL/avatar.jpg"}
                  alt={session.user.name || "User"}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#515151] dark:text-white truncate">
                  {session.user.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {session.user.email}
                </p>
                {session.user.role && (
                  <div className="mt-1">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                      session.user.role === 'patient' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : session.user.role === 'doctor'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}>
                      {session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleDashboard}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 mr-3" />
              Dashboard
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
