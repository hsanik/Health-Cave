import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function OtpVerificationModal({ email, isOpen, onClose, onVerified }) {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setOtp('') // Clear OTP when modal opens
      setCountdown(60) // Reset countdown
      setCanResend(false)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isOpen, email])

  const handleOtpChange = (e) => {
    const value = e.target.value
    // Allow only digits and limit to 6 characters
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'OTP verification failed')
      }

      toast.success('Email verified successfully!')
      onVerified(email)
      onClose()
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'OTP verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend OTP')
      }

      toast.success('New OTP sent to your email!')
      setCountdown(60)
      setCanResend(false)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Verify Your Email</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          A 6-digit verification code has been sent to <span className="font-medium">{email}</span>. Please enter it below.
        </p>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label htmlFor="otp" className="sr-only">Verification Code</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#43d5cb] focus:border-transparent bg-white dark:bg-gray-700 text-[#515151] dark:text-white placeholder-gray-400"
                placeholder="Enter 6-digit code"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#435ba1] hover:bg-[#4c69c6] text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <span className="flex items-center justify-center"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</span>
            ) : (
              'Verify Email'
            )}
          </Button>
        </form>

        <div className="text-center mt-4">
          <Button
            variant="link"
            onClick={handleResendOtp}
            disabled={isResending || !canResend}
            className="text-sm text-gray-600 dark:text-gray-300"
          >
            {isResending ? 'Resending...' : canResend ? 'Resend Code' : `Resend in ${countdown}s`}
          </Button>
        </div>
      </div>
    </div>
  )
}
