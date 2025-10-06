import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ObjectId } from 'mongodb'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Session in profile API:', session)

    if (!session || !session.user || !session.user.id) {
      console.log('No valid session found')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    // Try both database names to be safe
    let db = client.db('healthCave')
    let usersCollection = db.collection('users')
    
    // Check if user exists in healthCave db, if not try default db
    let userExists = await usersCollection.findOne({ _id: new ObjectId(session.user.id) })
    
    if (!userExists) {
      console.log('User not found in healthCave db, trying default db')
      db = client.db()
      usersCollection = db.collection('users')
    }

    console.log('Looking for user with ID:', session.user.id)

    const user = await usersCollection.findOne(
      { _id: new ObjectId(session.user.id) },
      { 
        projection: { 
          password: 0, // Exclude password from response
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          address: 1,
          specialization: 1,
          bio: 1,
          experience: 1,
          education: 1,
          image: 1,
          hospital: 1,
          licenseNumber: 1,
          workingHours: 1,
          location: 1,
          notifications: 1,
          privacy: 1
        }
      }
    )

    console.log('Found user:', user ? 'Yes' : 'No')

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
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