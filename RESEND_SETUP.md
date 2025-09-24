# Resend Email Service Setup Guide

## 1. Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and sign up for an account
2. Navigate to your dashboard
3. Go to "API Keys" section
4. Create a new API key
5. Copy the API key (starts with `re_`)

## 2. Add Environment Variables

Add these to your `.env.local` file:

```env
# Resend Email Service
RESEND_API_KEY=re_your_actual_api_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/healthCave

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 3. Domain Setup (For Production)

### Option A: Use Resend's Default Domain (Development)
- You can use `onboarding@resend.dev` for testing
- Update the `from` field in `src/lib/email.js` to use this

### Option B: Add Your Own Domain (Production)
1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `healthcave.com`)
3. Add the required DNS records
4. Wait for verification
5. Update the `from` field in `src/lib/email.js` to use your domain

## 4. Update Email Configuration

In `src/lib/email.js`, update the `from` field:

```javascript
// For development/testing
from: 'HealthCave <onboarding@resend.dev>'

// For production (replace with your verified domain)
from: 'HealthCave <noreply@yourdomain.com>'
```

## 5. Test the Integration

1. Start your development server: `npm run dev`
2. Go to the registration page
3. Register a new account
4. Check your email for the welcome message
5. Test password reset functionality

## 6. Resend Features

- **Free Tier**: 3,000 emails/month
- **High Deliverability**: Built for developers
- **Real-time Analytics**: Track email opens and clicks
- **React Email Support**: Use React components for emails
- **Webhooks**: Get notified of email events

## 7. Troubleshooting

### Common Issues:

1. **"Invalid API Key"**
   - Check your API key is correct
   - Ensure it starts with `re_`

2. **"Domain not verified"**
   - Use `onboarding@resend.dev` for testing
   - Or verify your domain in Resend dashboard

3. **"Rate limit exceeded"**
   - Check your Resend usage in dashboard
   - Upgrade plan if needed

### Debug Mode:
Check your console logs for email sending status and any errors.

## 8. Production Checklist

- [ ] API key added to environment variables
- [ ] Domain verified in Resend
- [ ] Email templates tested
- [ ] Error handling implemented
- [ ] Rate limiting considered
- [ ] Email analytics set up
