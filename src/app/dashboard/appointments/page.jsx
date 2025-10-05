'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'

export default function AppointmentsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule and manage patient appointments.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Appointment Scheduling
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Appointment management functionality will be implemented here.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}