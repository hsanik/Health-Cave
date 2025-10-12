"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { ButtonSpinner } from "@/components/ui/loading-spinner";
import Swal from "sweetalert2";
import StripePaymentForm from "@/components/stripe/CheckoutForm";
import getStripe from "@/lib/stripe";
import axios from "axios";

const AppointmentConfirmation = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = params;

  const [doctor, setDoctor] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [stripePromise] = useState(() => getStripe());

  const appointmentAmount = 160.0; // $150 consultation + $10 platform fee

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctor data
        const doctorRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors/${id}`
        );
        setDoctor(doctorRes.data);

        // Get appointment ID from localStorage (set during booking)
        const appointmentId = localStorage.getItem("lastAppointmentId");
        if (appointmentId) {
          // Try to fetch specific appointment first
          try {
            const appointmentRes = await axios.get(
              `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments/${appointmentId}`
            );
            if (appointmentRes.data.userId === session?.user?.id) {
              setAppointment(appointmentRes.data);
            }
          } catch (error) {
            if (error.response?.status === 404) {
              // Fallback: fetch all appointments and find the one
              try {
                const allAppointmentsRes = await axios.get(
                  `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`
                );
                const userAppointment = allAppointmentsRes.data.find(
                  (apt) =>
                    apt._id === appointmentId &&
                    apt.userId === session?.user?.id
                );
                if (userAppointment) {
                  setAppointment(userAppointment);
                }
              } catch (fallbackError) {
                console.error("Error fetching all appointments:", fallbackError);
              }
            } else {
              console.error("Error fetching appointment:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [id, session]);

  const handlePayment = async () => {
    if (!appointment) {
      Swal.fire({
        title: "Error",
        text: "Appointment information not found. Please try booking again.",
        icon: "error",
        confirmButtonColor: "#435ba1",
      });
      return;
    }

    setPaymentLoading(true);

    try {
      // Create payment intent with Stripe
      const response = await axios.post("/api/stripe/create-payment-intent", {
        appointmentId: appointment._id,
        amount: appointmentAmount,
        doctorName: doctor?.name,
        patientName: session?.user?.name,
      });

      const { clientSecret } = response.data;
      setClientSecret(clientSecret);
      setShowPaymentForm(true);
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        title: "Payment Error",
        text: "Failed to initialize payment. Please try again.",
        icon: "error",
        confirmButtonColor: "#435ba1",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    await Swal.fire({
      title: "Payment Successful!",
      text: "Your appointment has been confirmed. You will receive a confirmation email shortly.",
      icon: "success",
      confirmButtonColor: "#435ba1",
    });

    // Clear the stored appointment ID
    localStorage.removeItem("lastAppointmentId");
    router.push("/dashboard/appointments");
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    Swal.fire({
      title: "Payment Failed",
      text:
        error.message ||
        "There was an error processing your payment. Please try again.",
      icon: "error",
      confirmButtonColor: "#435ba1",
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Appointment Booked Successfully!
          </h1>
          <p className="text-gray-600">
            Complete your payment to confirm the appointment
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Appointment Details */}
          <div className="space-y-6">
            {/* Doctor Information Card */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Doctor Information
              </h2>
              <div className="flex items-center space-x-4">
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
                  <h3 className="text-lg font-bold text-gray-800">
                    Dr. {doctor.name}
                  </h3>
                  <p className="text-[#435ba1] font-medium">
                    {doctor.specialization}
                  </p>
                  <p className="text-gray-600">{doctor.hospital}</p>
                  <p className="text-yellow-500 font-medium">
                    ⭐ {doctor.rating}
                  </p>
                </div>
              </div>
            </div>

            {/* Appointment Details Card */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Appointment Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-[#435ba1]" />
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="font-semibold">{session?.user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-[#435ba1]" />
                  <div>
                    <p className="text-sm text-gray-600">Appointment Date</p>
                    <p className="font-semibold">
                      {appointment?.appointmentDate
                        ? new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        : "To be confirmed"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[#435ba1]" />
                  <div>
                    <p className="text-sm text-gray-600">Appointment Time</p>
                    <p className="font-semibold">
                      {appointment?.appointmentTime || "To be confirmed"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-[#435ba1]" />
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p
                      className={`font-semibold ${appointment?.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                        }`}
                    >
                      {appointment?.paymentStatus === "paid"
                        ? "Payment Complete"
                        : "Payment Pending"}
                    </p>
                  </div>
                </div>

                {appointment?.appointmentType && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-[#435ba1] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">T</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Appointment Type</p>
                      <p className="font-semibold capitalize">
                        {appointment.appointmentType}
                      </p>
                    </div>
                  </div>
                )}

                {appointment?.symptoms && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-1">Symptoms</p>
                    <p className="text-gray-800">{appointment.symptoms}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Important Notes
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>
                  • Your appointment is not confirmed until payment is completed
                </li>
                <li>
                  • You will receive a confirmation email once payment is
                  processed
                </li>
                <li>
                  • Please arrive 15 minutes before your scheduled appointment
                </li>
                <li>• Bring a valid ID and insurance card if applicable</li>
                <li>
                  • Cancellations must be made at least 24 hours in advance
                </li>
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

          {/* Right Section - Payment */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Complete Payment
              </h2>

              {/* Payment Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Payment Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Consultation Fee</span>
                    <span className="font-semibold">$150.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Platform Fee</span>
                    <span className="font-semibold">$10.00</span>
                  </div>
                  <div className="border-t border-blue-300 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">
                        Total Amount
                      </span>
                      <span className="text-lg font-bold text-[#435ba1]">
                        ${appointmentAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status or Form */}
              {appointment?.paymentStatus === "paid" ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-green-800 font-semibold text-lg mb-1">
                    Payment Completed!
                  </p>
                  <p className="text-green-600 text-sm">
                    Your appointment is confirmed
                  </p>
                </div>
              ) : showPaymentForm && clientSecret ? (
                <div className="space-y-4">
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    stripePromise={stripePromise}
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
                  disabled={paymentLoading || !appointment}
                  className="w-full bg-[#435ba1] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#4c69c6] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {paymentLoading ? (
                    <ButtonSpinner text="Initializing Payment..." size="default" />
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6" />
                      <span>Pay ${appointmentAmount} Securely</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
