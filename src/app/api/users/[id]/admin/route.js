import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PATCH(request, { params }) {
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

    const resolvedParams = await params
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('healthCave')
    const usersCollection = db.collection('users')

    // Update user role to admin
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          role: 'admin',
          updatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'User promoted to admin successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}
