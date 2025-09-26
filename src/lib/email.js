import nodemailer from 'nodemailer'

const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@example.com'
const SMTP_USER = process.env.SMTP_USER || EMAIL_FROM
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = Number(process.env.SMTP_PORT || 465)
const SMTP_SECURE = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : SMTP_PORT === 465

function createSmtpTransporter() {
	if (!SMTP_USER || !SMTP_PASS) {
		console.log('[mailer] Missing SMTP envs. SMTP_USER or SMTP_PASS not set.')
		return null
	}

	console.log('[mailer] Creating transporter', { host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_SECURE, user: maskEmail(SMTP_USER) })
	return nodemailer.createTransport({
		host: SMTP_HOST,
		port: SMTP_PORT,
		secure: SMTP_SECURE,
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASS,
		},
	})
}

function maskEmail(email) {
	if (!email) return ''
	const [u, d] = email.split('@')
	return `${u?.slice(0, 2)}***@${d}`
}

export async function sendMailRaw({ to, subject, html, text }) {
	const transporter = createSmtpTransporter()

	if (!transporter) {
		console.log('[mailer] Dev mode fallback. Email not sent.')
		return { success: false, dev: true, reason: 'missing_smtp_env' }
	}

	try {
		console.log('[mailer] sendMail -> start', { to: maskEmail(to), subject })
		const info = await transporter.sendMail({
			from: `HealthCave <${EMAIL_FROM}>`,
			to,
			subject,
			text,
			html,
		})
		console.log('[mailer] sendMail -> success', { messageId: info?.messageId, response: info?.response })
		return { success: true, messageId: info?.messageId, response: info?.response }
	} catch (error) {
		console.error('[mailer] sendMail -> error', {
			name: error?.name,
			code: error?.code,
			message: error?.message,
			stack: error?.stack,
		})
		return { success: false, error: { name: error?.name, code: error?.code, message: error?.message } }
	}
}

export async function sendPasswordResetEmail(email, resetLink) {
	const subject = 'Reset Your Password - HealthCave'
	const text = `Hello,\n\nWe received a request to reset your password for your HealthCave account. If you made this request, click the link below to reset your password:\n\n${resetLink}\n\nImportant: This link will expire in 1 hour for security reasons.\n\nIf you didn't request a password reset, please ignore this email. Your password will remain unchanged.\n\nBest regards,\nHealthCave Team`
	const html = `
		<!DOCTYPE html>
		<html>
		<head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${subject}</title></head>
		<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">
			<div style="background:linear-gradient(135deg,#435ba1 0%,#4c69c6 100%);padding:24px;border-radius:10px 10px 0 0;text-align:center;color:#fff;">
				<h1 style="margin:0;font-size:24px;">HealthCave</h1>
				<p style="margin:6px 0 0;opacity:.9;">Your Trusted Healthcare Platform</p>
			</div>
			<div style="background:#fff;padding:28px;border-radius:0 0 10px 10px;box-shadow:0 4px 6px rgba(0,0,0,.08);">
				<h2 style="color:#435ba1;margin-top:0;">Reset Your Password</h2>
				<p>We received a request to reset your password. If you made this request, click the button below to reset your password:</p>
				<div style="text-align:center;margin:24px 0;">
					<a href="${resetLink}" style="background-color:#435ba1;color:#fff;padding:12px 20px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;">Reset My Password</a>
				</div>
				<p style="color:#666;font-size:14px;"><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
				<p style="color:#666;font-size:14px;">If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
			</div>
			<div style="text-align:center;margin-top:12px;color:#999;font-size:12px;">© ${new Date().getFullYear()} HealthCave. All rights reserved.</div>
		</body>
		</html>
	`

	return sendMailRaw({ to: email, subject, text, html })
}

export async function sendOTPEmail(email, otp) {
	const subject = 'Your HealthCave Verification Code'
	const text = `Hello,\n\nYour HealthCave verification code is: ${otp}\n\nThis code will expire in 10 minutes. If you didn't create an account, please ignore this email.\n\nBest regards,\nHealthCave Team`
	const html = `
		<!DOCTYPE html>
		<html>
		<head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${subject}</title></head>
		<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">
			<div style="background:linear-gradient(135deg,#435ba1 0%,#4c69c6 100%);padding:24px;border-radius:10px 10px 0 0;text-align:center;color:#fff;">
				<h1 style="margin:0;font-size:24px;">HealthCave</h1>
				<p style="margin:6px 0 0;opacity:.9;">Your Trusted Healthcare Platform</p>
			</div>
			<div style="background:#fff;padding:28px;border-radius:0 0 10px 10px;box-shadow:0 4px 6px rgba(0,0,0,.08);text-align:center;">
				<h2 style="color:#435ba1;margin-top:0;">Verify Your Email Address</h2>
				<div style="display:inline-block;padding:16px 24px;border:2px dashed #435ba1;border-radius:10px;margin:16px 0;">
					<span style="font-size:28px;letter-spacing:6px;font-family:'Courier New',monospace;color:#435ba1;">${otp}</span>
				</div>
				<p style="color:#666;font-size:14px;">This code will expire in 10 minutes.</p>
				<p style="color:#666;font-size:14px;">If you didn't create an account, please ignore this email.</p>
			</div>
			<div style="text-align:center;margin-top:12px;color:#999;font-size:12px;">© ${new Date().getFullYear()} HealthCave. All rights reserved.</div>
		</body>
		</html>
	`

	return sendMailRaw({ to: email, subject, text, html })
}

export async function sendWelcomeEmail(email, name) {
	const subject = 'Welcome to HealthCave! 🏥'
	const dashboardUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`
	const text = `Hello ${name},\n\nWelcome to HealthCave! We're excited to have you as part of our healthcare community.\n\nGet started by visiting your dashboard: ${dashboardUrl}\n\nBest regards,\nHealthCave Team`
	const html = `
		<!DOCTYPE html>
		<html>
		<head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${subject}</title></head>
		<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px;">
			<div style="background:linear-gradient(135deg,#435ba1 0%,#4c69c6 100%);padding:24px;border-radius:10px 10px 0 0;text-align:center;color:#fff;">
				<h1 style="margin:0;font-size:24px;">HealthCave</h1>
				<p style="margin:6px 0 0;opacity:.9;">Your Trusted Healthcare Platform</p>
			</div>
			<div style="background:#fff;padding:28px;border-radius:0 0 10px 10px;box-shadow:0 4px 6px rgba(0,0,0,.08);">
				<h2 style="color:#435ba1;margin-top:0;">Welcome to HealthCave, ${name}! 🎉</h2>
				<p>Thank you for joining HealthCave! We're excited to have you as part of our healthcare community.</p>
				<div style="text-align:center;margin:24px 0;">
					<a href="${dashboardUrl}" style="background-color:#435ba1;color:#fff;padding:12px 20px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;">Get Started</a>
				</div>
				<p style="color:#666;font-size:14px;">If you have any questions or need assistance, don't hesitate to contact our support team.</p>
			</div>
			<div style="text-align:center;margin-top:12px;color:#999;font-size:12px;">© ${new Date().getFullYear()} HealthCave. All rights reserved.</div>
		</body>
		</html>
	`

	return sendMailRaw({ to: email, subject, text, html })
}