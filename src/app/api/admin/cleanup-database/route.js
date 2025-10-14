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
    
    // Delete all accounts collection entries (we're not using adapter anymore)
    const accountsResult = await db.collection("accounts").deleteMany({})
    
    // Delete all sessions collection entries (we're using JWT)
    const sessionsResult = await db.collection("sessions").deleteMany({})
    
    // Delete all verification tokens
    const tokensResult = await db.collection("verification_tokens").deleteMany({})

    return NextResponse.json({ 
      message: 'Database cleaned up successfully',
      accountsDeleted: accountsResult.deletedCount,
      sessionsDeleted: sessionsResult.deletedCount,
      tokensDeleted: tokensResult.deletedCount
    })

  } catch (error) {
    console.error('Error cleaning up database:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup database' },
      { status: 500 }
    )
  }
}