import { NextResponse } from 'next/server'
import { sendPasswordResetEmail } from '@/lib/email'

export async function GET() {
  try {
    console.log('Testing email service...')
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)
    
    const testEmail = 'test@example.com'
    const testLink = 'http://localhost:3000/reset-password?token=test123'
    
    const result = await sendPasswordResetEmail(testEmail, testLink)
    
    return NextResponse.json({
      success: true,
      message: 'Email test completed',
      result,
      hasApiKey: !!process.env.RESEND_API_KEY
    })
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
