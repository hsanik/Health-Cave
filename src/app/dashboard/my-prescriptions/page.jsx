"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { PageSpinner } from "@/components/ui/loading-spinner";
import {
  FileText,
  Search,
  Calendar,
  User,
  Download,
  Eye,
  Filter,
  Pill,
} from "lucide-react";
import toast from "react-hot-toast";

const MyPrescriptionsPage = () => {
  const { data: session } = useSession();
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (session?.user?.email) {
      fetchPrescriptions();
    }
  }, [session]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/prescriptions/patient/${session.user.email}`
      );
      setPrescriptions(response.data);
      setFilteredPrescriptions(response.data);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = prescriptions;

    if (searchTerm) {
      filtered = filtered.filter(
        (prescription) =>
          prescription.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prescription.prescriptionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prescription.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((prescription) => prescription.status === statusFilter);
    }

    setFilteredPrescriptions(filtered);
  }, [searchTerm, statusFilter, prescriptions]);

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

  const handleDownload = (prescriptionId) => {
    toast("PDF download feature coming soon!", {
      icon: "ℹ️",
    });
  };

  if (loading) {
    return <PageSpinner text="Loading your prescriptions..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-[#435ba1]" />
            My Prescriptions
          </h1>
          <p className="text-gray-600 mt-1">View and download your medical prescriptions</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by doctor name, prescription number, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-600 text-sm">Total Prescriptions</p>
            <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {prescriptions.filter((p) => p.status === "active").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-600 text-sm">Expired</p>
            <p className="text-2xl font-bold text-red-600">
              {prescriptions.filter((p) => p.status === "expired").length}
            </p>
          </div>
        </div>

        {/* Prescriptions List */}
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter
                ? "Try adjusting your search or filters"
                : "You don't have any prescriptions yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-r from-[#435ba1] to-[#4c69c6] p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <span className="font-semibold text-sm">
                        {prescription.prescriptionNumber}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        prescription.status
                      )}`}
                    >
                      {prescription.status}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  {/* Doctor Info */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                      <User className="w-4 h-4" />
                      <span>Doctor</span>
                    </div>
                    <p className="font-semibold text-gray-900">{prescription.doctorName}</p>
                    <p className="text-sm text-gray-600">{prescription.doctorSpecialization}</p>
                  </div>

                  {/* Diagnosis */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Diagnosis</p>
                    <p className="text-sm text-gray-900 line-clamp-2">{prescription.diagnosis}</p>
                  </div>

                  {/* Medications Count */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Pill className="w-4 h-4" />
                      <span>{prescription.medications.length} medication(s) prescribed</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Issued: {new Date(prescription.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Valid until: {new Date(prescription.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/prescriptions/${prescription._id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#435ba1] text-white py-2 px-3 rounded-lg hover:bg-[#4c69c6] transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <button
                      onClick={() => handleDownload(prescription._id)}
                      className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPrescriptionsPage;
