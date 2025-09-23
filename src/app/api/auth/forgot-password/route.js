import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Processing forgot password request for:', email)

    const client = await clientPromise
    const usersCollection = client.db('healthCave').collection('users')

    // Check if user exists
    const user = await usersCollection.findOne({ email })
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, we\'ve sent a password reset link.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token in database
    await usersCollection.updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpiry
        }
      }
    )

    // Send password reset email
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    try {
      await sendPasswordResetEmail(email, resetLink)
      console.log('Password reset email sent successfully to:', email)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, we\'ve sent a password reset link.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
