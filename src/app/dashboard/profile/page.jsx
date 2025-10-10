'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import toast from 'react-hot-toast'
import {
  User,
  Shield,
  Bell,
  Camera,
  Save,
  X,
  Stethoscope,
  Loader2
} from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [dataFetched, setDataFetched] = useState(false)

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    specialization: '',
    experience: '',
    hospital: '',
    licenseNumber: '',
    workingHours: ''
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    marketingEmails: false
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    showEmail: false,
    showPhone: false
  })

  // Load cached data and fetch profile data only once
  useEffect(() => {
    setMounted(true)

    if (session?.user) {
      // Try to load cached data first
      const cachedData = localStorage.getItem(`profile_${session.user.id}`)
      if (cachedData && !dataFetched) {
        try {
          const parsed = JSON.parse(cachedData)
          setProfileData(parsed.profileData)
          setNotifications(parsed.notifications)
          setPrivacy(parsed.privacy)
          setDataFetched(true)
          setIsLoadingData(false)
          return
        } catch (error) {
          console.error('Error parsing cached data:', error)
        }
      }

      // Only fetch data if we haven't fetched it yet
      if (!dataFetched) {
        fetchProfileData()
      } else {
        // If we already have data, just stop loading
        setIsLoadingData(false)
      }
    }
  }, [session, dataFetched])

  const fetchProfileData = async (forceRefresh = false) => {
    if (!session?.user) {
      setIsLoadingData(false)
      return
    }

    // Don't fetch if we already have data unless it's a forced refresh
    if (dataFetched && !forceRefresh) {
      setIsLoadingData(false)
      return
    }

    try {
      setIsLoadingData(true)

      const response = await fetch('/api/profile/simple', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        const user = data.user

        setProfileData({
          fullName: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          location: user.location || '',
          bio: user.bio || '',
          specialization: user.specialization || '',
          experience: user.experience || '',
          hospital: user.hospital || '',
          licenseNumber: user.licenseNumber || '',
          workingHours: user.workingHours || ''
        })

        if (user.notifications) {
          setNotifications(user.notifications)
        }

        if (user.privacy) {
          setPrivacy(user.privacy)
        }

        // Mark data as fetched and cache it
        setDataFetched(true)

        // Cache the data
        if (session?.user?.id) {
          const cacheData = {
            profileData: {
              fullName: user.name || '',
              email: user.email || '',
              phone: user.phone || '',
              location: user.location || '',
              bio: user.bio || '',
              specialization: user.specialization || '',
              experience: user.experience || '',
              hospital: user.hospital || '',
              licenseNumber: user.licenseNumber || '',
              workingHours: user.workingHours || ''
            },
            notifications: user.notifications || notifications,
            privacy: user.privacy || privacy
          }
          localStorage.setItem(`profile_${session.user.id}`, JSON.stringify(cacheData))
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to fetch profile data:', response.status, errorData)

        // If user not found, just use session data as fallback
        if (response.status === 404 && session?.user) {
          setProfileData(prev => ({
            ...prev,
            fullName: session.user.name || '',
            email: session.user.email || ''
          }))
          setDataFetched(true)
          toast.info('Using basic profile data. Complete your profile to save additional information.')
        } else {
          toast.error('Failed to load profile data')
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)

      // Fallback to session data if API fails
      if (session?.user) {
        setProfileData(prev => ({
          ...prev,
          fullName: session.user.name || '',
          email: session.user.email || ''
        }))
        setDataFetched(true)
        toast.warning('Could not connect to server. Using basic profile data.')
      } else {
        toast.error('Failed to load profile data')
      }
    } finally {
      setIsLoadingData(false)
    }
  }

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  // Only show loading spinner if we're actually loading and don't have any data yet
  if (isLoadingData && !dataFetched) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading profile data...</p>
          </div>
        </div>
      </div>
    )
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updateData = {
        name: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        specialization: profileData.specialization,
        experience: profileData.experience,
        hospital: profileData.hospital,
        licenseNumber: profileData.licenseNumber,
        workingHours: profileData.workingHours,
        notifications: notifications,
        privacy: privacy
      }

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        await response.json()
        toast.success('Profile updated successfully!')

        // Refresh the profile data with force refresh
        await fetchProfileData(true)
      } else {
        const error = await response.json()
        toast.error(`Failed to update profile: ${error.message}`)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCancel = () => {
    // Reset form to original data or redirect
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      // Refresh the page or reset form data
      window.location.reload()
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Sticky Save Button */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 pb-4 mb-6">
        <div className="flex justify-end space-x-3">
          <Button variant="outline" type="button" disabled={isLoading} onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleProfileUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6 relative">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-lg">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Updating profile...</span>
              </div>
            </div>
          )}
          {/* Basic Information */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Basic Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your personal details</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            </form>
          </Card>

          {/* Professional Information */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Stethoscope className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Professional Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your medical practice details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={profileData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  placeholder="e.g., Cardiology, Pediatrics"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  value={profileData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="e.g., 10 years"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="hospital">Hospital/Clinic</Label>
                <Input
                  id="hospital"
                  value={profileData.hospital}
                  onChange={(e) => handleInputChange('hospital', e.target.value)}
                  placeholder="Your workplace"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={profileData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  placeholder="Medical license number"
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="workingHours">Working Hours</Label>
                <Input
                  id="workingHours"
                  value={profileData.workingHours}
                  onChange={(e) => handleInputChange('workingHours', e.target.value)}
                  placeholder="e.g., Mon-Fri 9:00 AM - 5:00 PM"
                  disabled={isLoading}
                />
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Notification Preferences</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose how you want to be notified</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via SMS</p>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, smsNotifications: checked }))
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Appointment Reminders</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get reminded about upcoming appointments</p>
                </div>
                <Switch
                  checked={notifications.appointmentReminders}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, appointmentReminders: checked }))
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Privacy Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Control your privacy preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Make your profile visible to patients</p>
                </div>
                <Switch
                  checked={privacy.profileVisibility}
                  onCheckedChange={(checked) =>
                    setPrivacy(prev => ({ ...prev, profileVisibility: checked }))
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Email</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Display email on public profile</p>
                </div>
                <Switch
                  checked={privacy.showEmail}
                  onCheckedChange={(checked) =>
                    setPrivacy(prev => ({ ...prev, showEmail: checked }))
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Phone</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Display phone number on public profile</p>
                </div>
                <Switch
                  checked={privacy.showPhone}
                  onCheckedChange={(checked) =>
                    setPrivacy(prev => ({ ...prev, showPhone: checked }))
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
          </Card>

        </div>

        {/* Profile Picture & Basic Info - Moved to Right */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-fit sticky top-6 relative">
            {/* Loading Overlay for Profile Card */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-48 h-48 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-48 h-48 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-24 h-24 text-white" />
                  )}
                </div>
                <Button
                  size="sm"
                  className="absolute bottom-2 right-2 rounded-full w-12 h-12 p-0"
                >
                  <Camera className="w-5 h-5" />
                </Button>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                {session?.user?.name || 'User Name'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                {session?.user?.email || 'user@example.com'}
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg py-2 px-4">
                  <Stethoscope className="w-4 h-4" />
                  <span>Healthcare Professional</span>
                </div>
                
                {/* User Role Display */}
                <div className="flex items-center justify-center">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                    session?.user?.role === 'patient' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : session?.user?.role === 'doctor'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    <User className="w-4 h-4 mr-1" />
                    Role: {session?.user?.role ? session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1) : 'User'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}