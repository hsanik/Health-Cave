"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { PageSpinner } from "@/components/ui/loading-spinner";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const AdminPrescriptionsPage = () => {
  const { data: session } = useSession();
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchAllPrescriptions();
    }
  }, [session]);

  const fetchAllPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/prescriptions`
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
          prescription.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prescription.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prescription.prescriptionNumber?.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <PageSpinner text="Loading prescriptions..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-[#435ba1]" />
            All Prescriptions (Admin)
          </h1>
          <p className="text-gray-600 mt-1">Monitor all prescriptions across the platform</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by patient, doctor, or prescription number..."
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-600 text-sm">This Month</p>
            <p className="text-2xl font-bold text-blue-600">
              {
                prescriptions.filter((p) => {
                  const date = new Date(p.createdAt);
                  const now = new Date();
                  return (
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </p>
          </div>
        </div>

        {/* Prescriptions Table */}
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter
                ? "Try adjusting your search or filters"
                : "No prescriptions have been created yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prescription #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diagnosis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                  {filteredPrescriptions.map((prescription) => (
                    <tr key={prescription._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {prescription.prescriptionNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{prescription.doctorName}</div>
                        <div className="text-sm text-gray-500">
                          {prescription.doctorSpecialization}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {prescription.patientName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {prescription.patientAge} yrs, {prescription.patientGender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {prescription.diagnosis || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            prescription.status
                          )}`}
                        >
                          {prescription.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/prescriptions/${prescription._id}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPrescriptionsPage;
