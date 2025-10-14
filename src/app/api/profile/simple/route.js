import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('healthCave')
    const usersCollection = db.collection('users')

    // Fetch user from database
    const user = await usersCollection.findOne({ _id: new ObjectId(session.user.id) })

    if (!user) {
      // Return session data as fallback if user not found in database
      const fallbackUser = {
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
        availability: [],
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
      return NextResponse.json({ user: fallbackUser }, { status: 200 })
    }

    // Merge session data with database data, preferring database data
    const profileUser = {
      _id: user._id,
      name: user.name || session.user.name,
      email: user.email || session.user.email,
      phone: user.phone || '',
      address: user.address || '',
      location: user.location || user.address || '',
      specialization: user.specialization || '',
      bio: user.bio || '',
      experience: user.experience || '',
      education: user.education || '',
      hospital: user.hospital || '',
      licenseNumber: user.licenseNumber || '',
      workingHours: user.workingHours || '',
      availability: [],
      notifications: user.notifications || {
        emailNotifications: true,
        smsNotifications: false,
        appointmentReminders: true,
        marketingEmails: false
      },
      privacy: user.privacy || {
        profileVisibility: true,
        showEmail: false,
        showPhone: false
      }
    }

    return NextResponse.json({ user: profileUser }, { status: 200 })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({
      message: 'Internal server error',
      error: error.message
    }, { status: 500 })
  }
}