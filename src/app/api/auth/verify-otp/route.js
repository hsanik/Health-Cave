import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    console.log('Verifying OTP for:', email)

    const client = await clientPromise
    const db = client.db('healthCave')
    const otpCollection = db.collection('otps')

    // Find OTP record
    const otpRecord = await otpCollection.findOne({ email })

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No OTP found for this email. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.otpExpiry) {
      await otpCollection.deleteOne({ email })
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Check if too many attempts
    if (otpRecord.attempts >= 3) {
      await otpCollection.deleteOne({ email })
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      await otpCollection.updateOne(
        { email },
        { $inc: { attempts: 1 } }
      )
      
      const remainingAttempts = 3 - (otpRecord.attempts + 1)
      return NextResponse.json(
        { 
          error: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
          remainingAttempts
        },
        { status: 400 }
      )
    }

    // OTP is valid - mark email as verified
    await otpCollection.updateOne(
      { email },
      { 
        $set: { 
          verified: true,
          verifiedAt: new Date()
        }
      }
    )

    return NextResponse.json(
      { 
        message: 'Email verified successfully',
        verified: true
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
