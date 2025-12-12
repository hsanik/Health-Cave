'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  UserCheck,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Heart,
  CalendarPlus,
  FileSearch,
  MessageSquare,
  Activity,
  Stethoscope
} from 'lucide-react'

export default function PatientDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  console.log("PatientDashboard rendered, session:", session);

  useEffect(() => {
    console.log("useEffect triggered, session:", session);
    if (session?.user) {
      console.log("Calling fetchPatientData...");
      fetchPatientData()
    } else {
      console.log("No session user available yet");
    }
  }, [session])

  const fetchPatientData = async () => {
    try {
      setLoading(true)
      
      console.log("=== Patient Dashboard Debug ===");
      console.log("Session user:", session?.user);
      console.log("Session user ID:", session?.user?.id);
      console.log("Session user email:", session?.user?.email);
      
      // Try to fetch user-specific appointments first
      let userAppointments = [];
      
      if (session?.user?.id) {
        try {
          const userAppointmentsRes = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments/user/${session.user.id}`
          );
          userAppointments = userAppointmentsRes.data;
          console.log("Fetched appointments by user ID:", userAppointments.length);
        } catch (error) {
          console.log("Failed to fetch by user ID, trying email filter:", error.message);
        }
      }
      
      // Fallback: fetch all and filter by email if user ID didn't work
      if (userAppointments.length === 0) {
        const appointmentsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`
        );
        
        console.log("Total appointments fetched:", appointmentsRes.data.length);
        
        userAppointments = appointmentsRes.data.filter(
          apt => apt.patientEmail === session?.user?.email || apt.userId === session?.user?.id
        );
        
        console.log("Filtered appointments by email/ID:", userAppointments.length);
      }
      
      console.log("Final user appointments:", userAppointments);

      const totalAppointments = userAppointments.length
      const upcomingAppointments = userAppointments.filter(apt => {
        const appointmentDate = new Date(apt.appointmentDate)
        return appointmentDate > new Date() && apt.status !== 'cancelled'
      }).length
      const completedAppointments = userAppointments.filter(apt => apt.status === 'completed').length
      const totalSpent = userAppointments
        .filter(apt => apt.paymentStatus === 'paid')
        .reduce((sum, apt) => sum + (apt.amount || 160), 0)

      setStats([
        { title: 'Total Appointments', value: totalAppointments.toString(), change: '+2%', trend: 'up', icon: Calendar },
        { title: 'Upcoming Appointments', value: upcomingAppointments.toString(), change: '0%', trend: 'up', icon: Clock },
        { title: 'Completed Visits', value: completedAppointments.toString(), change: '+1%', trend: 'up', icon: UserCheck },
        { title: 'Total Spent', value: `$${totalSpent.toLocaleString()}`, change: '+15%', trend: 'up', icon: DollarSign },
      ])

      // Recent appointments
      const recentAppts = userAppointments
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

      setRecentAppointments(recentAppts)

    } catch (error) {
      console.error('Error fetching patient data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { title: 'Book Appointment', icon: CalendarPlus, color: 'bg-blue-500', href: '/doctors' },
    { title: 'My Appointments', icon: Calendar, color: 'bg-green-500', href: '/dashboard/appointments' },
    { title: 'Medical Records', icon: FileSearch, color: 'bg-purple-500', href: '/dashboard/records' },
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
      {/* Patient Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Patient Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your health and appointments
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
            Welcome back, {session?.user?.name}!
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Track your health journey and manage appointments.
          </p>
        </div>
      </div>

      {/* Patient Stats Grid */}
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
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Patient Quick Actions */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Health Quick Actions
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

      {/* Recent Appointments & Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
              My Recent Appointments
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
                      <Stethoscope className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {appointment.name || 'Doctor'}
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
                <Button 
                  className="mt-4" 
                  onClick={() => router.push('/doctors')}
                >
                  Book Your First Appointment
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Health Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
              Health Overview
            </h4>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <Heart className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                Health metrics will be displayed here
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}