import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import clientPromise from '@/lib/mongodb'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const userRole = session.user.role || 'user'
    if (userRole !== 'admin') {
      return NextResponse.json(
        { message: 'Access denied. Admin only.' },
        { status: 403 }
      )
    }

    const client = await clientPromise
    const db = client.db('healthCave')
    const usersCollection = db.collection('users')

    // Fetch all users
    const users = await usersCollection
      .find({})
      .project({ password: 0 }) // Exclude password field
      .toArray()

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}
