"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const AppointmentsPage = () => {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const doctorName = searchParams.get("doctorName");
  const specialization = searchParams.get("specialization");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(!!doctorId);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "consultation",
    symptoms: "",
    doctorId: doctorId || "",
    doctorName: doctorName || "",
    specialization: specialization || "",
    status: "pending"
  });

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor details if doctorId is provided
  const fetchDoctorDetails = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/doctors/${id}`);
      if (res.ok) {
        const doctor = await res.json();
        setSelectedDoctor(doctor);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    if (doctorId) {
      fetchDoctorDetails(doctorId);
    }
  }, [doctorId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading("Booking appointment...");
    
    try {
      const appointmentData = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success("Appointment booked successfully!");
        setShowBookingForm(false);
        setFormData({
          patientName: "",
          patientEmail: "",
          patientPhone: "",
          appointmentDate: "",
          appointmentTime: "",
          appointmentType: "consultation",
          symptoms: "",
          doctorId: "",
          doctorName: "",
          specialization: "",
          status: "pending"
        });
        fetchAppointments(); // Refresh the list
      } else {
        toast.dismiss(loadingToast);
        toast.error("Failed to book appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.dismiss(loadingToast);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/appointments/${appointmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success("Appointment status updated successfully!");
        fetchAppointments(); // Refresh the list
      } else {
        toast.error("Failed to update appointment status.");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  // Delete appointment
  const deleteAppointment = async (appointmentId) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/appointments/${appointmentId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          toast.success("Appointment deleted successfully!");
          fetchAppointments(); // Refresh the list
        } else {
          toast.error("Failed to delete appointment.");
        }
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "text-green-600 bg-green-100";
      case "cancelled": return "text-red-600 bg-red-100";
      case "completed": return "text-blue-600 bg-blue-100";
      default: return "text-yellow-600 bg-yellow-100";
    }
  };

  if (loading) {
    return (
      <div className="w-11/12 mx-auto py-20 text-center">
        <p className="text-lg font-semibold">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#ff4b4b',
            },
          },
        }}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointments Dashboard</h1>
        <button
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="px-4 py-2 bg-[#435ba1] text-white rounded hover:bg-[#4c69c6] transition"
        >
          {showBookingForm ? "Cancel Booking" : "Book New Appointment"}
        </button>
      </div>

      {/* Booking Form */}
      {showBookingForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Book New Appointment</h2>
          
          {/* Doctor Information Card */}
          {selectedDoctor && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center space-x-4">
              <img
                src={selectedDoctor.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"}
                alt={selectedDoctor.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#435ba1]"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face";
                }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{selectedDoctor.name}</h3>
                <p className="text-[#435ba1] font-medium">{selectedDoctor.specialization}</p>
                <p className="text-sm text-gray-600">{selectedDoctor.hospital}</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm text-gray-600 ml-1">{selectedDoctor.rating} rating</span>
                  <span className="text-sm text-gray-600 ml-3">{selectedDoctor.experience} years experience</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient Name *</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#435ba1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="patientEmail"
                value={formData.patientEmail}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#435ba1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                type="tel"
                name="patientPhone"
                value={formData.patientPhone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#435ba1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Doctor Name</label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleInputChange}
                placeholder="Enter doctor name"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#435ba1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Appointment Date *</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#435ba1]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Appointment Time *</label>
              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#435ba1]"
              >
                <option value="">Select Time</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Appointment Type</label>
              <select
                name="appointmentType"
                value={formData.appointmentType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#435ba1]"
              >
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
                <option value="routine-checkup">Routine Checkup</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder="e.g., Cardiologist"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#435ba1]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Symptoms/Notes</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe your symptoms or reason for visit"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#435ba1]"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="px-6 py-2 bg-[#435ba1] text-white rounded hover:bg-[#4c69c6] transition"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">All Appointments ({appointments.length})</h2>
        </div>

        {appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patientEmail}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patientPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.doctorName || "Not specified"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.specialization || "General"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.appointmentTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {appointment.appointmentType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <select
                        value={appointment.status}
                        onChange={(e) => updateAppointmentStatus(appointment._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => deleteAppointment(appointment._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;