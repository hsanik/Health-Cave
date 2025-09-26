'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Mail, ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')
  
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 6) {
      setOtp(value)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    if (!email) {
      toast.error('Email not found. Please try registering again.')
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
        toast.error(data.error || 'Invalid OTP')
      } else {
        await Swal.fire({
          title: 'Email Verified!',
          text: 'Your email has been successfully verified. You can now complete your registration.',
          icon: 'success',
          confirmButtonText: 'Continue Registration',
          confirmButtonColor: '#435ba1',
        })
        router.push(`/register?email=${encodeURIComponent(email)}&verified=true`)
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Email not found. Please try registering again.')
      return
    }

    setIsResending(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to resend OTP')
      } else {
        toast.success('OTP sent successfully!')
        setTimeLeft(600) // Reset timer
        setCanResend(false)
        setOtp('') // Clear current OTP
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fafafa] to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-[#515151] dark:text-white">
              Invalid Request
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              No email found. Please start the registration process again.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <Link href="/register">
              <Button className="w-full bg-[#435ba1] hover:bg-[#4c69c6] text-white">
                Start Registration
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo_light.png"
              alt="HealthCave"
              width={120}
              height={32}
              className="block dark:hidden"
            />
            <Image
              src="/images/logo_dark.png"
              alt="HealthCave"
              width={120}
              height={32}
              className="hidden dark:block"
            />
          </div>

          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-[#435ba1]" />
          </div>
          <h2 className="text-3xl font-bold text-[#515151] dark:text-white">
            Verify Your Email
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-semibold text-[#435ba1]">{email}</p>
        </div>

        {/* Verification Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-[#515151] dark:text-white mb-2"
              >
                Enter Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                className="block w-full text-center text-2xl font-mono tracking-widest py-4 px-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#43d5cb] focus:border-transparent bg-white dark:bg-gray-700 text-[#515151] dark:text-white"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Code expires in: <span className="font-semibold text-[#435ba1]">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Code has expired. Please request a new one.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-[#435ba1] hover:bg-[#4c69c6] text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Didn't receive the code?
            </p>
            <Button
              onClick={handleResendOtp}
              disabled={!canResend || isResending}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend Code
                </>
              )}
            </Button>
          </div>

          {/* Back to Registration */}
          <div className="mt-4 text-center">
            <Link
              href="/register"
              className="flex items-center justify-center text-sm text-[#435ba1] hover:text-[#4c69c6] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Registration
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Check your spam folder if you don't see the email in your inbox.
          </p>
        </div>
      </div>
    </div>
  )
}

function VerifyEmailFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#435ba1] mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  )
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
