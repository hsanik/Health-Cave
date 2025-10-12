# Stripe Payment Dashboard Setup

This guide will help you set up real-time payment data integration with Stripe in your HealthCave admin dashboard.

## Prerequisites

1. A Stripe account (test or live mode)
2. Stripe API keys configured in your environment variables
3. Next.js application with the admin dashboard

## Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```env
# Stripe Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Features Added

### 1. Real-time Payment Dashboard
- **Location**: Admin Dashboard → Payments Tab
- **Features**:
  - Live payment statistics (total revenue, today's revenue, success/failure rates)
  - Recent payments table with status indicators
  - Payment method analytics
  - Revenue trend charts
  - Auto-refresh every 30 seconds

### 2. API Routes Created

#### `/api/stripe/payments`
- Fetches recent payment data from Stripe
- Returns payment statistics and recent transactions
- Supports pagination with `limit` and `starting_after` parameters

#### `/api/stripe/analytics`
- Provides payment analytics over a specified time period
- Groups payments by day for trend analysis
- Tracks payment methods and currencies
- Default: 7 days of data

#### `/api/stripe/webhook`
- Handles Stripe webhook events for real-time updates
- Processes payment success, failure, and dispute events
- Verifies webhook signatures for security
- Extensible for custom business logic

### 3. Custom Hooks

#### `useStripePayments`
- React hook for managing payment data state
- Auto-refresh functionality
- Error handling and loading states
- Optimized API calls

### 4. Components

#### `PaymentDashboard`
- Main payment dashboard component
- Real-time data display
- Interactive charts and tables
- Responsive design

#### `SimpleChart`
- Lightweight chart components (Line and Bar charts)
- SVG-based for better performance
- Hover interactions and tooltips

## Setup Instructions

### 1. Configure Stripe Webhook (Optional but Recommended)

1. Go to your Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select the following events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.created`
   - `charge.dispute.created`
5. Copy the webhook signing secret to your environment variables

### 2. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the admin dashboard
3. Click on the "Payments" tab
4. You should see real-time payment data from your Stripe account

### 3. Customize Business Logic

Edit the webhook handler at `/api/stripe/webhook/route.js` to add your custom business logic:

```javascript
async function handleSuccessfulPayment(paymentIntent) {
  // Add your custom logic here
  // Example: Update appointment status, send emails, etc.
  
  if (paymentIntent.metadata?.appointmentId) {
    // Update appointment status in your database
    await updateAppointmentStatus(paymentIntent.metadata.appointmentId, 'paid')
  }
}
```

## Security Considerations

1. **Webhook Verification**: Always verify webhook signatures to ensure requests are from Stripe
2. **Environment Variables**: Keep your Stripe secret keys secure and never expose them in client-side code
3. **Rate Limiting**: Consider implementing rate limiting for your API routes
4. **Error Handling**: Implement proper error handling and logging

## Troubleshooting

### Common Issues

1. **"Unable to load payment data" error**:
   - Check your Stripe API keys in environment variables
   - Ensure your Stripe account has the necessary permissions
   - Check the browser console for detailed error messages

2. **Webhook not receiving events**:
   - Verify the webhook URL is accessible from the internet
   - Check the webhook signing secret
   - Review Stripe webhook logs in the dashboard

3. **Charts not displaying**:
   - Ensure you have payment data in your Stripe account
   - Check the date range for analytics
   - Verify the API responses in browser dev tools

### Testing with Stripe Test Mode

1. Use Stripe's test card numbers for testing:
   - Success: `4242424242424242`
   - Decline: `4000000000000002`
   - Insufficient funds: `4000000000009995`

2. Create test payments using Stripe's testing tools
3. Monitor the admin dashboard for real-time updates

## Performance Optimization

1. **Caching**: Consider implementing Redis caching for frequently accessed data
2. **Pagination**: Use Stripe's pagination for large datasets
3. **Debouncing**: Implement debouncing for rapid refresh requests
4. **Background Jobs**: Move heavy processing to background jobs

## Next Steps

1. Add more detailed analytics (monthly/yearly views)
2. Implement payment filtering and search
3. Add export functionality for payment data
4. Create automated reports and alerts
5. Integrate with your appointment system for payment status updates

## Support

For issues related to:
- Stripe integration: Check Stripe documentation and support
- Dashboard functionality: Review the component code and console logs
- Performance: Monitor API response times and optimize queries