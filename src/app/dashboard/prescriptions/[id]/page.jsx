"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { PageSpinner } from "@/components/ui/loading-spinner";
import {
  FileText,
  ArrowLeft,
  Download,
  Printer,
  Calendar,
  User,
  Stethoscope,
  Pill,
  ClipboardList,
  Edit,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { downloadPrescriptionPDF } from "@/utils/pdfGenerator";

const PrescriptionDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPrescription();
    }
  }, [params.id]);

  const fetchPrescription = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/prescriptions/${params.id}`
      );
      setPrescription(response.data);
    } catch (error) {
      console.error("Failed to fetch prescription:", error);
      toast.error("Failed to load prescription");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      await downloadPrescriptionPDF(prescription);
      toast.success("Prescription PDF downloaded successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  const handleSendEmail = async () => {
    if (!prescription.patientId || !prescription.patientId.includes('@')) {
      toast.error("Invalid patient email address");
      return;
    }

    try {
      const loadingToast = toast.loading("Sending email...");
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/prescriptions/${prescription._id}/send-email`
      );
      toast.dismiss(loadingToast);
      toast.success(`Prescription sent to ${prescription.patientId}`);
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("Failed to send email");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return <PageSpinner text="Loading prescription..." />;
  }

  if (!prescription) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Prescription Not Found</h2>
          <p className="text-gray-600 mb-4">
            The prescription you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/dashboard/prescriptions"
            className="inline-flex items-center gap-2 bg-[#435ba1] text-white px-4 py-2 rounded-lg hover:bg-[#4c69c6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Prescriptions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Hidden when printing */}
        <div className="mb-6 print:hidden">
          <Link
            href="/dashboard/prescriptions"
            className="inline-flex items-center gap-2 text-[#435ba1] hover:text-[#4c69c6] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Prescriptions
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-8 h-8 text-[#435ba1]" />
                Prescription Details
              </h1>
              <p className="text-gray-600 mt-1">{prescription.prescriptionNumber}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/dashboard/prescriptions/${prescription._id}/edit`}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-2 px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors"
                title="Send prescription to patient email"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-[#435ba1] text-white rounded-lg hover:bg-[#4c69c6] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Prescription Content - Printable */}
        <div className="bg-white rounded-lg shadow-md p-8 print:shadow-none">
          {/* Header */}
          <div className="border-b-2 border-[#435ba1] pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#435ba1]">Medical Prescription</h2>
                <p className="text-gray-600 mt-1">
                  Prescription #: {prescription.prescriptionNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Date Issued</p>
                <p className="font-semibold">
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Doctor Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 font-medium">{prescription.doctorName}</p>
              <p className="text-gray-600">{prescription.doctorSpecialization}</p>
              <p className="text-gray-600 text-sm mt-1">{prescription.doctorId}</p>
            </div>
          </div>

          {/* Patient Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-[#435ba1]" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{prescription.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Patient ID</p>
                <p className="font-medium text-gray-900">{prescription.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium text-gray-900">{prescription.patientAge} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium text-gray-900">{prescription.patientGender}</p>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#435ba1]" />
              Diagnosis
            </h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-900">{prescription.diagnosis}</p>
            </div>
          </div>

          {/* Medications */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Pill className="w-5 h-5 text-[#435ba1]" />
              Prescribed Medications
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Medicine
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Dosage
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Frequency
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Instructions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {prescription.medications.map((medication, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {medication.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{medication.dosage}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{medication.frequency}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {medication.duration || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {medication.instructions || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lab Tests */}
          {prescription.labTests && prescription.labTests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#435ba1]" />
                Recommended Lab Tests
              </h3>
              <div className="bg-yellow-50 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1">
                  {prescription.labTests.map((test, index) => (
                    <li key={index} className="text-gray-900">
                      {test}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Follow-up Date */}
          {prescription.followUpDate && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#435ba1]" />
                Follow-up Appointment
              </h3>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-gray-900">
                  {new Date(prescription.followUpDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {prescription.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900">{prescription.notes}</p>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="mb-6 print:hidden">
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(
                  prescription.status
                )}`}
              >
                Status: {prescription.status}
              </span>
              <span className="text-sm text-gray-600">
                Valid until: {new Date(prescription.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>This is a digitally generated prescription.</p>
                <p>For any queries, please contact the doctor.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">Doctor's Signature</p>
                <div className="border-t border-gray-400 w-48 pt-2">
                  <p className="text-sm font-medium text-gray-900">{prescription.doctorName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailPage;
