'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStripePayments } from '@/hooks/useStripePayments'
import { SimpleLineChart, SimpleBarChart } from '@/components/ui/SimpleChart'
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  AlertCircle,
  X,
} from 'lucide-react'

export default function PaymentDashboard() {
  const [selectedPayment, setSelectedPayment] = useState(null)
  const { paymentData, analytics, loading, error, refreshData } = useStripePayments()

  const handleRefresh = async () => {
    await refreshData()
  }

  const formatCurrency = (amount, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }



  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Payment Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Payment data from Stripe
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Unable to load payment data
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payment Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Payment data from Stripe
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Payment Statistics */}
      {paymentData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(paymentData.statistics.totalRevenue)}
                </p>
                <div className="flex items-center mt-1 text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12.5%
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Today's Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(paymentData.statistics.todayRevenue)}
                </p>
                <div className="flex items-center mt-1 text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +8.2%
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Successful Payments
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {paymentData.statistics.successfulPayments}
                </p>
                <div className="flex items-center mt-1 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {((paymentData.statistics.successfulPayments / paymentData.statistics.totalPayments) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Failed Payments
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {paymentData.statistics.failedPayments}
                </p>
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <XCircle className="w-4 h-4 mr-1" />
                  {paymentData.statistics.totalPayments > 0 ?
                    ((paymentData.statistics.failedPayments / paymentData.statistics.totalPayments) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Payments */}
      {paymentData && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Payments
            </h3>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentData.payments.map((payment, index) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {payment.metadata?.customerName ? payment.metadata.customerName.charAt(0).toUpperCase() :
                            payment.metadata?.patientName ? payment.metadata.patientName.charAt(0).toUpperCase() :
                              (index + 1)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.metadata?.customerName ||
                              payment.metadata?.patientName ||
                              payment.metadata?.doctorName ||
                              `Customer #${index + 1}`}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {payment.metadata?.email ||
                              payment.metadata?.appointmentType ||
                              'Payment transaction'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrency(payment.amount / 100, payment.currency)}
                        </span>
                        {payment.metadata?.service && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                            {payment.metadata.service}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className={`ml-2 inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status === 'succeeded' ? 'Completed' :
                            payment.status === 'failed' ? 'Failed' :
                              payment.status === 'processing' ? 'Processing' :
                                payment.status === 'requires_payment_method' ? 'Pending' :
                                  payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(payment.created * 1000).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(payment.created * 1000).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        onClick={() => setSelectedPayment(payment)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Payment Methods Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payment Methods
            </h3>
            {analytics?.paymentMethods ? (
              <div className="space-y-4">
                <SimpleBarChart data={analytics.paymentMethods} height={150} />
                <div className="space-y-2">
                  {Object.entries(analytics.paymentMethods).map(([method, count]) => (
                    <div key={method} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {method}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {count} payments
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">Loading payment methods...</p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue Trend (7 days)
            </h3>
            {analytics?.chartData ? (
              <SimpleLineChart data={analytics.chartData} />
            ) : (
              <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading chart data...
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Payment Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Transaction #{selectedPayment.id.slice(-8)}
                </p>
              </div>
              <Button
                onClick={() => setSelectedPayment(null)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">

              {/* Payment Status */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedPayment.status)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {selectedPayment.status === 'succeeded' ? 'Completed' :
                      selectedPayment.status === 'failed' ? 'Failed' :
                        selectedPayment.status === 'processing' ? 'Processing' :
                          selectedPayment.status}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(selectedPayment.amount / 100, selectedPayment.currency)}
                </span>
              </div>

              {/* Customer */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedPayment.metadata?.customerName ||
                      selectedPayment.metadata?.patientName ||
                      'Customer'}
                  </div>
                  {selectedPayment.metadata?.email && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedPayment.metadata.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Service */}
              {(selectedPayment.metadata?.service || selectedPayment.metadata?.appointmentType) && (
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Service</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedPayment.metadata?.service || selectedPayment.metadata?.appointmentType}
                    </div>
                    {selectedPayment.metadata?.doctorName && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Dr. {selectedPayment.metadata.doctorName}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(selectedPayment.created)}
                </span>
              </div>

              {/* Payment Method */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Method</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {selectedPayment.payment_method_types?.join(', ') || 'N/A'}
                </span>
              </div>

              {/* Transaction ID */}
              <div className="flex items-start justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Transaction ID</span>
                <div className="text-right max-w-xs">
                  <span className="text-xs font-mono text-gray-900 dark:text-white break-all">
                    {selectedPayment.id}
                  </span>
                </div>
              </div>

              {/* Customer ID */}
              {selectedPayment.customer && (
                <div className="flex items-start justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer ID</span>
                  <span className="text-xs font-mono text-gray-900 dark:text-white">
                    {selectedPayment.customer}
                  </span>
                </div>
              )}

              {/* Additional Metadata */}
              {selectedPayment.metadata && Object.keys(selectedPayment.metadata).length > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                    Additional Information
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(selectedPayment.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedPayment.description && (
                <div className="flex items-start justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-right max-w-xs">
                    {selectedPayment.description}
                  </span>
                </div>
              )}

              {/* Error Information */}
              {selectedPayment.last_payment_error && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-3 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Error Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Error Code</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedPayment.last_payment_error.code}
                      </span>
                    </div>
                    <div className="flex items-start justify-between py-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Message</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white text-right max-w-xs">
                        {selectedPayment.last_payment_error.message}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}