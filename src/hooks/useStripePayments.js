import { useState, useEffect, useCallback } from 'react'

export function useStripePayments(autoRefresh = true, refreshInterval = 30000) {
  const [paymentData, setPaymentData] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPaymentData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true)
      setError(null)

      const response = await fetch('/api/stripe/payments?limit=20')
      const data = await response.json()
      
      if (response.ok) {
        setPaymentData(data)
      } else {
        throw new Error(data.error || 'Failed to fetch payment data')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching payment data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAnalytics = useCallback(async (days = 7) => {
    try {
      const response = await fetch(`/api/stripe/analytics?days=${days}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnalytics(data)
      } else {
        throw new Error(data.error || 'Failed to fetch analytics data')
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
    }
  }, [])

  const refreshData = useCallback(() => {
    fetchPaymentData(true)
    fetchAnalytics()
  }, [fetchPaymentData, fetchAnalytics])

  useEffect(() => {
    fetchPaymentData()
    fetchAnalytics()
  }, [fetchPaymentData, fetchAnalytics])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refreshData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refreshData])

  return {
    paymentData,
    analytics,
    loading,
    error,
    refreshData,
    fetchPaymentData,
    fetchAnalytics,
  }
}