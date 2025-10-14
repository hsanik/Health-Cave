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
  Stethoscope,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Shield,
  BookText,
  BarChart3,
  UserSearch,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      const [doctorsRes, appointmentsRes, usersRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`),
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`),
        // You might need to create a users endpoint
        Promise.resolve({ data: [] }) // Placeholder for users
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

      setStats([
        { title: 'Total Doctors', value: totalDoctors.toString(), change: '+5%', trend: 'up', icon: Stethoscope },
        { title: 'Total Appointments', value: totalAppointments.toString(), change: '+12%', trend: 'up', icon: Calendar },
        { title: "Today's Appointments", value: todayAppointments.toString(), change: '+8%', trend: 'up', icon: Clock },
        { title: 'Total Revenue', value: `$${revenue.toLocaleString()}`, change: '+23%', trend: 'up', icon: DollarSign },
      ])

      // Mock recent users data
      setRecentUsers([
        { name: 'Dr. Sarah Johnson', time: '2 hours ago', status: 'doctor', type: 'New Doctor Registration' },
        { name: 'Michael Chen', time: '4 hours ago', status: 'user', type: 'New User' },
        { name: 'Emily Davis', time: '6 hours ago', status: 'user', type: 'New User' },
        { name: 'Dr. David Wilson', time: '1 day ago', status: 'doctor', type: 'Doctor Application' },
      ])

    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { title: 'Manage Doctors', icon: Stethoscope, color: 'bg-blue-500', href: '/dashboard/doctorList' },
    { title: 'View Applications', icon: BookText, color: 'bg-green-500', href: '/dashboard/makeDoctor' },
    { title: 'Payment Dashboard', icon: DollarSign, color: 'bg-emerald-500', href: '/dashboard/payments' },
    { title: 'All Users', icon: Users, color: 'bg-purple-500', href: '/dashboard/allUsers' },
    { title: 'System Analytics', icon: BarChart3, color: 'bg-orange-500', href: '/dashboard/analytics' },
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
      {/* Admin Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Admin Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage the entire HealthCave platform
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
            Welcome back, {session?.user?.name}!
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage the entire HealthCave platform from here.
          </p>
        </div>
      </div>

      {/* Admin Content */}
          {/* Admin Stats Grid */}
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
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Admin Quick Actions */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Admin Quick Actions
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

          {/* Recent Users & System Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Recent Users
                </h4>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${
                          user.status === 'doctor' ? 'bg-blue-300' : 'bg-green-300'
                        } dark:bg-gray-600 rounded-full flex items-center justify-center`}>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {user.time}
                        </p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          user.status === 'doctor'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {user.status}
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

            {/* System Overview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                  System Overview
                </h4>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-red-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    System analytics will be displayed here
                  </p>
                </div>
              </div>
            </Card>
          </div>

    </div>
  )
}