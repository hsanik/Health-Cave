import { useState, useEffect } from 'react'

const CACHE_KEY = 'stripe_payment_data'
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

export function useStripePayments() {
  const [paymentData, setPaymentData] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return data
        }
      }
    } catch (err) {
      console.error('Error reading cache:', err)
    }
    return null
  }

  const setCachedData = (data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch (err) {
      console.error('Error setting cache:', err)
    }
  }

  const fetchPaymentData = async () => {
    try {
      setError(null)
      const response = await fetch('/api/stripe/payments?limit=20')
      const data = await response.json()
      
      if (response.ok) {
        setPaymentData(data)
        return data
      } else {
        throw new Error(data.error || 'Failed to fetch payment data')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching payment data:', err)
      return null
    }
  }

  const fetchAnalytics = async (days = 7) => {
    try {
      const response = await fetch(`/api/stripe/analytics?days=${days}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnalytics(data)
        return data
      } else {
        throw new Error(data.error || 'Failed to fetch analytics data')
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
      return null
    }
  }

  const refreshData = async () => {
    setLoading(true)
    const paymentResult = await fetchPaymentData()
    const analyticsResult = await fetchAnalytics()
    
    if (paymentResult && analyticsResult) {
      setCachedData({ paymentData: paymentResult, analytics: analyticsResult })
    }
    setLoading(false)
  }

  // Load data only once when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      // Check cache first
      const cachedData = getCachedData()
      if (cachedData) {
        setPaymentData(cachedData.paymentData)
        setAnalytics(cachedData.analytics)
        return
      }

      // If no cache, fetch fresh data
      setLoading(true)
      const paymentResult = await fetchPaymentData()
      const analyticsResult = await fetchAnalytics()
      
      if (paymentResult && analyticsResult) {
        setCachedData({ paymentData: paymentResult, analytics: analyticsResult })
      }
      setLoading(false)
    }
    
    loadInitialData()
  }, []) // Empty dependency array - runs only once

  return {
    paymentData,
    analytics,
    loading,
    error,
    refreshData,
  }
}