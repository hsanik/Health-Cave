"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  CreditCard,
  ArrowLeft,
  Phone,
  Mail,
  FileText,
  DollarSign,
} from "lucide-react";
import { ButtonSpinner, PageSpinner } from "@/components/ui/loading-spinner";
import toast from "react-hot-toast";
import StripePaymentForm from "@/components/stripe/CheckoutForm";
import getStripe from "@/lib/stripe";
import axios from "axios";

const PaymentPage = ({ params }) => {
  const router = useRouter();
  const { data: session } = useSession();

  // Unwrap params Promise for Next.js 15+
  const resolvedParams = React.use(params);
  const { appointmentId } = resolvedParams;

  const [doctor, setDoctor] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [stripePromise] = useState(() => getStripe());
  const [error, setError] = useState(null);

  // Dynamic appointment amount based on doctor's consultation fee
  const appointmentAmount = doctor?.consultationFee
    ? Number(doctor.consultationFee) + 10
    : 110;

  useEffect(() => {
    if (!session?.user || !appointmentId) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch appointment data
        const appointmentRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments/${appointmentId}`
        );

        // Verify the appointment belongs to the logged-in user
        if (appointmentRes.data.userId !== session.user.id) {
          setError("You don't have permission to access this appointment.");
          return;
        }

        // Check if already paid
        if (appointmentRes.data.paymentStatus === "paid") {
          toast.success("This appointment has already been paid!");
          setTimeout(() => {
            router.push("/dashboard/appointments");
          }, 2000);
          return;
        }

        setAppointment(appointmentRes.data);

        // Fetch doctor data
        const doctorRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors/${appointmentRes.data.doctorId}`
        );
        setDoctor(doctorRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load appointment information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user, appointmentId, router]);

  const handlePayment = async () => {
    if (!appointment) {
      toast.error("Appointment information not found.");
      return;
    }

    setPaymentLoading(true);

    try {
      // Create payment intent with Stripe
      const response = await axios.post("/api/stripe/create-payment-intent", {
        appointmentId: appointment._id,
        amount: appointmentAmount,
        doctorName: doctor?.name,
        patientName: appointment?.patientName || session?.user?.name,
      });

      const { clientSecret } = response.data;
      setClientSecret(clientSecret);
      setShowPaymentForm(true);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    toast.success("Payment successful! Your appointment is confirmed.");

    // Update the appointment state
    if (appointment) {
      setAppointment((prev) => ({
        ...prev,
        paymentStatus: "paid",
        status: "confirmed",
      }));
    }

    // Redirect to appointments page after a short delay
    setTimeout(() => {
      router.push("/dashboard/appointments");
    }, 2000);
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    toast.error(error.message || "Payment failed. Please try again.");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "To be confirmed";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "To be confirmed";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <PageSpinner text="Loading payment details..." />;
  }

  if (error || !appointment || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {error || "Information Not Found"}
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "Unable to load appointment information."}
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/appointments")}
              className="bg-[#435ba1] text-white px-6 py-2 rounded-lg hover:bg-[#4c69c6] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Back to Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard/appointments")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Appointments
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Complete Payment
          </h1>
          <p className="text-gray-600 mt-2">
            Secure payment for your appointment
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
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                  {doctor.image ? (
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <User className="w-10 h-10 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">
                    Dr. {doctor.name}
                  </h3>
                  <p className="text-[#435ba1] font-medium">
                    {doctor.specialization}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{doctor.hospital}</p>
                </div>
              </div>
            </div>

            {/* Appointment Details Card */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Appointment Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-[#435ba1]" />
                    <div>
                      <p className="text-sm text-gray-600">Patient Name</p>
                      <p className="font-semibold">{appointment.patientName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#435ba1]" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{appointment.patientPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-[#435ba1]" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-[#435ba1]" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold">
                        {formatTime(appointment.appointmentTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 md:col-span-2">
                    <Mail className="w-5 h-5 text-[#435ba1]" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{appointment.patientEmail}</p>
                    </div>
                  </div>
                </div>

                {appointment.symptoms && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-[#435ba1] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Symptoms</p>
                        <p className="text-gray-800">{appointment.symptoms}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Payment */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Payment Information
              </h2>

              {/* Payment Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Payment Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Consultation Fee</span>
                    <span className="font-semibold">
                      ${doctor.consultationFee || 100}.00
                    </span>
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
              {appointment.paymentStatus === "paid" ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-green-800 font-semibold text-lg mb-1">
                    Payment Completed!
                  </p>
                  <p className="text-green-600 text-sm mb-4">
                    Your appointment is confirmed
                  </p>
                  <button
                    onClick={() => router.push("/dashboard/appointments")}
                    className="w-full bg-[#435ba1] text-white py-2 px-4 rounded-lg hover:bg-[#4c69c6] transition-colors font-medium"
                  >
                    View My Appointments
                  </button>
                </div>
              ) : showPaymentForm && clientSecret ? (
                <div className="space-y-4">
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    stripePromise={stripePromise}
                    appointmentId={appointment._id}
                    amount={appointmentAmount}
                    doctorName={doctor.name}
                    patientName={appointment.patientName}
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

              {/* Security Note */}
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>🔒 Secure payment powered by Stripe</p>
                <p className="mt-1">Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
