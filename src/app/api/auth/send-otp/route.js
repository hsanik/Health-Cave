import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { sendOTPEmail } from '@/lib/email'
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

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    console.log('Generating OTP for:', email)

    const client = await clientPromise
    const db = client.db('healthCave')
    const usersCollection = db.collection('users')
    const otpCollection = db.collection('otps')

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    // Store OTP in database
    await otpCollection.updateOne(
      { email },
      {
        $set: {
          email,
          otp,
          otpExpiry,
          attempts: 0,
          createdAt: new Date()
        }
      },
      { upsert: true }
    )

    // Send OTP email
    try {
      await sendOTPEmail(email, otp)
      console.log('OTP email sent successfully to:', email)
    } catch (emailError) {
      console.error('OTP email failed:', emailError)
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json(
      { 
        message: 'OTP sent successfully to your email',
        email: email // Return email for frontend use
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
