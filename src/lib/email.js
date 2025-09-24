import { Resend } from 'resend'

// Initialize Resend with API key (with fallback for development)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendPasswordResetEmail(email, resetLink) {
  try {
    // If no Resend API key, just log the email for development
    if (!resend) {
      console.log('=== PASSWORD RESET EMAIL (Development Mode) ===')
      console.log('To:', email)
      console.log('Subject: Reset Your Password - HealthCave')
      console.log('Reset Link:', resetLink)
      console.log('===============================================')
      return { success: true, message: 'Email logged to console (development mode)' }
    }

    const { data, error } = await resend.emails.send({
      from: 'HealthCave <onboarding@resend.dev>', // Using Resend's default domain for development
      to: [email],
      subject: 'Reset Your Password - HealthCave',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #435ba1 0%, #4c69c6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">HealthCave</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your Trusted Healthcare Platform</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #435ba1; margin-top: 0;">Reset Your Password</h2>
            
            <p>Hello,</p>
            
            <p>We received a request to reset your password for your HealthCave account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #435ba1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">
                Reset My Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons.
            </p>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetLink}" style="color: #435ba1; word-break: break-all;">${resetLink}</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 HealthCave. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error('Failed to send email')
    }

    console.log('Password reset email sent successfully:', data)
    return data
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

export async function sendWelcomeEmail(email, name) {
  try {
    // If no Resend API key, just log the email for development
    if (!resend) {
      console.log('=== WELCOME EMAIL (Development Mode) ===')
      console.log('To:', email)
      console.log('Name:', name)
      console.log('========================================')
      return { success: true, message: 'Email logged to console (development mode)' }
    }

    const { data, error } = await resend.emails.send({
      from: 'HealthCave <onboarding@resend.dev>', // Using Resend's default domain for development
      to: [email],
      subject: 'Welcome to HealthCave! 🏥',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to HealthCave</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #435ba1 0%, #4c69c6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏥 HealthCave</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your Trusted Healthcare Platform</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #435ba1; margin-top: 0;">Welcome to HealthCave, ${name}! 🎉</h2>
            
            <p>Thank you for joining HealthCave! We're excited to have you as part of our healthcare community.</p>
            
            <p>With your HealthCave account, you can:</p>
            <ul style="color: #666;">
              <li>📅 Book appointments with qualified doctors</li>
              <li>📋 Access your medical records</li>
              <li>💊 Manage your prescriptions</li>
              <li>💬 Get health advice from professionals</li>
              <li>📱 Use our mobile-friendly platform</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" style="background-color: #435ba1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                Get Started
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If you have any questions or need assistance, don't hesitate to contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              Thank you for choosing HealthCave for your healthcare needs.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 HealthCave. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      throw new Error('Failed to send welcome email')
    }

    console.log('Welcome email sent successfully:', data)
    return data
  } catch (error) {
    console.error('Welcome email sending error:', error)
    throw error
  }
}
