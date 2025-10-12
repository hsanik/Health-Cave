import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 10
    const startingAfter = searchParams.get('starting_after')
    
    // Fetch recent payments
    const payments = await stripe.paymentIntents.list({
      limit,
      ...(startingAfter && { starting_after: startingAfter }),
    })

    // Fetch payment statistics for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = Math.floor(today.getTime() / 1000)

    const todayPayments = await stripe.paymentIntents.list({
      created: { gte: todayTimestamp },
      limit: 100,
    })

    // Calculate statistics
    const totalRevenue = payments.data.reduce((sum, payment) => {
      return payment.status === 'succeeded' ? sum + payment.amount : sum
    }, 0)

    const todayRevenue = todayPayments.data.reduce((sum, payment) => {
      return payment.status === 'succeeded' ? sum + payment.amount : sum
    }, 0)

    const successfulPayments = payments.data.filter(p => p.status === 'succeeded').length
    const failedPayments = payments.data.filter(p => p.status === 'failed').length
    const pendingPayments = payments.data.filter(p => p.status === 'processing').length

    return NextResponse.json({
      payments: payments.data,
      statistics: {
        totalRevenue: totalRevenue / 100, // Convert from cents
        todayRevenue: todayRevenue / 100,
        successfulPayments,
        failedPayments,
        pendingPayments,
        totalPayments: payments.data.length,
      },
      hasMore: payments.has_more,
    })
  } catch (error) {
    console.error('Error fetching Stripe payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment data' },
      { status: 500 }
    )
  }
}