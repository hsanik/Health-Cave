'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft, HeartPulse } from 'lucide-react'

export default function NotFound() {
  return (
    <div data-not-found-page className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-4xl w-full text-center">
        {/* Animated Medical Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#435ba1] to-[#43d5cb] rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-[#435ba1] to-[#43d5cb] rounded-full p-8">
              <HeartPulse className="h-24 w-24 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-[#435ba1] via-[#4c69c6] to-[#43d5cb] bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-[#515151] dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Oops! It seems the page you're looking for has taken a coffee break. 
            Don't worry, our medical team is here to help you get back on track.
          </p>
        </div>

        {/* Helpful Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-[#515151] dark:text-white mb-4">
            What can you do?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-[#43d5cb] bg-opacity-10 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-[#43d5cb] rounded-full"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Check the URL for typos
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-[#43d5cb] bg-opacity-10 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-[#43d5cb] rounded-full"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Return to our homepage
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-[#43d5cb] bg-opacity-10 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-[#43d5cb] rounded-full"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Browse our doctors
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-[#43d5cb] bg-opacity-10 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-[#43d5cb] rounded-full"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Contact our support team
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-[#435ba1] to-[#4c69c6] text-white hover:opacity-90 px-8 py-6 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl text-base">
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </Button>
          </Link>
          
          <Link href="/doctors">
            <Button 
              variant="outline" 
              className="border-2 border-[#435ba1] text-[#435ba1] dark:text-[#43d5cb] hover:bg-[#435ba1] hover:text-white dark:hover:bg-[#435ba1] px-8 py-6 rounded-lg font-semibold transition-all text-base"
            >
              <Search className="mr-2 h-5 w-5" />
              Browse Doctors
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="text-gray-600 dark:text-gray-300 hover:text-[#435ba1] dark:hover:text-[#43d5cb] px-8 py-6 rounded-lg font-semibold transition-all text-base"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            Need immediate assistance?{' '}
            <Link href="/contact" className="text-[#435ba1] dark:text-[#43d5cb] hover:underline font-semibold">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

