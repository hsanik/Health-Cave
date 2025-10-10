'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Clock, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
]

export default function AvailabilityManager({ availability = [], onSave, isLoading = false }) {
  console.log('🔍 AvailabilityManager received availability:', availability?.length || 0, 'slots')
  const [availableSlots, setAvailableSlots] = useState(availability.length > 0 ? availability : [
    { day: '', startTime: '', endTime: '', isAvailable: true }
  ])

  // Update internal state when availability prop changes
  useEffect(() => {
    console.log('🔍 AvailabilityManager updating slots with:', availability?.length || 0, 'slots')
    if (availability && availability.length > 0) {
      setAvailableSlots(availability)
    }
  }, [availability])

  const addTimeSlot = () => {
    setAvailableSlots([...availableSlots, { day: '', startTime: '', endTime: '', isAvailable: true }])
  }

  const removeTimeSlot = (index) => {
    if (availableSlots.length > 1) {
      setAvailableSlots(availableSlots.filter((_, i) => i !== index))
    } else {
      toast.error('You must have at least one time slot')
    }
  }

  const updateTimeSlot = (index, field, value) => {
    const updatedSlots = availableSlots.map((slot, i) =>
      i === index ? { ...slot, [field]: value } : slot
    )
    setAvailableSlots(updatedSlots)
  }

  const handleSave = () => {
    // Validate slots
    const validSlots = availableSlots.filter(slot =>
      slot.day && slot.startTime && slot.endTime && slot.isAvailable
    )

    if (validSlots.length === 0) {
      toast.error('Please add at least one valid time slot')
      return
    }

    // Check for duplicate days
    const days = validSlots.map(slot => slot.day)
    if (new Set(days).size !== days.length) {
      toast.error('Each day can only have one time slot')
      return
    }

    onSave(validSlots)
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white">Doctor Availability</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Set your available consultation times</p>
        </div>
      </div>

      <div className="space-y-4">
        {availableSlots.map((slot, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label htmlFor={`day-${index}`}>Day</Label>
                <select
                  id={`day-${index}`}
                  value={slot.day}
                  onChange={(e) => updateTimeSlot(index, 'day', e.target.value)}
                  disabled={isLoading}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select day</option>
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor={`start-${index}`}>Start Time</Label>
                <Input
                  id={`start-${index}`}
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor={`end-${index}`}>End Time</Label>
                <Input
                  id={`end-${index}`}
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`available-${index}`}
                    checked={slot.isAvailable}
                    onCheckedChange={(checked) => updateTimeSlot(index, 'isAvailable', checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor={`available-${index}`} className="text-sm">Available</Label>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeTimeSlot(index)}
                  disabled={isLoading || availableSlots.length === 1}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={addTimeSlot}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Time Slot</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Availability'}
          </Button>
        </div>
      </div>

      {/* Preview of current availability */}
      {availableSlots.some(slot => slot.day && slot.startTime && slot.endTime && slot.isAvailable) && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-800 dark:text-white mb-3">Current Availability Preview</h4>
          <div className="space-y-2">
            {availableSlots
              .filter(slot => slot.day && slot.startTime && slot.endTime && slot.isAvailable)
              .sort((a, b) => {
                const dayOrder = DAYS_OF_WEEK.map(d => d.value)
                return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
              })
              .map((slot, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{slot.day}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </Card>
  )
}
