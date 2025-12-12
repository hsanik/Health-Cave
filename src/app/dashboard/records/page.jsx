'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Search, Calendar, User, Stethoscope, AlertCircle } from 'lucide-react'
import axios from 'axios'

export default function RecordsPage() {
  const { data: session } = useSession()
  const [records, setRecords] = useState([])
  const [filteredRecords, setFilteredRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    if (session?.user) {
      setUserRole(session.user.role || 'user')
      fetchRecords()
    }
  }, [session])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const role = session.user.role || 'user'

      // Fetch appointments which contain medical information
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
      } else if (role === 'user') {
        // Regular user sees their own records
        relevantAppointments = appointmentsRes.data.filter(
          (apt) => apt.userId === session.user.id || apt.patientEmail === session.user.email
        )
      } else if (role === 'admin') {
        // Admin sees all records
        relevantAppointments = appointmentsRes.data
      }

      // Filter appointments that have medical information
      const recordsWithInfo = relevantAppointments
        .filter((apt) => apt.symptoms || apt.medicalHistory || apt.status === 'completed')
        .map((apt) => ({
          id: apt._id,
          patientName: apt.patientName,
          patientEmail: apt.patientEmail,
          doctorName: apt.doctorName,
          doctorSpecialization: apt.doctorSpecialization,
          appointmentDate: apt.appointmentDate,
          symptoms: apt.symptoms,
          medicalHistory: apt.medicalHistory,
          status: apt.status,
          appointmentType: apt.appointmentType,
        }))

      setRecords(recordsWithInfo)
      setFilteredRecords(recordsWithInfo)
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredRecords(records)
      return
    }

    const filtered = records.filter(
      (record) =>
        record.patientName?.toLowerCase().includes(query.toLowerCase()) ||
        record.doctorName?.toLowerCase().includes(query.toLowerCase()) ||
        record.symptoms?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredRecords(filtered)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <p className="text-lg font-semibold">Loading medical records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Medical Records
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {userRole === 'doctor'
              ? 'Access and manage patient medical records from appointments.'
              : userRole === 'admin'
              ? 'View all medical records in the system.'
              : 'View your medical history and appointment records.'}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search records by patient, doctor, or symptoms..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Records
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {records.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed Visits
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {records.filter((r) => r.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                With Medical History
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {records.filter((r) => r.medicalHistory).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <Card className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                {searchQuery ? 'No Records Found' : 'No Medical Records Yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? 'Try adjusting your search criteria.'
                  : 'Medical records from appointments will appear here.'}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {userRole === 'doctor' ? record.patientName : `Dr. ${record.doctorName}`}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                      {userRole !== 'user' && (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Patient: {record.patientName}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {record.doctorSpecialization}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatDate(record.appointmentDate)}
                        </span>
                      </div>
                      {record.appointmentType && (
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Type: {record.appointmentType}
                          </span>
                        </div>
                      )}
                    </div>

                    {record.symptoms && (
                      <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Symptoms:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {record.symptoms}
                        </p>
                      </div>
                    )}

                    {record.medicalHistory && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Medical History:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {record.medicalHistory}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}