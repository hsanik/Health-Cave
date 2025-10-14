'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, User, Calendar, Mail, Phone } from 'lucide-react'
import axios from 'axios'

export default function MessagesPage() {
  const { data: session } = useSession()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    if (session?.user) {
      setUserRole(session.user.role || 'user')
      fetchContacts()
    }
  }, [session])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const role = session.user.role || 'user'

      // Fetch appointments to get contacts
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

        // Extract unique patients as contacts
        const uniqueContacts = {}
        relevantAppointments.forEach((apt) => {
          if (apt.userId && !uniqueContacts[apt.userId]) {
            uniqueContacts[apt.userId] = {
              id: apt.userId,
              name: apt.patientName,
              email: apt.patientEmail,
              phone: apt.patientPhone,
              type: 'Patient',
              lastAppointment: apt.appointmentDate,
            }
          }
        })
        setContacts(Object.values(uniqueContacts))
      } else if (role === 'user') {
        // Regular user sees their doctors as contacts
        relevantAppointments = appointmentsRes.data.filter(
          (apt) => apt.userId === session.user.id || apt.patientEmail === session.user.email
        )

        // Extract unique doctors as contacts
        const uniqueContacts = {}
        relevantAppointments.forEach((apt) => {
          if (apt.doctorId && !uniqueContacts[apt.doctorId]) {
            uniqueContacts[apt.doctorId] = {
              id: apt.doctorId,
              name: apt.doctorName,
              email: apt.doctorEmail,
              specialization: apt.doctorSpecialization,
              type: 'Doctor',
              lastAppointment: apt.appointmentDate,
            }
          }
        })
        setContacts(Object.values(uniqueContacts))
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <p className="text-lg font-semibold">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {userRole === 'doctor'
              ? 'Communicate with your patients.'
              : 'Communicate with your doctors.'}
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
              Contact Information
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Below are the contact details of {userRole === 'doctor' ? 'your patients' : 'your doctors'}. 
              You can reach out to them via email or phone for appointment-related communication.
            </p>
          </div>
        </div>
      </Card>

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <Card className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                No Contacts Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {userRole === 'doctor'
                  ? 'Patients will appear here once they book appointments with you.'
                  : 'Doctors will appear here once you book appointments.'}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {contact.type}
                    {contact.specialization && ` - ${contact.specialization}`}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        {contact.email}
                      </a>
                    </div>

                    {contact.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Last Appointment: {formatDate(contact.lastAppointment)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => window.location.href = `mailto:${contact.email}`}
                      className="flex-1"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    {contact.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.href = `tel:${contact.phone}`}
                        className="flex-1"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
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