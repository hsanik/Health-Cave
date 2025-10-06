'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft, HeartPulse } from 'lucide-react'
import logo from "../../public/images/logo01.png"
import Image from 'next/image'

export default function NotFound() {
  return (
    <div data-not-found-page className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-4xl w-full text-center">
        {/* Animated Medical Icon */}
        <Image
        className='w-[150px] mx-auto mb-4'
        src={logo}
        />

        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-[#136afb] mb-4">
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

