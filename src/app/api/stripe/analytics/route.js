import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days')) || 7

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const startTimestamp = Math.floor(startDate.getTime() / 1000)
    const endTimestamp = Math.floor(endDate.getTime() / 1000)

    // Fetch payments for the date range
    const payments = await stripe.paymentIntents.list({
      created: {
        gte: startTimestamp,
        lte: endTimestamp,
      },
      limit: 100,
    })

    // Group payments by day
    const dailyData = {}
    const paymentMethods = {}
    const currencies = {}

    payments.data.forEach(payment => {
      const date = new Date(payment.created * 1000).toISOString().split('T')[0]
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          revenue: 0,
          count: 0,
          successful: 0,
          failed: 0,
        }
      }

      dailyData[date].count++
      
      if (payment.status === 'succeeded') {
        dailyData[date].revenue += payment.amount / 100
        dailyData[date].successful++
      } else if (payment.status === 'failed') {
        dailyData[date].failed++
      }

      // Track payment methods
      if (payment.payment_method_types) {
        payment.payment_method_types.forEach(method => {
          paymentMethods[method] = (paymentMethods[method] || 0) + 1
        })
      }

      // Track currencies
      currencies[payment.currency] = (currencies[payment.currency] || 0) + 1
    })

    // Convert to array and sort by date
    const chartData = Object.values(dailyData).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    )

    return NextResponse.json({
      chartData,
      paymentMethods,
      currencies,
      totalPayments: payments.data.length,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    })
  } catch (error) {
    console.error('Error fetching Stripe analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}