'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PageSpinner } from '@/components/ui/loading-spinner'
import { determineUserRole } from './utils/roleDetector'
import AdminDashboard from './components/admin/AdminDashboard'
import DoctorDashboard from './components/doctor/DoctorDashboard'
import PatientDashboard from './components/patient/PatientDashboard'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const setupDashboard = async () => {
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
        console.error('Error setting up dashboard:', error)
        setUserRole('patient') // Fallback
      } finally {
        setLoading(false)
      }
    }

    setupDashboard()
  }, [session, status, router])

  if (loading) {
    return <PageSpinner text="Loading your dashboard..." />
  }

  // Render role-specific dashboard component
  switch (userRole) {
    case 'admin':
      return <AdminDashboard />
    case 'doctor':
      return <DoctorDashboard />
    case 'patient':
      return <PatientDashboard />
    default:
      return <PatientDashboard />
  }
}