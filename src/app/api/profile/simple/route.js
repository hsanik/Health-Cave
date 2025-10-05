import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Return session data as profile data for now
    const user = {
      _id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      phone: session.user.phone || '',
      address: session.user.address || '',
      location: session.user.address || '',
      specialization: session.user.specialization || '',
      bio: session.user.bio || '',
      experience: session.user.experience || '',
      education: session.user.education || '',
      hospital: '',
      licenseNumber: '',
      workingHours: '',
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        appointmentReminders: true,
        marketingEmails: false
      },
      privacy: {
        profileVisibility: true,
        showEmail: false,
        showPhone: false
      }
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error.message 
    }, { status: 500 })
  }
}