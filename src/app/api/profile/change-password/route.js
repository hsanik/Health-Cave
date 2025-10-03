import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Current password and new password are required' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'New password must be at least 6 characters long' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('healthCave')
    const usersCollection = db.collection('users')

    const user = await usersCollection.findOne({ _id: new ObjectId(session.user.id) })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Incorrect current password' }, { status: 401 })
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    await usersCollection.updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { password: hashedNewPassword } }
    )

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
