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

    console.log('[forgot] request for:', email)

    const client = await clientPromise
    const usersCollection = client.db('healthCave').collection('users')

    const user = await usersCollection.findOne({ email })

    // Always respond generically to avoid account enumeration, but still continue to simulate success path for existing users
    if (!user) {
      console.log('[forgot] user not found, returning generic message')
      return NextResponse.json(
        { message: "If an account with that email exists, we've sent a password reset link." },
        { status: 200 }
      )
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000)

    await usersCollection.updateOne(
      { email },
      { $set: { resetToken, resetTokenExpiry } }
    )

    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    const result = await sendPasswordResetEmail(email, resetLink)

    if (!result?.success) {
      console.error('[forgot] email send failed', result)
      return NextResponse.json(
        { error: 'Failed to send email', mailer: result },
        { status: 500 }
      )
    }

    console.log('[forgot] email sent ok', { messageId: result.messageId })

    return NextResponse.json(
      { message: "If an account with that email exists, we've sent a password reset link.", mailer: { success: true, messageId: result.messageId } },
      { status: 200 }
    )
  } catch (error) {
    console.error('[forgot] error', { name: error?.name, message: error?.message, stack: error?.stack })
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}
