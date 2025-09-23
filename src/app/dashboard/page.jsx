'use client'

import { useSession } from 'next-auth/react'
import RouteProtection from '@/components/authentication/route-protection'

function DashboardContent() {
  const { data: session } = useSession()

  return (
    <RouteProtection>
      <div className="min-h-screen bg-gradient-to-br from-[#fafafa] to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#515151] dark:text-white mb-4">
              Welcome to Your Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Hello, {session?.user?.name || 'User'}! Manage your health and appointments here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-[#515151] dark:text-white mb-2">
                Upcoming Appointments
              </h3>
              <p className="text-3xl font-bold text-[#435ba1] mb-2">2</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Next appointment: Tomorrow at 2:00 PM
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-[#515151] dark:text-white mb-2">
                Health Records
              </h3>
              <p className="text-3xl font-bold text-[#43d5cb] mb-2">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total medical records
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-[#515151] dark:text-white mb-2">
                Prescriptions
              </h3>
              <p className="text-3xl font-bold text-[#4c69c6] mb-2">5</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Active prescriptions
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#515151] dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-[#515151] dark:text-white">
                      Appointment with Dr. Smith
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Tomorrow at 2:00 PM
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#43d5cb] text-white text-xs rounded-full">
                    Upcoming
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-[#515151] dark:text-white">
                      Prescription Refill
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Yesterday
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Completed
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-[#515151] dark:text-white">
                      Lab Results Available
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      3 days ago
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    New
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteProtection>
  )
}

export default function Dashboard() {
  return <DashboardContent />
}

