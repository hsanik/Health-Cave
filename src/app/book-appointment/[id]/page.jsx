"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  FileText,
  ArrowLeft,
  Star,
  DollarSign,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { PageSpinner, ButtonSpinner } from "@/components/ui/loading-spinner";

const BookAppointment = ({ params }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Unwrap params Promise for Next.js 15+
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState([]);

  // Helper function to format date as DD/MM/YYYY
  const formatDateToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to format date for input (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientAge: "",
    patientGender: "",
    appointmentDate: formatDateForInput(new Date()), // Pre-select today's date for input
    appointmentTime: "",
    appointmentType: "consultation",
    symptoms: "",
    medicalHistory: "",
    emergencyContact: "",
    address: "",
    insuranceProvider: "",
    insuranceNumber: "",
    preferredLanguage: "English",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        patientName: session.user.name || "",
        patientEmail: session.user.email || "",
        patientPhone: session.user.phone || "",
        address: session.user.address || "",
      }));
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors/${id}`
        );

        // Process and validate doctor data
        const doctorData = {
          ...response.data,
          name: String(response.data.name || ''),
          specialization: String(response.data.specialization || ''),
          hospital: String(response.data.hospital || ''),
          rating: Number(response.data.rating) || 4.5,
          consultationFee: Number(response.data.consultationFee) || 100,
          image: response.data.image || ''
        };

        setDoctor(doctorData);
      } catch (error) {
        console.error("Error fetching doctor:", error);
        toast.error("Failed to load doctor information");
      } finally {
        setLoading(false);
      }
    };

    const fetchBookedAppointments = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments/doctor/${id}`
        );
        setBookedAppointments(response.data);
      } catch (error) {
        console.error("Error fetching booked appointments:", error);
      }
    };

    if (id) {
      fetchDoctor();
      fetchBookedAppointments();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset time when date changes
    if (name === "appointmentDate") {
      setFormData((prev) => ({
        ...prev,
        appointmentTime: "",
      }));
    }
  };

  const getAvailableTimeSlots = () => {
    const allTimeSlots = [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
    ];

    // Get booked times for the selected date
    const selectedDateStr = formData.appointmentDate;
    const bookedTimes = bookedAppointments
      .filter((appointment) => {
        const appointmentDate = appointment.appointmentDate;
        // Convert appointment date to YYYY-MM-DD format for comparison
        let formattedAppointmentDate;
        if (appointmentDate) {
          const date = new Date(appointmentDate);
          formattedAppointmentDate = formatDateForInput(date);
        }
        return (
          formattedAppointmentDate === selectedDateStr &&
          appointment.status !== "cancelled"
        );
      })
      .map((appointment) => appointment.appointmentTime);

    return allTimeSlots.filter((time) => !bookedTimes.includes(time));
  };

  const formatTimeDisplay = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const updateUserRole = async () => {
    try {
      const response = await axios.put("/api/profile/update-role", {
        role: "patient"
      });

      console.log("Role update result:", response.data);

      // The role update might not happen if user already has a different role
      // This is expected behavior and not an error
      return response.data;
    } catch (error) {
      console.error("Error updating user role:", error);
      // Don't throw error here as appointment booking should still proceed
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Update user role to patient (only if current role is "user")
      const roleUpdateResult = await updateUserRole();

      // Log the role update result for debugging
      if (roleUpdateResult) {
        console.log("User role update:", roleUpdateResult.message);
        if (
          roleUpdateResult.currentRole &&
          roleUpdateResult.currentRole !== "user"
        ) {
          console.log(
            `User already has role: ${roleUpdateResult.currentRole}, no role change needed`
          );
        }
      }

      // Create appointment data
      const appointmentData = {
        ...formData,
        appointmentDate: new Date(formData.appointmentDate).toISOString(), // Convert to ISO string for database
        doctorId: id,
        doctorName: doctor.name,
        doctorSpecialization: doctor.specialization,
        doctorImage: doctor.image,
        doctorHospital: doctor.hospital,
        userId: session.user.id,
        status: "pending",
        paymentStatus: "pending",
      };

      // Save appointment to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`,
        appointmentData
      );

      console.log("Appointment created:", response.data);

      // Store appointment ID for the confirmation page
      if (response.data.insertedId) {
        localStorage.setItem("lastAppointmentId", response.data.insertedId);
      }

      toast.success(
        "Appointment booked successfully! Redirecting to payment..."
      );

      // Redirect to payment or confirmation page after a short delay
      setTimeout(() => {
        router.push(`/appointment-confirmation/${id}`);
      }, 1500);
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return <PageSpinner text="Loading appointment booking..." />;
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Doctor not found</h1>
            <p className="text-gray-600 mb-6">The doctor you're trying to book with doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/doctors')}
              className="bg-[#435ba1] text-white px-6 py-2 rounded-lg hover:bg-[#4c69c6] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Back to Doctors
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Available time slots and date validation handled by calendar component

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/doctors')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Doctors</span>
          </button>
        </div>

        {/* Doctor Info Header */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                {doctor.image && doctor.image.trim() !== '' ? (
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <User className="w-12 h-12 text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Dr. {doctor.name}
                </h1>
                <p className="text-[#435ba1] font-medium text-lg">
                  {doctor.specialization}
                </p>
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {doctor.hospital}
                </p>
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

            {/* Quick Info Card */}
            <div className="bg-blue-50 rounded-lg p-4 min-w-[200px]">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Consultation Fee</h3>
              <p className="text-2xl font-bold text-blue-800">${doctor.consultationFee}</p>
              <p className="text-xs text-blue-600 mt-1">Payment required after booking</p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Book Your Appointment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="patientEmail"
                  value={formData.patientEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Age *
                </label>
                <input
                  type="number"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="120"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Gender *
                </label>
                <select
                  name="patientGender"
                  value={formData.patientGender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
              />
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Appointment Date *
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  required
                  min={formatDateForInput(new Date())} // Today's date as minimum
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Selected:{" "}
                  {formData.appointmentDate
                    ? formatDateToDDMMYYYY(new Date(formData.appointmentDate))
                    : "No date selected"}
                </p>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Appointment Time *
                </label>
                <select
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                >
                  <option value="">Select Time</option>
                  {getAvailableTimeSlots().length === 0 ? (
                    <option value="" disabled>
                      No available slots for this date
                    </option>
                  ) : (
                    getAvailableTimeSlots().map((time) => (
                      <option key={time} value={time}>
                        {formatTimeDisplay(time)}
                      </option>
                    ))
                  )}
                </select>
                {formData.appointmentDate &&
                  getAvailableTimeSlots().length === 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      No available time slots for this date. Please select
                      another date.
                    </p>
                  )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Appointment Type *
                </label>
                <select
                  name="appointmentType"
                  value={formData.appointmentType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="check-up">Check-up</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            {/* Medical Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Current Symptoms
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe your current symptoms..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Medical History
                </label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any relevant medical history, allergies, medications..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                />
              </div>
            </div>

            {/* Insurance Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleInputChange}
                  placeholder="e.g., Blue Cross, Aetna, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Insurance Number
                </label>
                <input
                  type="text"
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleInputChange}
                  placeholder="Insurance policy number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                />
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Preferred Language
              </label>
              <select
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting || !formData.appointmentTime}
                className="w-full flex items-center justify-center px-6 py-3 bg-[#435ba1] text-white font-medium rounded-lg hover:bg-[#4c69c6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <ButtonSpinner text="Processing..." />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Book Appointment & Proceed to Payment
                  </>
                )}
              </button>

              {!formData.appointmentTime && formData.appointmentDate && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  Please select an appointment time to continue
                </p>
              )}

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CreditCard className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Payment Information</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      After booking, you'll be redirected to complete your payment of <strong>${doctor.consultationFee}</strong>.
                      Your appointment will be confirmed once payment is processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
