"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const appointmentId = searchParams.get('appointment_id');
    
    if (appointmentId) {
      // Clear the stored appointment ID
      localStorage.removeItem('lastAppointmentId');
      
      // Show success message
      Swal.fire({
        title: 'Payment Successful!',
        text: 'Your appointment has been confirmed. You will receive a confirmation email shortly.',
        icon: 'success',
        confirmButtonColor: '#435ba1',
        timer: 3000,
        showConfirmButton: false
      });
    }
    
    setLoading(false);
  }, [searchParams]);

  const handleGoToDashboard = () => {
    router.push('/dashboard/appointments');
  };

  const handleBookAnother = () => {
    router.push('/doctors');
  };

  if (loading) {
    return (
      <div className="w-11/12 mx-auto py-20 text-center">
        <p className="text-lg font-semibold">Processing...</p>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        
        {/* Success Message */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your appointment has been confirmed and you will receive a confirmation email shortly.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button
            onClick={handleGoToDashboard}
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-[#435ba1] text-white font-semibold rounded-lg hover:bg-[#4c69c6] transition-colors"
          >
            <Calendar className="w-5 h-5 mr-2" />
            View My Appointments
          </button>
          
          <button
            onClick={handleBookAnother}
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Book Another Appointment
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <ul className="text-left text-blue-800 space-y-2">
            <li>• You will receive a confirmation email with appointment details</li>
            <li>• The doctor's office may contact you to confirm the appointment time</li>
            <li>• Please arrive 15 minutes before your scheduled appointment</li>
            <li>• Bring a valid ID and insurance card if applicable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;