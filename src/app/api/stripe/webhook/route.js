import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const headersList = headers();
  const sig = headersList.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      
      // Update appointment payment status in your database
      try {
        const appointmentId = paymentIntent.metadata.appointmentId;
        if (appointmentId) {
          // Update appointment payment status via Express backend
          const backendUrl = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:5000';
          const response = await fetch(`${backendUrl}/appointments/${appointmentId}/payment`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentStatus: 'paid',
              paymentId: paymentIntent.id,
              amount: paymentIntent.amount / 100, // Convert back from cents
            }),
          });

          if (!response.ok) {
            console.error('Failed to update appointment payment status');
          } else {
            console.log('Appointment payment status updated successfully');
          }
        }
      } catch (error) {
        console.error('Error updating appointment:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      
      // Update appointment payment status to failed
      try {
        const appointmentId = failedPayment.metadata.appointmentId;
        if (appointmentId) {
          const backendUrl = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:5000';
          await fetch(`${backendUrl}/appointments/${appointmentId}/payment`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentStatus: 'failed',
              paymentId: failedPayment.id,
            }),
          });
        }
      } catch (error) {
        console.error('Error updating failed payment:', error);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}