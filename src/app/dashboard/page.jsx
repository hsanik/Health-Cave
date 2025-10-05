'use client'

import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
} from 'lucide-react'

export default function Dashboard() {
  const { data: session } = useSession()

  const stats = [
    { title: 'Total Patients', value: '2,847', change: '+12%', trend: 'up', icon: Users },
    { title: 'Today\'s Appointments', value: '24', change: '+8%', trend: 'up', icon: Calendar },
    { title: 'Active Consultations', value: '18', change: '-3%', trend: 'down', icon: MessageSquare },
    { title: 'Revenue', value: '$45,230', change: '+23%', trend: 'up', icon: TrendingUp },
  ]

  const recentAppointments = [
    { name: 'Sarah Johnson', time: '10:00 AM', status: 'confirmed', type: 'General Checkup' },
    { name: 'Michael Chen', time: '11:30 AM', status: 'pending', type: 'Follow-up' },
    { name: 'Emily Davis', time: '2:00 PM', status: 'confirmed', type: 'Consultation' },
    { name: 'David Wilson', time: '3:15 PM', status: 'cancelled', type: 'Emergency' },
  ]

  const quickActions = [
    { title: 'New Appointment', icon: Calendar, color: 'bg-blue-500' },
    { title: 'Add Patient', icon: UserCheck, color: 'bg-green-500' },
    { title: 'Write Prescription', icon: FileText, color: 'bg-purple-500' },
    { title: 'View Reports', icon: BarChart3, color: 'bg-orange-500' },
  ]

  return (
    <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome back, {session?.user?.name || 'Doctor'}!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your practice today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className={`flex items-center mt-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
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

          {/* Quick Actions */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
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

          {/* Recent Appointments */}
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
                {recentAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {appointment.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {appointment.name}
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
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : appointment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Activity Chart Placeholder */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Weekly Activity
                </h4>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Chart will be displayed here</p>
                </div>
              </div>
            </Card>
          </div>
    </div>
  )
}
