'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Stethoscope,
  Clock,
  FileText,
  Activity,
  DollarSign
} from 'lucide-react'

export default function DoctorDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctorData()
  }, [])

  const fetchDoctorData = async () => {
    try {
      setLoading(true)
      
      const appointmentsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`
      )
      
      // Filter appointments for this doctor
      const doctorAppointments = appointmentsRes.data.filter(
        apt => apt.doctorEmail === session.user.email || apt.doctorName?.includes(session.user.name)
      )

      const totalPatients = new Set(doctorAppointments.map(apt => apt.userId)).size
      const todayAppointments = doctorAppointments.filter(apt => {
        const today = new Date().toDateString()
        return new Date(apt.appointmentDate).toDateString() === today
      }).length
      const activeConsultations = doctorAppointments.filter(apt => apt.status === 'confirmed').length
      const revenue = doctorAppointments
        .filter(apt => apt.paymentStatus === 'paid')
        .reduce((sum, apt) => sum + (apt.amount || 160), 0)

      setStats([
        { title: 'Total Patients', value: totalPatients.toString(), change: '+12%', trend: 'up', icon: Users },
        { title: "Today's Appointments", value: todayAppointments.toString(), change: '+8%', trend: 'up', icon: Calendar },
        { title: 'Active Consultations', value: activeConsultations.toString(), change: '-3%', trend: 'down', icon: MessageSquare },
        { title: 'Revenue', value: `$${revenue.toLocaleString()}`, change: '+23%', trend: 'up', icon: TrendingUp },
      ])

      // Recent appointments
      const recentAppts = doctorAppointments
        .slice(0, 4)
        .map(apt => ({
          name: apt.patientName,
          time: new Date(apt.appointmentDate).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
          }),
          status: apt.status,
          type: apt.appointmentType || 'Consultation'
        }))

      setRecentAppointments(recentAppts)

    } catch (error) {
      console.error('Error fetching doctor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { title: 'View Appointments', icon: Calendar, color: 'bg-blue-500', href: '/dashboard/appointments' },
    { title: 'Manage Availability', icon: Clock, color: 'bg-green-500', href: '/dashboard/availability' },
    { title: 'Patient Records', icon: FileText, color: 'bg-purple-500', href: '/dashboard/records' },
    { title: 'Messages', icon: MessageSquare, color: 'bg-orange-500', href: '/dashboard/messages' },
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Doctor Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Doctor Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your practice and patients
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
            Welcome back, Dr. {session?.user?.name}!
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your practice today.
          </p>
        </div>
      </div>

      {/* Doctor Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <div className={`flex items-center mt-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Doctor Quick Actions */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Practice Quick Actions
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(action.href)}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {action.title}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Appointments & Practice Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
              Recent Appointments
            </h4>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentAppointments.length > 0 ? (
              recentAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${
                      appointment.status === 'confirmed' ? 'bg-green-300' :
                      appointment.status === 'pending' ? 'bg-yellow-300' :
                      'bg-gray-300'
                    } dark:bg-gray-600 rounded-full flex items-center justify-center`}>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {appointment.name?.split(' ').map((n) => n[0]).join('') || 'P'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {appointment.name || 'Patient'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {appointment.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {appointment.time}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  No recent appointments
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Practice Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
              Practice Activity
            </h4>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <Stethoscope className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                Practice analytics will be displayed here
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}