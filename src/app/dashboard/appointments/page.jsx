"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Plus,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, confirmed, cancelled, completed

  // Auto-load appointments on page load
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`
      );
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments/${appointmentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        // Auto-update data without loading spinner
        await fetchAppointments();
        Swal.fire({
          title: "Success!",
          text: `Appointment ${newStatus} successfully.`,
          icon: "success",
          confirmButtonColor: "#435ba1",
        });
      } else {
        throw new Error("Failed to update appointment");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update appointment status.",
        icon: "error",
        confirmButtonColor: "#435ba1",
      });
    }
  };

  const deleteAppointment = async (appointmentId, patientName) => {
    const result = await Swal.fire({
      title: "Delete Appointment?",
      text: `Are you sure you want to delete the appointment for ${patientName}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments/${appointmentId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Auto-update data without loading spinner
          await fetchAppointments();
          Swal.fire({
            title: "Deleted!",
            text: "The appointment has been deleted successfully.",
            icon: "success",
            confirmButtonColor: "#435ba1",
          });
        } else {
          throw new Error("Failed to delete appointment");
        }
      } catch (error) {
        console.error("Error deleting appointment:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete appointment. Please try again.",
          icon: "error",
          confirmButtonColor: "#435ba1",
        });
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return appointment.status === filter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not set";
    return timeString;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <p className="text-lg font-semibold">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage patient appointments and schedules.
          </p>
        </div>
        <Button onClick={() => (window.location.href = "/doctors")}>
          <Plus className="w-4 h-4 mr-2" />
          Book New Appointment
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          {["all", "pending", "confirmed", "cancelled", "completed"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                No{" "}
                {filter === "all"
                  ? "Appointments"
                  : filter.charAt(0).toUpperCase() +
                    filter.slice(1) +
                    " Appointments"}{" "}
                Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "all"
                  ? "No appointments have been scheduled yet."
                  : `No ${filter} appointments found.`}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment._id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Left Section - Patient & Doctor Info */}
                <div className="flex items-start space-x-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    {appointment.doctorImage ? (
                      <Image
                        src={appointment.doctorImage}
                        alt={appointment.doctorName}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {appointment.doctorName}
                      </h3>
                      {getStatusIcon(appointment.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {appointment.doctorSpecialization}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Patient: {appointment.patientName}
                    </p>

                    {/* Appointment Details */}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(appointment.appointmentDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{formatTime(appointment.appointmentTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{appointment.patientPhone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{appointment.patientEmail}</span>
                      </div>
                    </div>

                    {appointment.symptoms && (
                      <div className="mt-2 flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Symptoms:</span>{" "}
                            {appointment.symptoms}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Section - Status & Actions */}
                <div className="flex flex-col items-end space-y-3">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        appointment.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      Payment: {appointment.paymentStatus}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {appointment.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "confirmed"
                            )
                          }
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "cancelled"
                            )
                          }
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateAppointmentStatus(appointment._id, "completed")
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Mark Complete
                      </Button>
                    )}

                    {/* Delete Button - Available for all appointments */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        deleteAppointment(
                          appointment._id,
                          appointment.patientName
                        )
                      }
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
