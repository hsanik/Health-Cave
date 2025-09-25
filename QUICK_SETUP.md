# Quick Setup for Email Service

## The Issue
You're getting a 500 error because the Resend API key is not configured.

## Quick Fix (Development Mode)

1. **Create or update your `.env.local` file** in the root directory:

```env
# Add this line to your .env.local file
RESEND_API_KEY=development_mode

# Also make sure you have these:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
MONGODB_URI=mongodb://localhost:27017/healthCave
```

2. **Restart your development server**:
```bash
npm run dev
```

3. **Test the forgot password** - it will now log emails to console instead of sending real emails.

## For Production (Real Emails)

1. **Get Resend API Key**:
   - Go to [resend.com](https://resend.com)
   - Sign up and get your API key
   - Replace `development_mode` with your real API key

2. **Update `.env.local`**:
```env
RESEND_API_KEY=re_your_actual_api_key_here
```

## Test the Fix

1. Go to `http://localhost:3000/forgot-password`
2. Enter an email and click "Send Reset Link"
3. Check your browser console for the reset link
4. The link should work for password reset

## Debug Endpoint

Visit `http://localhost:3000/api/test-email` to test the email service directly.
