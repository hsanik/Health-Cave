"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { PageSpinner } from "@/components/ui/loading-spinner";
import { formatDoctorName } from "@/utils/doctorUtils";
import {
  getAvailabilityStatus,
  getNextAvailable,
  processDoctorAvailability
} from "@/utils/availabilityUtils";
import {
  Search,
  Filter,
  MapPin,
  Star,
  DollarSign,
  Users,
  ChevronDown,
  X,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 9;
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);

        // First, initialize missing fields for existing doctors (one-time setup)
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors/initialize-fields`
          );
        } catch (initError) {
          console.log(
            "Field initialization skipped or failed:",
            initError.message
          );
        }

        // Fetch doctors data
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`
        );
        const doctorsData = response.data;

        // Process and validate doctor data with dynamic availability
        const processedDoctors = doctorsData.map((doctor) => {
          const baseDoctor = {
            ...doctor,
            // Ensure all fields have proper types and fallbacks
            name: String(doctor.name || ""),
            specialization: String(doctor.specialization || ""),
            hospital: String(doctor.hospital || ""),
            rating: Number(doctor.rating) || 4.5,
            consultationFee: Number(doctor.consultationFee) || 100,
            patients: Number(doctor.patients) || 0,
          };

          // Add computed availability based on schedule
          return processDoctorAvailability(baseDoctor);
        });

        setDoctors(processedDoctors);
        setFilteredDoctors(processedDoctors);

        // Extract unique specializations for filter
        const uniqueSpecs = [
          ...new Set(processedDoctors.map((doc) => doc.specialization)),
        ];
        setSpecializations(uniqueSpecs);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors based on search and filters
  useEffect(() => {
    let filtered = doctors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.hospital?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Specialization filter
    if (selectedSpecialization) {
      filtered = filtered.filter(
        (doctor) => doctor.specialization === selectedSpecialization
      );
    }

    // Availability filter
    if (selectedAvailability) {
      filtered = filtered.filter(
        (doctor) => doctor.availabilityStatus === selectedAvailability
      );
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter((doctor) => {
        const fee = doctor.consultationFee;
        const min = priceRange.min ? parseInt(priceRange.min) : 0;
        const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
        return fee >= min && fee <= max;
      });
    }

    setFilteredDoctors(filtered);
  }, [
    doctors,
    searchTerm,
    selectedSpecialization,
    selectedAvailability,
    priceRange,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialization("");
    setSelectedAvailability("");
    setPriceRange({ min: "", max: "" });
  };

  const hasActiveFilters =
    searchTerm ||
    selectedSpecialization ||
    selectedAvailability ||
    priceRange.min ||
    priceRange.max;

  // Pagination logic
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialization, selectedAvailability, priceRange]);

  if (loading) {
    return <PageSpinner text="Loading doctors..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Doctor
          </h1>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar with Filter Button */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search doctors by name, specialization, or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors ${showFilters
                ? "bg-[#435ba1] text-white border-[#435ba1]"
                : "border-gray-300 hover:bg-gray-50"
                }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""
                  }`}
              />
            </button>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-end mb-4">
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                <span>Clear All Filters</span>
              </button>
            </div>
          )}

          {/* Filter Options - Shown below search box */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Specialization Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent text-sm"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent text-sm"
                  >
                    <option value="">All</option>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Fee ($)
                  </label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Fee ($)
                  </label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#435ba1] focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {indexOfFirstDoctor + 1}-{Math.min(indexOfLastDoctor, filteredDoctors.length)} of {filteredDoctors.length} doctors
            {filteredDoctors.length !== doctors.length && ` (filtered from ${doctors.length} total)`}
          </p>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Active filters:</span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Search: {searchTerm}
                </span>
              )}
              {selectedSpecialization && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {selectedSpecialization}
                </span>
              )}
              {selectedAvailability && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  {selectedAvailability}
                </span>
              )}
              {(priceRange.min || priceRange.max) && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  ${priceRange.min || "0"} - ${priceRange.max || "∞"}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No doctors found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters to find more
                doctors.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="bg-[#435ba1] text-white px-4 py-2 rounded-lg hover:bg-[#4c69c6] transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Doctor Image */}
                  <div className="relative h-64 bg-gray-200">
                    {doctor.image &&
                      doctor.image.trim() !== "" &&
                      !doctor.image.includes("imgbox.com") &&
                      (doctor.image.startsWith('http://') || doctor.image.startsWith('https://')) ? (
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                        <Users className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    {/* Availability Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${doctor.availabilityStatus === "Available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {doctor.availabilityStatus}
                      </span>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {formatDoctorName(doctor.name)}
                        </h3>
                        <p className="text-[#435ba1] font-medium text-sm">
                          {String(doctor.specialization)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">
                          {Number(doctor.rating) || 0}
                        </span>
                      </div>
                    </div>

                    {/* Hospital */}
                    {doctor.hospital && (
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {String(doctor.hospital)}
                        </span>
                      </div>
                    )}

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Consultation Fee</p>
                          <p className="text-sm font-semibold text-gray-900">
                            ${Number(doctor.consultationFee) || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Patients</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {Number(doctor.patients) || 0}+
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/doctors/${doctor._id}`}
                        className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        View Profile
                      </Link>
                      <Link
                        href={`/book-appointment/${doctor._id}`}
                        className="flex-1 bg-[#435ba1] text-white text-center py-2 px-4 rounded-lg hover:bg-[#4c69c6] transition-colors text-sm font-medium"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;

                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
