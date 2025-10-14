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
  MapPin,
  FileText,
  Star,
  DollarSign,
  Users,
} from "lucide-react";
import { ButtonSpinner, PageSpinner } from "@/components/ui/loading-spinner";
import toast from "react-hot-toast";
import StripePaymentForm from "@/components/stripe/CheckoutForm";
import getStripe from "@/lib/stripe";
import axios from "axios";

const AppointmentConfirmation = ({ params }) => {
  const router = useRouter();
  const { data: session } = useSession();

  // Unwrap params Promise for Next.js 15+
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [doctor, setDoctor] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [stripePromise] = useState(() => getStripe());
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched

  // Dynamic appointment amount based on doctor's consultation fee
  const appointmentAmount = doctor?.consultationFee ? Number(doctor.consultationFee) + 10 : 110; // consultation fee + $10 platform fee

  useEffect(() => {
    // Only fetch data if we haven't fetched it before and we have the required data
    if (dataFetched || !session?.user || !id) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch doctor data
        const doctorRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors/${id}`
        );

        // Process and validate doctor data
        const doctorData = {
          ...doctorRes.data,
          name: String(doctorRes.data.name || ''),
          specialization: String(doctorRes.data.specialization || ''),
          hospital: String(doctorRes.data.hospital || ''),
          rating: Number(doctorRes.data.rating) || 4.5,
          consultationFee: Number(doctorRes.data.consultationFee) || 100,
          image: doctorRes.data.image || ''
        };

        setDoctor(doctorData);

        // Get appointment ID from localStorage (set during booking)
        const appointmentId = localStorage.getItem("lastAppointmentId");
        if (appointmentId) {
          // Try to fetch specific appointment first
          try {
            const appointmentRes = await axios.get(
              `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments/${appointmentId}`
            );

            if (appointmentRes.data.userId === session?.user?.id) {
              // Process appointment data
              const appointmentData = {
                ...appointmentRes.data,
                patientName: String(appointmentRes.data.patientName || ''),
                patientEmail: String(appointmentRes.data.patientEmail || ''),
                patientPhone: String(appointmentRes.data.patientPhone || ''),
                appointmentType: String(appointmentRes.data.appointmentType || ''),
                symptoms: String(appointmentRes.data.symptoms || ''),
                medicalHistory: String(appointmentRes.data.medicalHistory || ''),
                status: String(appointmentRes.data.status || 'pending'),
                paymentStatus: String(appointmentRes.data.paymentStatus || 'pending')
              };
              setAppointment(appointmentData);
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
                setError("Failed to load appointment information");
              }
            } else {
              console.error("Error fetching appointment:", error);
              setError("Failed to load appointment information");
            }
          }
        } else {
          setError("No appointment found. Please book an appointment first.");
        }

        // Mark data as fetched to prevent re-fetching
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching doctor:", error);
        setError("Failed to load doctor information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id, id, dataFetched]); // More specific dependencies

  const handlePayment = async () => {
    if (!appointment) {
      toast.error("Appointment information not found. Please try booking again.");
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

    // Clear the stored appointment ID
    localStorage.removeItem("lastAppointmentId");

    // Update the appointment state to reflect payment completion
    if (appointment) {
      setAppointment(prev => ({
        ...prev,
        paymentStatus: "paid",
        status: "confirmed"
      }));
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    toast.error(
      error.message || "Payment failed. Please try again."
    );
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

  const handleBackToDoctors = () => {
    router.push("/doctors");
  };

  const handleManualRefresh = () => {
    setDataFetched(false);
    setLoading(true);
    setError(null);
    // This will trigger the useEffect to run again
  };

  if (loading) {
    return <PageSpinner text="Loading appointment details..." />;
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-4">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {error || 'Information Not Found'}
              </h2>
              <p className="text-gray-600 mb-6">
                {error || 'Unable to load appointment or doctor information.'}
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/doctors')}
                className="bg-[#435ba1] text-white px-6 py-2 rounded-lg hover:bg-[#4c69c6] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2 inline" />
                Back to Doctors
              </button>
              <button
                onClick={handleManualRefresh}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
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
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                  {doctor.image && doctor.image.trim() !== '' ? (
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
                  <div className="flex items-center space-x-2 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium">${doctor.consultationFee}</span>
                    </div>
                  </div>
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
                      <p className="font-semibold">{appointment?.patientName || session?.user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#435ba1]" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{appointment?.patientPhone || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-[#435ba1]" />
                    <div>
                      <p className="text-sm text-gray-600">Appointment Date</p>
                      <p className="font-semibold">
                        {formatDate(appointment?.appointmentDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-[#435ba1]" />
                    <div>
                      <p className="text-sm text-gray-600">Appointment Time</p>
                      <p className="font-semibold">
                        {formatTime(appointment?.appointmentTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#435ba1]" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{appointment?.patientEmail || session?.user?.email}</p>
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
                </div>

                {appointment?.appointmentType && (
                  <div className="border-t pt-4 mt-4">
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
                  </div>
                )}

                {appointment?.symptoms && (
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

                {appointment?.medicalHistory && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-[#435ba1] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Medical History</p>
                        <p className="text-gray-800">{appointment.medicalHistory}</p>
                      </div>
                    </div>
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
                    <span className="font-semibold">${doctor?.consultationFee || 100}.00</span>
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
                  <p className="text-green-600 text-sm mb-4">
                    Your appointment is confirmed
                  </p>

                  {/* Action buttons after payment success */}
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push("/dashboard/appointments")}
                      className="w-full bg-[#435ba1] text-white py-2 px-4 rounded-lg hover:bg-[#4c69c6] transition-colors font-medium"
                    >
                      View My Appointments
                    </button>
                    <button
                      onClick={() => router.push("/doctors")}
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Book Another Appointment
                    </button>
                  </div>
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
