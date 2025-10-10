"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { CheckCircle, Calendar, Clock, User, CreditCard, ArrowLeft, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import PaymentForm from "@/components/stripe/CheckoutForm";

const AppointmentConfirmation = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { id } = params;

  const [doctor, setDoctor] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const appointmentAmount = 160.00; // $150 consultation + $10 platform fee

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctor data
        const doctorRes = await fetch(`http://localhost:5000/doctors/${id}`);
        if (!doctorRes.ok) throw new Error("Doctor not found");
        const doctorData = await doctorRes.json();
        setDoctor(doctorData);

        // Get appointment ID from localStorage (set during booking)
        const appointmentId = localStorage.getItem('lastAppointmentId');
        if (appointmentId) {
          // Try to fetch specific appointment first
          try {
            const appointmentRes = await fetch(`http://localhost:5000/appointments/${appointmentId}`);
            if (appointmentRes.ok) {
              const appointmentData = await appointmentRes.json();
              if (appointmentData.userId === session?.user?.id) {
                setAppointment(appointmentData);
              }
            } else {
              // Fallback: fetch all appointments and find the one
              const allAppointmentsRes = await fetch(`http://localhost:5000/appointments`);
              if (allAppointmentsRes.ok) {
                const appointments = await allAppointmentsRes.json();
                const userAppointment = appointments.find(apt => 
                  apt._id === appointmentId && apt.userId === session?.user?.id
                );
                if (userAppointment) {
                  setAppointment(userAppointment);
                }
              }
            }
          } catch (error) {
            console.error('Error fetching appointment:', error);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [id, session]);

  const handlePayment = () => {
    if (!appointment) {
      Swal.fire({
        title: 'Error',
        text: 'Appointment information not found. Please try booking again.',
        icon: 'error',
        confirmButtonColor: '#435ba1'
      });
      return;
    }
    
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async () => {
    await Swal.fire({
      title: 'Payment Successful!',
      text: 'Your appointment has been confirmed. You will receive a confirmation email shortly.',
      icon: 'success',
      confirmButtonColor: '#435ba1'
    });
    
    // Clear the stored appointment ID
    localStorage.removeItem('lastAppointmentId');
    router.push('/dashboard/appointments');
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    Swal.fire({
      title: 'Payment Failed',
      text: error.message || 'There was an error processing your payment. Please try again.',
      icon: 'error',
      confirmButtonColor: '#435ba1'
    });
  };

  const handleBackToDoctors = () => {
    router.push("/doctors");
  };

  if (loading) {
    return (
      <div className="w-11/12 mx-auto py-20 text-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="w-11/12 mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">Doctor not found</h1>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointment Booked Successfully!</h1>
          <p className="text-gray-600">Your appointment has been scheduled. Please complete the payment to confirm.</p>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment Details</h2>
          
          {/* Doctor Info */}
          <div className="flex items-center space-x-6 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
              <p className="text-[#435ba1] font-medium">{doctor.specialization}</p>
              <p className="text-gray-600">{doctor.hospital}</p>
              <p className="text-yellow-500 font-medium">⭐ {doctor.rating}</p>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-[#435ba1]" />
              <div>
                <p className="text-sm text-gray-600">Patient</p>
                <p className="font-semibold">{session?.user?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-[#435ba1]" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">
                  {appointment?.appointmentDate 
                    ? new Date(appointment.appointmentDate).toLocaleDateString()
                    : 'To be confirmed'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-[#435ba1]" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">
                  {appointment?.appointmentTime || 'To be confirmed'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-[#435ba1]" />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-semibold ${
                  appointment?.paymentStatus === 'paid' 
                    ? 'text-green-600' 
                    : 'text-yellow-600'
                }`}>
                  {appointment?.paymentStatus === 'paid' ? 'Payment Complete' : 'Payment Pending'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Information</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Consultation Fee:</span>
                <span className="font-semibold">$150.00</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Platform Fee:</span>
                <span className="font-semibold">$10.00</span>
              </div>
              <div className="border-t border-blue-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                  <span className="text-lg font-bold text-[#435ba1]">${appointmentAmount}</span>
                </div>
              </div>
            </div>

            {appointment?.paymentStatus === 'paid' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-800 font-semibold">Payment Completed Successfully!</p>
                <p className="text-green-600 text-sm">Your appointment is confirmed.</p>
              </div>
            ) : showPaymentForm ? (
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Payment Processing</h4>
                  <p className="text-sm text-gray-600">Complete your payment to confirm the appointment.</p>
                </div>
                <PaymentForm
                  appointmentId={appointment?._id}
                  amount={appointmentAmount}
                  doctorName={doctor?.name}
                  patientName={session?.user?.name}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            ) : (
              <button
                onClick={handlePayment}
                disabled={!appointment}
                className="w-full bg-[#435ba1] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#4c69c6] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" />
                <span>Proceed to Payment</span>
              </button>
            )}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Important Notes:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Your appointment is not confirmed until payment is completed</li>
            <li>• You will receive a confirmation email once payment is processed</li>
            <li>• Please arrive 15 minutes before your scheduled appointment</li>
            <li>• Bring a valid ID and insurance card if applicable</li>
            <li>• Cancellations must be made at least 24 hours in advance</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleBackToDoctors}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Doctors</span>
          </button>
          
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;