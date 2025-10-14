'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, Phone, Mail, Calendar, Activity, User } from 'lucide-react'
import axios from 'axios'
import Image from 'next/image'

export default function PatientsPage() {
  const { data: session } = useSession()
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    if (session?.user) {
      setUserRole(session.user.role || 'user')
      fetchPatients()
    }
  }, [session])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const role = session.user.role || 'user'

      if (role === 'doctor') {
        // Fetch all appointments
        const appointmentsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`
        )

        // Get doctor record to match appointments
        const doctorsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`
        )
        const doctorRecord = doctorsRes.data.find(
          (doc) => doc.email === session.user.email
        )

        // Filter appointments for this doctor
        let doctorAppointments = []
        if (doctorRecord) {
          doctorAppointments = appointmentsRes.data.filter(
            (apt) => apt.doctorId === doctorRecord._id || apt.doctorEmail === session.user.email
          )
        } else {
          // Fallback to email matching
          doctorAppointments = appointmentsRes.data.filter(
            (apt) => apt.doctorEmail === session.user.email
          )
        }

        // Extract unique patients from appointments
        const uniquePatients = {}
        doctorAppointments.forEach((apt) => {
          if (apt.userId && !uniquePatients[apt.userId]) {
            uniquePatients[apt.userId] = {
              id: apt.userId,
              name: apt.patientName,
              email: apt.patientEmail,
              phone: apt.patientPhone,
              appointments: [],
              lastVisit: apt.appointmentDate,
              status: apt.status,
            }
          }
          if (apt.userId && uniquePatients[apt.userId]) {
            uniquePatients[apt.userId].appointments.push(apt)
            // Update last visit if this appointment is more recent
            if (new Date(apt.appointmentDate) > new Date(uniquePatients[apt.userId].lastVisit)) {
              uniquePatients[apt.userId].lastVisit = apt.appointmentDate
            }
          }
        })

        const patientsArray = Object.values(uniquePatients)
        setPatients(patientsArray)
        setFilteredPatients(patientsArray)
      } else if (role === 'admin') {
        // Admin can see all patients from all appointments
        const appointmentsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`
        )

        const uniquePatients = {}
        appointmentsRes.data.forEach((apt) => {
          if (apt.userId && !uniquePatients[apt.userId]) {
            uniquePatients[apt.userId] = {
              id: apt.userId,
              name: apt.patientName,
              email: apt.patientEmail,
              phone: apt.patientPhone,
              appointments: [],
              lastVisit: apt.appointmentDate,
              status: apt.status,
            }
          }
          if (apt.userId && uniquePatients[apt.userId]) {
            uniquePatients[apt.userId].appointments.push(apt)
            if (new Date(apt.appointmentDate) > new Date(uniquePatients[apt.userId].lastVisit)) {
              uniquePatients[apt.userId].lastVisit = apt.appointmentDate
            }
          }
        })

        const patientsArray = Object.values(uniquePatients)
        setPatients(patientsArray)
        setFilteredPatients(patientsArray)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredPatients(patients)
      return
    }

    const filtered = patients.filter(
      (patient) =>
        patient.name?.toLowerCase().includes(query.toLowerCase()) ||
        patient.email?.toLowerCase().includes(query.toLowerCase()) ||
        patient.phone?.includes(query)
    )
    setFilteredPatients(filtered)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
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
          <p className="text-lg font-semibold">Loading patients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {userRole === 'admin' ? 'All Patients' : 'My Patients'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {userRole === 'admin'
              ? 'View and manage all patient records.'
              : 'View and manage your patient records and information.'}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Patients
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {patients.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Patients
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {patients.filter((p) => p.status !== 'cancelled').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Appointments
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {patients.reduce((sum, p) => sum + p.appointments.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Patients List */}
      {filteredPatients.length === 0 ? (
        <Card className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                {searchQuery ? 'No Patients Found' : 'No Patients Yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? 'Try adjusting your search criteria.'
                  : 'Patients will appear here once they book appointments with you.'}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {patient.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          patient.status
                        )}`}
                      >
                        {patient.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {patient.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {patient.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Last Visit: {formatDate(patient.lastVisit)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Appointments:{' '}
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {patient.appointments.length}
                        </span>
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Completed:{' '}
                        <span className="font-semibold text-green-600">
                          {
                            patient.appointments.filter((apt) => apt.status === 'completed')
                              .length
                          }
                        </span>
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Pending:{' '}
                        <span className="font-semibold text-yellow-600">
                          {
                            patient.appointments.filter((apt) => apt.status === 'pending')
                              .length
                          }
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/dashboard/appointments'}
                >
                  View Appointments
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}