'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import axios from 'axios'

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    if (session?.user) {
      setUserRole(session.user.role || 'user')
      fetchAnalytics()
    }
  }, [session])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const role = session.user.role || 'user'

      // Fetch appointments
      const appointmentsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`
      )

      let relevantAppointments = []

      if (role === 'doctor') {
        // Get doctor record
        const doctorsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`
        )
        const doctorRecord = doctorsRes.data.find(
          (doc) => doc.email === session.user.email
        )

        // Filter appointments for this doctor
        if (doctorRecord) {
          relevantAppointments = appointmentsRes.data.filter(
            (apt) => apt.doctorId === doctorRecord._id || apt.doctorEmail === session.user.email
          )
        } else {
          relevantAppointments = appointmentsRes.data.filter(
            (apt) => apt.doctorEmail === session.user.email
          )
        }
      } else if (role === 'admin') {
        relevantAppointments = appointmentsRes.data
      } else {
        relevantAppointments = appointmentsRes.data.filter(
          (apt) => apt.userId === session.user.id || apt.patientEmail === session.user.email
        )
      }

      // Calculate analytics
      const totalAppointments = relevantAppointments.length
      const completedAppointments = relevantAppointments.filter(apt => apt.status === 'completed').length
      const pendingAppointments = relevantAppointments.filter(apt => apt.status === 'pending').length
      const confirmedAppointments = relevantAppointments.filter(apt => apt.status === 'confirmed').length
      const cancelledAppointments = relevantAppointments.filter(apt => apt.status === 'cancelled').length
      
      const totalRevenue = relevantAppointments
        .filter(apt => apt.paymentStatus === 'paid')
        .reduce((sum, apt) => sum + (apt.amount || 0), 0)

      const uniquePatients = new Set(relevantAppointments.map(apt => apt.userId)).size

      // Monthly breakdown
      const monthlyData = {}
      relevantAppointments.forEach(apt => {
        const month = new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        if (!monthlyData[month]) {
          monthlyData[month] = { total: 0, completed: 0, revenue: 0 }
        }
        monthlyData[month].total++
        if (apt.status === 'completed') monthlyData[month].completed++
        if (apt.paymentStatus === 'paid') monthlyData[month].revenue += (apt.amount || 0)
      })

      setAnalytics({
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        confirmedAppointments,
        cancelledAppointments,
        totalRevenue,
        uniquePatients,
        monthlyData,
        completionRate: totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : 0,
        cancellationRate: totalAppointments > 0 ? ((cancelledAppointments / totalAppointments) * 100).toFixed(1) : 0,
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <p className="text-lg font-semibold">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <p className="text-lg font-semibold">No analytics data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {userRole === 'admin' ? 'System Analytics' : userRole === 'doctor' ? 'Practice Analytics' : 'My Analytics'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View insights and performance metrics.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Appointments
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.totalAppointments}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.completedAppointments}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {analytics.completionRate}% completion rate
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        {userRole !== 'user' && (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${analytics.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Unique Patients
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.uniquePatients}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Appointment Status Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Completed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {analytics.completionRate}% of total
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.completedAppointments}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Confirmed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming appointments</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.confirmedAppointments}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Pending</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting confirmation</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.pendingAppointments}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Cancelled</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {analytics.cancellationRate}% cancellation rate
                  </p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.cancelledAppointments}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Monthly Overview
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.monthlyData).slice(-6).map(([month, data]) => (
              <div key={month} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-800 dark:text-white">{month}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {data.total} appointments
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600 dark:text-green-400">
                    {data.completed} completed
                  </span>
                  {userRole !== 'user' && (
                    <span className="text-purple-600 dark:text-purple-400">
                      ${data.revenue.toLocaleString()} revenue
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Performance Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.completionRate}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
          </div>

          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {(100 - parseFloat(analytics.cancellationRate)).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
          </div>

          {userRole !== 'user' && (
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <DollarSign className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                ${analytics.totalAppointments > 0 ? (analytics.totalRevenue / analytics.totalAppointments).toFixed(0) : 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. per Appointment</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}