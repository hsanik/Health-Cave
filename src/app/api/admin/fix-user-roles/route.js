import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import clientPromise from '@/lib/mongodb'

export async function POST(request) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminEmails = [
      'admin@healthcave.com',
      'admin@example.com',
      'admin@gmail.com'
    ]

    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db("healthCave")
    const usersCollection = db.collection("users")
    const doctorsCollection = db.collection("doctors")

    // Get all users
    const users = await usersCollection.find({}).toArray()
    const doctors = await doctorsCollection.find({}).toArray()
    
    let updatedCount = 0

    for (const user of users) {
      let newRole = user.role || "user"
      let needsUpdate = false

      // Check if admin
      if (adminEmails.includes(user.email)) {
        if (newRole !== 'admin') {
          newRole = 'admin'
          needsUpdate = true
        }
      } else {
        // Check if doctor
        const isDoctor = doctors.some(doctor => doctor.email === user.email)
        if (isDoctor && newRole !== 'doctor') {
          newRole = 'doctor'
          needsUpdate = true
        } else if (!isDoctor && newRole === 'doctor') {
          newRole = 'user'
          needsUpdate = true
        }
      }

      // Update if role changed or was missing
      if (needsUpdate || !user.role) {
        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $set: { 
              role: newRole,
              updatedAt: new Date()
            } 
          }
        )
        updatedCount++
      }
    }

    return NextResponse.json({ 
      message: 'User roles updated successfully',
      updatedCount: updatedCount,
      totalUsers: users.length
    })

  } catch (error) {
    console.error('Error fixing user roles:', error)
    return NextResponse.json(
      { error: 'Failed to fix user roles' },
      { status: 500 }
    )
  }
}