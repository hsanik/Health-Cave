import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request) {
  const body = await request.text()
  const headersList = headers()
  const sig = headersList.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)
        
        // Here you can add logic to:
        // - Update your database
        // - Send confirmation emails
        // - Trigger real-time updates to admin dashboard
        // - Update appointment status if this is for an appointment
        
        await handleSuccessfulPayment(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log('Payment failed:', failedPayment.id)
        
        await handleFailedPayment(failedPayment)
        break

      case 'payment_intent.created':
        const createdPayment = event.data.object
        console.log('Payment intent created:', createdPayment.id)
        break

      case 'charge.dispute.created':
        const dispute = event.data.object
        console.log('Dispute created:', dispute.id)
        
        await handleDispute(dispute)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSuccessfulPayment(paymentIntent) {
  try {
    // Add your business logic here
    // For example, update appointment status, send confirmation email, etc.
    
    console.log('Processing successful payment:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      customer: paymentIntent.customer,
      metadata: paymentIntent.metadata,
    })

    // If this payment is for an appointment, you might want to:
    // 1. Update the appointment status to 'paid'
    // 2. Send confirmation email to patient
    // 3. Notify the doctor
    
    if (paymentIntent.metadata?.appointmentId) {
      // Update appointment status in your database
      // await updateAppointmentStatus(paymentIntent.metadata.appointmentId, 'paid')
    }
  } catch (error) {
    console.error('Error handling successful payment:', error)
  }
}

async function handleFailedPayment(paymentIntent) {
  try {
    console.log('Processing failed payment:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      last_payment_error: paymentIntent.last_payment_error,
    })

    // Handle failed payment logic
    // 1. Notify the patient about the failed payment
    // 2. Update appointment status if applicable
    // 3. Send retry payment link
    
    if (paymentIntent.metadata?.appointmentId) {
      // Update appointment status in your database
      // await updateAppointmentStatus(paymentIntent.metadata.appointmentId, 'payment_failed')
    }
  } catch (error) {
    console.error('Error handling failed payment:', error)
  }
}

async function handleDispute(dispute) {
  try {
    console.log('Processing dispute:', {
      id: dispute.id,
      amount: dispute.amount,
      currency: dispute.currency,
      reason: dispute.reason,
      status: dispute.status,
    })

    // Handle dispute logic
    // 1. Notify admin about the dispute
    // 2. Gather evidence if needed
    // 3. Update internal records
  } catch (error) {
    console.error('Error handling dispute:', error)
  }
}