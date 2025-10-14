"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import AvailabilityManager from "@/components/availability/AvailabilityManager";
import toast from "react-hot-toast";
import { Clock, Loader2 } from "lucide-react";

export default function AvailabilityPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    const checkDoctorStatusAndFetch = async () => {
      if (!session?.user?.id) return;

      try {
        // Check if user is a doctor
        const doctorResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_SERVER_URI
          }/doctors/check-by-email/${encodeURIComponent(session.user.email)}`
        );
        if (doctorResponse.ok) {
          const data = await doctorResponse.json();
          setIsDoctor(data.isDoctor);

          if (data.isDoctor) {
            await fetchAvailability();
          } else {
            setIsLoadingData(false);
          }
        } else {
          setIsDoctor(false);
          setIsLoadingData(false);
        }
      } catch (error) {
        console.error("Error checking doctor status:", error);
        setIsDoctor(false);
        setIsLoadingData(false);
      }
    };

    checkDoctorStatusAndFetch();
  }, [session]);

  const fetchAvailability = async () => {
    if (!session?.user) return;

    try {
      setIsLoadingData(true);
      const response = await fetch("/api/profile/simple");

      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        setAvailability(user.availability || []);
      } else {
        toast.error("Failed to load availability data");
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast.error("Failed to load availability data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleAvailabilityUpdate = async (newAvailability) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/availability/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ availability: newAvailability }),
      });

      if (response.ok) {
        toast.success("Availability updated successfully!");
        setAvailability(newAvailability);
      } else {
        const error = await response.json();
        toast.error(`Failed to update availability: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is a doctor (status determined in useEffect)
  if (!isDoctor) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This page is only available for doctors. Please contact an
              administrator if you believe this is an error.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Doctor Availability
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your consultation schedule and availability for appointments.
        </p>
      </div>

      {/* Loading State */}
      {isLoadingData && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading availability data...
            </p>
          </div>
        </div>
      )}

      {/* Availability Manager */}
      {!isLoadingData && (
        <div className="max-w-4xl">
          <AvailabilityManager
            availability={availability}
            onSave={handleAvailabilityUpdate}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Info Card */}
      <Card className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Availability Information
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Set your consultation hours for each day of the week</li>
              <li>
                • Patients will see your availability when booking appointments
              </li>
              <li>• You can update your schedule anytime</li>
              <li>• Each day can have only one time slot</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
