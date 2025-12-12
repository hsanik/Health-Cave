import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ObjectId } from 'mongodb'

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const {
      name,
      email,
      phone,
      address,
      specialization,
      bio,
      experience,
      education,
      hospital,
      licenseNumber,
      workingHours,
      location,
      notifications,
      privacy,
      image
    } = await request.json()

    const client = await clientPromise
    const db = client.db('healthCave')
    const usersCollection = db.collection('users')

    // Construct update object, only including fields that are provided
    const updateFields = {}
    if (name) updateFields.name = name
    if (email) updateFields.email = email
    if (phone) updateFields.phone = phone
    if (address) updateFields.address = address
    if (location) updateFields.location = location
    if (specialization) updateFields.specialization = specialization
    if (bio) updateFields.bio = bio
    if (experience !== undefined) updateFields.experience = experience
    if (education) updateFields.education = education
    if (hospital) updateFields.hospital = hospital
    if (licenseNumber) updateFields.licenseNumber = licenseNumber
    if (workingHours) updateFields.workingHours = workingHours
    if (notifications) updateFields.notifications = notifications
    if (privacy) updateFields.privacy = privacy
    if (image) updateFields.image = image

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 })
    }

    // Only update local database if there are fields to update
    if (Object.keys(updateFields).length > 0) {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(session.user.id) },
        { $set: updateFields }
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 })
      }
    }

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
