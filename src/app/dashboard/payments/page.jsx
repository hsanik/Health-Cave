'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PageSpinner } from '@/components/ui/loading-spinner'
import { determineUserRole } from '../utils/roleDetector'
import PaymentDashboard from '../components/admin/PaymentDashboard'
import { Shield, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function PaymentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const setupPage = async () => {
      if (status === 'loading') return
      
      if (status !== 'authenticated' || !session?.user) {
        router.push('/login')
        return
      }

      try {
        setLoading(true)
        const role = await determineUserRole(session)
        setUserRole(role)
      } catch (error) {
        console.error('Error setting up payments page:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    setupPage()
  }, [session, status, router])

  if (loading) {
    return <PageSpinner text="Loading payments dashboard..." />
  }

  // Only allow admin users to access payments
  if (userRole !== 'admin') {
    return (
      <div className="p-6">
        <Card className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Access Denied
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You don't have permission to access the payments dashboard.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Only administrators can view payment information.
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Payment Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor and manage all payment transactions
            </p>
          </div>
        </div>
      </div>

      {/* Payment Dashboard */}
      <PaymentDashboard />
    </div>
  )
}