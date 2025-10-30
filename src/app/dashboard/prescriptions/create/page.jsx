"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FileText,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  User,
  Calendar,
  Stethoscope,
  Pill,
} from "lucide-react";
import Link from "next/link";

const CreatePrescriptionPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paidAppointments, setPaidAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [formData, setFormData] = useState({
    appointmentId: "",
    patientName: "",
    patientAge: "",
    patientGender: "Male",
    patientId: "",
    diagnosis: "",
    medications: [
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
    labTests: [],
    followUpDate: "",
    notes: "",
  });

  const [labTestInput, setLabTestInput] = useState("");

  // Fetch paid appointments
  React.useEffect(() => {
    if (session?.user?.email) {
      fetchPaidAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  const fetchPaidAppointments = async () => {
    try {
      console.log("Fetching appointments for doctor:", session.user.email);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/appointments/doctor/${session.user.email}/paid`
      );
      console.log("Appointments received:", response.data);
      setPaidAppointments(response.data);
      if (response.data.length === 0) {
        toast("No appointments found. Create an appointment first.", { icon: "ℹ️" });
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Failed to load appointments");
    }
  };

  const handleAppointmentSelect = (e) => {
    const appointmentId = e.target.value;
    setFormData((prev) => ({ ...prev, appointmentId }));

    if (appointmentId) {
      const appointment = paidAppointments.find((apt) => apt._id === appointmentId);
      if (appointment) {
        setSelectedAppointment(appointment);
        setFormData((prev) => ({
          ...prev,
          appointmentId: appointment._id,
          patientName: appointment.patientName || "",
          patientAge: appointment.patientAge || "",
          patientGender: appointment.patientGender || "Male",
          patientId: appointment.userId || appointment.patientEmail || "",
        }));
      }
    } else {
      setSelectedAppointment(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      medications: updatedMedications,
    }));
  };

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    }));
  };

  const removeMedication = (index) => {
    if (formData.medications.length === 1) {
      toast.error("At least one medication is required");
      return;
    }
    const updatedMedications = formData.medications.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      medications: updatedMedications,
    }));
  };

  const addLabTest = () => {
    if (labTestInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        labTests: [...prev.labTests, labTestInput.trim()],
      }));
      setLabTestInput("");
    }
  };

  const removeLabTest = (index) => {
    setFormData((prev) => ({
      ...prev,
      labTests: prev.labTests.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.patientName || !formData.patientAge || !formData.diagnosis) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.medications.some((med) => !med.name || !med.dosage || !med.frequency)) {
      toast.error("Please complete all medication details");
      return;
    }

    try {
      setLoading(true);

      const prescriptionData = {
        ...formData,
        doctorId: session?.user?.email,
        doctorName: session?.user?.name,
        doctorSpecialization: session?.user?.specialization || "General Physician",
        patientId: formData.patientId || formData.patientName.toLowerCase().replace(/\s+/g, ""),
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/prescriptions`,
        prescriptionData
      );

      toast.success("Prescription created successfully!");
      router.push("/dashboard/prescriptions");
    } catch (error) {
      console.error("Failed to create prescription:", error);
      toast.error("Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/prescriptions"
            className="inline-flex items-center gap-2 text-[#435ba1] hover:text-[#4c69c6] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Prescriptions
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-[#435ba1]" />
            Create New Prescription
          </h1>
          <p className="text-gray-600 mt-1">Fill in the details to create a digital prescription</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Appointment Selection */}
          <div className="bg-blue-50 border-l-4 border-[#435ba1] rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#435ba1]" />
              Select Paid Appointment
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose from paid appointments (Recommended)
              </label>
              <select
                value={formData.appointmentId}
                onChange={handleAppointmentSelect}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
              >
                <option value="">-- Select a paid appointment or enter manually --</option>
                {paidAppointments.map((apt) => (
                  <option key={apt._id} value={apt._id}>
                    {apt.patientName} - {new Date(apt.appointmentDate).toLocaleDateString()} at{" "}
                    {apt.appointmentTime} (${apt.amount || apt.consultationFee})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select a paid appointment to auto-fill patient details, or leave blank to enter manually
              </p>
            </div>
            {selectedAppointment && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Patient:</strong> {selectedAppointment.patientName}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Date:</strong>{" "}
                  {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Payment:</strong>{" "}
                  <span className="text-green-600 font-semibold">✓ Paid</span>
                </p>
              </div>
            )}
            {paidAppointments.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  No paid appointments available. Patients must complete payment before you can issue
                  prescriptions.
                </p>
              </div>
            )}
          </div>

          {/* Patient Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#435ba1]" />
              Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                  readOnly={!!selectedAppointment}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent ${
                    selectedAppointment ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Email/ID
                </label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  readOnly={!!selectedAppointment}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent ${
                    selectedAppointment ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter patient email or ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="150"
                  readOnly={!!selectedAppointment}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent ${
                    selectedAppointment ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="patientGender"
                  value={formData.patientGender}
                  onChange={handleInputChange}
                  required
                  disabled={!!selectedAppointment}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent ${
                    selectedAppointment ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#435ba1]" />
              Diagnosis
            </h2>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
              placeholder="Enter diagnosis details..."
            />
          </div>

          {/* Medications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#435ba1]" />
                Medications
              </h2>
              <button
                type="button"
                onClick={addMedication}
                className="flex items-center gap-2 text-[#435ba1] hover:text-[#4c69c6] text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Medication
              </button>
            </div>

            <div className="space-y-4">
              {formData.medications.map((medication, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Medication {index + 1}</h3>
                    {formData.medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medicine Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                        placeholder="e.g., Amoxicillin"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosage <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={medication.frequency}
                        onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                        placeholder="e.g., 3 times daily"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                        placeholder="e.g., 7 days"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructions
                      </label>
                      <input
                        type="text"
                        value={medication.instructions}
                        onChange={(e) =>
                          handleMedicationChange(index, "instructions", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                        placeholder="e.g., After meals"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lab Tests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lab Tests (Optional)</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={labTestInput}
                onChange={(e) => setLabTestInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLabTest())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                placeholder="Enter lab test name and press Enter"
              />
              <button
                type="button"
                onClick={addLabTest}
                className="px-4 py-2 bg-[#435ba1] text-white rounded-lg hover:bg-[#4c69c6] transition-colors"
              >
                Add
              </button>
            </div>
            {formData.labTests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.labTests.map((test, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {test}
                    <button
                      type="button"
                      onClick={() => removeLabTest(index)}
                      className="hover:text-blue-900"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#435ba1]" />
              Additional Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                  placeholder="Any additional instructions or notes..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-[#435ba1] text-white px-6 py-3 rounded-lg hover:bg-[#4c69c6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Save className="w-5 h-5" />
              {loading ? "Creating..." : "Create Prescription"}
            </button>
            <Link
              href="/dashboard/prescriptions"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrescriptionPage;
