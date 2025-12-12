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

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("healthCave")
    const usersCollection = db.collection("users")
    const accountsCollection = db.collection("accounts")

    // Find the user
    const user = await usersCollection.findOne({ email: email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete all OAuth accounts for this user
    const result = await accountsCollection.deleteMany({ userId: user._id })

    return NextResponse.json({ 
      message: 'OAuth accounts cleared successfully',
      deletedCount: result.deletedCount,
      userEmail: email
    })

  } catch (error) {
    console.error('Error clearing OAuth accounts:', error)
    return NextResponse.json(
      { error: 'Failed to clear OAuth accounts' },
      { status: 500 }
    )
  }
}