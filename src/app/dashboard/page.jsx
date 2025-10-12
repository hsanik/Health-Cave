'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageSpinner } from '@/components/ui/loading-spinner'
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  UserCheck,
  MessageSquare,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  User,
  BookText,
  Home,
  Settings,
  Stethoscope,
  Shield,
  Heart,
  Clock,
  DollarSign,
  Activity,
  UserPlus,
  CalendarPlus,
  FileSearch,
  Star
} from 'lucide-react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recentItems: [],
    quickActions: []
  })

  // Determine user role and fetch appropriate data
  useEffect(() => {
    const determineUserRole = async () => {
      if (status === 'loading') return

      if (status !== 'authenticated' || !session?.user) {
        router.push('/login')
        return
      }

      try {
        setLoading(true)

        // Check user role from session or API
        let role = session.user.role || 'patient' // Default to patient

        // If role is not in session, determine based on email/ID
        if (!session.user.role || session.user.role === 'user') {
          // Check if user is a doctor
          try {
            const doctorResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`
            )
            const isDoctor = doctorResponse.data.some(
              doctor => doctor.email === session.user.email
            )

            if (isDoctor) {
              role = 'doctor'
            } else {
              // Check if user is admin (you can define admin emails or use a separate API)
              const adminEmails = ['admin@healthcave.com', 'admin@example.com'] // Define admin emails
              if (adminEmails.includes(session.user.email)) {
                role = 'admin'
              } else {
                role = 'patient'
              }
            }
          } catch (error) {
            console.error('Error determining role:', error)
            role = 'patient' // Default fallback
          }
        }

        setUserRole(role)
        await fetchDashboardData(role)
      } catch (error) {
        console.error('Error in dashboard setup:', error)
        setUserRole('patient') // Fallback
      } finally {
        setLoading(false)
      }
    }

    determineUserRole()
  }, [session, status, router])

  const fetchDashboardData = async (role) => {
    try {
      let stats = []
      let recentItems = []
      let quickActions = []

      switch (role) {
        case 'admin':
          stats = await fetchAdminStats()
          recentItems = await fetchRecentUsers()
          quickActions = getAdminQuickActions()
          break
        case 'doctor':
          stats = await fetchDoctorStats()
          recentItems = await fetchDoctorAppointments()
          quickActions = getDoctorQuickActions()
          break
        case 'patient':
          stats = await fetchPatientStats()
          recentItems = await fetchPatientAppointments()
          quickActions = getPatientQuickActions()
          break
        default:
          stats = []
          recentItems = []
          quickActions = []
      }

      setDashboardData({ stats, recentItems, quickActions })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const fetchAdminStats = async () => {
    try {
      const [doctorsRes, appointmentsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`),
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`)
      ])

      const totalDoctors = doctorsRes.data.length
      const totalAppointments = appointmentsRes.data.length
      const todayAppointments = appointmentsRes.data.filter(apt => {
        const today = new Date().toDateString()
        return new Date(apt.appointmentDate).toDateString() === today
      }).length
      const revenue = appointmentsRes.data
        .filter(apt => apt.paymentStatus === 'paid')
        .reduce((sum, apt) => sum + (apt.amount || 160), 0)

      return [
        { title: 'Total Doctors', value: totalDoctors.toString(), change: '+5%', trend: 'up', icon: Stethoscope },
        { title: 'Total Appointments', value: totalAppointments.toString(), change: '+12%', trend: 'up', icon: Calendar },
        { title: "Today's Appointments", value: todayAppointments.toString(), change: '+8%', trend: 'up', icon: Clock },
        { title: 'Total Revenue', value: `$${revenue.toLocaleString()}`, change: '+23%', trend: 'up', icon: DollarSign },
      ]
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      return []
    }
  }

  const fetchDoctorStats = async () => {
    try {
      const appointmentsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`
      )

      // Filter appointments for this doctor (you might need to adjust based on your data structure)
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

      return [
        { title: 'Total Patients', value: totalPatients.toString(), change: '+12%', trend: 'up', icon: Users },
        { title: "Today's Appointments", value: todayAppointments.toString(), change: '+8%', trend: 'up', icon: Calendar },
        { title: 'Active Consultations', value: activeConsultations.toString(), change: '-3%', trend: 'down', icon: MessageSquare },
        { title: 'Revenue', value: `$${revenue.toLocaleString()}`, change: '+23%', trend: 'up', icon: TrendingUp },
      ]
    } catch (error) {
      console.error('Error fetching doctor stats:', error)
      return []
    }
  }

  const fetchPatientStats = async () => {
    try {
      const appointmentsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`
      )

      const userAppointments = appointmentsRes.data.filter(
        apt => apt.userId === session.user.id
      )

      const totalAppointments = userAppointments.length
      const upcomingAppointments = userAppointments.filter(apt => {
        const appointmentDate = new Date(apt.appointmentDate)
        return appointmentDate > new Date() && apt.status !== 'cancelled'
      }).length
      const completedAppointments = userAppointments.filter(apt => apt.status === 'completed').length
      const totalSpent = userAppointments
        .filter(apt => apt.paymentStatus === 'paid')
        .reduce((sum, apt) => sum + (apt.amount || 160), 0)

      return [
        { title: 'Total Appointments', value: totalAppointments.toString(), change: '+2%', trend: 'up', icon: Calendar },
        { title: 'Upcoming Appointments', value: upcomingAppointments.toString(), change: '0%', trend: 'up', icon: Clock },
        { title: 'Completed Visits', value: completedAppointments.toString(), change: '+1%', trend: 'up', icon: UserCheck },
        { title: 'Total Spent', value: `$${totalSpent.toLocaleString()}`, change: '+15%', trend: 'up', icon: DollarSign },
      ]
    } catch (error) {
      console.error('Error fetching patient stats:', error)
      return []
    }
  }

  const fetchRecentUsers = async () => {
    // Mock data for admin - recent user registrations
    return [
      { name: 'Dr. Sarah Johnson', time: '2 hours ago', status: 'doctor', type: 'New Doctor Registration' },
      { name: 'Michael Chen', time: '4 hours ago', status: 'patient', type: 'New Patient' },
      { name: 'Emily Davis', time: '6 hours ago', status: 'patient', type: 'New Patient' },
      { name: 'Dr. David Wilson', time: '1 day ago', status: 'doctor', type: 'Doctor Application' },
    ]
  }

  const fetchDoctorAppointments = async () => {
    try {
      const appointmentsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`
      )

      return appointmentsRes.data
        .filter(apt => apt.doctorEmail === session.user.email || apt.doctorName?.includes(session.user.name))
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
    } catch (error) {
      console.error('Error fetching doctor appointments:', error)
      return []
    }
  }

  const fetchPatientAppointments = async () => {
    try {
      const appointmentsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`
      )

      return appointmentsRes.data
        .filter(apt => apt.userId === session.user.id)
        .slice(0, 4)
        .map(apt => ({
          name: apt.doctorName,
          time: new Date(apt.appointmentDate).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          status: apt.status,
          type: apt.appointmentType || 'Consultation'
        }))
    } catch (error) {
      console.error('Error fetching patient appointments:', error)
      return []
    }
  }

  const getAdminQuickActions = () => [
    { title: 'Manage Doctors', icon: Stethoscope, color: 'bg-blue-500', href: '/dashboard/doctorList' },
    { title: 'View Applications', icon: BookText, color: 'bg-green-500', href: '/dashboard/makeDoctor' },
    { title: 'All Users', icon: Users, color: 'bg-purple-500', href: '/dashboard/allUsers' },
    { title: 'System Analytics', icon: BarChart3, color: 'bg-orange-500', href: '/dashboard/analytics' },
  ]

  const getDoctorQuickActions = () => [
    { title: 'View Appointments', icon: Calendar, color: 'bg-blue-500', href: '/dashboard/appointments' },
    { title: 'Manage Availability', icon: Clock, color: 'bg-green-500', href: '/dashboard/availability' },
    { title: 'Patient Records', icon: FileText, color: 'bg-purple-500', href: '/dashboard/records' },
    { title: 'Messages', icon: MessageSquare, color: 'bg-orange-500', href: '/dashboard/messages' },
  ]

  const getPatientQuickActions = () => [
    { title: 'Book Appointment', icon: CalendarPlus, color: 'bg-blue-500', href: '/doctors' },
    { title: 'My Appointments', icon: Calendar, color: 'bg-green-500', href: '/dashboard/appointments' },
    { title: 'Medical Records', icon: FileSearch, color: 'bg-purple-500', href: '/dashboard/records' },
    { title: 'Messages', icon: MessageSquare, color: 'bg-orange-500', href: '/dashboard/messages' },
  ]

  const getRoleInfo = () => {
    switch (userRole) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          subtitle: 'Manage the entire HealthCave platform',
          icon: Shield,
          color: 'text-red-600'
        }
      case 'doctor':
        return {
          title: 'Doctor Dashboard',
          subtitle: 'Manage your practice and patients',
          icon: Stethoscope,
          color: 'text-blue-600'
        }
      case 'patient':
        return {
          title: 'Patient Dashboard',
          subtitle: 'Manage your health and appointments',
          icon: Heart,
          color: 'text-green-600'
        }
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Welcome to HealthCave',
          icon: Home,
          color: 'text-gray-600'
        }
    }
  }

  if (loading) {
    return <PageSpinner text="Loading your dashboard..." />
  }

  const roleInfo = getRoleInfo()

  return (
    <div className="p-6">
      {/* Role-based Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-12 h-12 ${roleInfo.color === 'text-red-600' ? 'bg-red-100' : roleInfo.color === 'text-blue-600' ? 'bg-blue-100' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
            <roleInfo.icon className={`w-6 h-6 ${roleInfo.color}`} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {roleInfo.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {roleInfo.subtitle}
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
            Welcome back, {session?.user?.name}!
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            {userRole === 'admin' && "Manage the entire HealthCave platform from here."}
            {userRole === 'doctor' && "Here's what's happening with your practice today."}
            {userRole === 'patient' && "Track your health journey and manage appointments."}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardData.stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <div
                  className={`flex items-center mt-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className={`w-12 h-12 ${userRole === 'admin' ? 'bg-red-100 dark:bg-red-900' :
                userRole === 'doctor' ? 'bg-blue-100 dark:bg-blue-900' :
                  'bg-green-100 dark:bg-green-900'
                } rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${userRole === 'admin' ? 'text-red-600 dark:text-red-400' :
                  userRole === 'doctor' ? 'text-blue-600 dark:text-blue-400' :
                    'text-green-600 dark:text-green-400'
                  }`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dashboardData.quickActions.map((action, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => action.href && router.push(action.href)}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}
                >
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

      {/* Recent Items & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
              {userRole === 'admin' ? 'Recent Users' :
                userRole === 'doctor' ? 'Recent Appointments' :
                  'My Recent Appointments'}
            </h4>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentItems.length > 0 ? (
              dashboardData.recentItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${item.status === 'doctor' ? 'bg-blue-300' :
                      item.status === 'confirmed' ? 'bg-green-300' :
                        item.status === 'pending' ? 'bg-yellow-300' :
                          'bg-gray-300'
                      } dark:bg-gray-600 rounded-full flex items-center justify-center`}>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {item.time}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${item.status === 'confirmed' || item.status === 'doctor'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : item.status === 'pending' || item.status === 'patient'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  No recent activity
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Role-specific Activity Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
              {userRole === 'admin' ? 'System Overview' :
                userRole === 'doctor' ? 'Weekly Activity' :
                  'Health Overview'}
            </h4>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              {userRole === 'admin' ? (
                <Shield className="w-12 h-12 text-red-400 mx-auto mb-2" />
              ) : userRole === 'doctor' ? (
                <Stethoscope className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              ) : (
                <Heart className="w-12 h-12 text-green-400 mx-auto mb-2" />
              )}
              <p className="text-gray-500 dark:text-gray-400">
                {userRole === 'admin' ? 'System analytics will be displayed here' :
                  userRole === 'doctor' ? 'Practice analytics will be displayed here' :
                    'Health metrics will be displayed here'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
