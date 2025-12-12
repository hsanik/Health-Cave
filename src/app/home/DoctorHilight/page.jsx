"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Star, Users, MapPin, DollarSign } from "lucide-react";
import { formatDoctorName } from "@/utils/doctorUtils";
import { processDoctorAvailability } from "@/utils/availabilityUtils";
import { PageSpinner } from "@/components/ui/loading-spinner";

const TopRatedDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`
        );

        // Sort doctors by rating descending, take top 6
        const sorted = response.data
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 6)
          .map((doc) => processDoctorAvailability(doc));

        setDoctors(sorted);
      } catch (error) {
        console.error("Failed to load top rated doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDoctors();
  }, []);

  if (loading) return <PageSpinner text="Loading top doctors..." />;

  return (
    <section className="py-20 dark:bg-[#0a0a0a]">
      <div className="text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-black mb-4 dark:text-white">
          Our Expert Doctors
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          Meet our most trusted and highly rated medical professionals,
          dedicated to your well-being and personalized healthcare.
        </p>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white dark:bg-[#121212] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Doctor Image */}
              <div className="relative h-60 bg-gray-200">
                {doctor.image &&
                (doctor.image.startsWith("http://") ||
                  doctor.image.startsWith("https://")) ? (
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#136afb]/10 to-[#43d5cb]/10">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-[#43d5cb]/20 text-[#136afb] px-3 py-1 rounded-full text-xs font-semibold">
                  {doctor.availabilityStatus || "Available"}
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-6 text-left">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-black dark:text-white mb-1">
                      {formatDoctorName(doctor.name)}
                    </h3>
                    <p className="text-[#136afb] font-medium text-sm">
                      {String(doctor.specialization)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {Number(doctor.rating) || 0}
                    </span>
                  </div>
                </div>

                {doctor.hospital && (
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {String(doctor.hospital)}
                    </span>
                  </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Fee</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${Number(doctor.consultationFee) || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#42a5f6]" />
                    <div>
                      <p className="text-xs text-gray-500">Patients</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {Number(doctor.patients) || 0}+
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                    href={`/doctors/${doctor._id}`}
                    className="flex-1 bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/book-appointment/${doctor._id}`}
                    className="flex-1 bg-[#136afb] text-white text-center py-2 px-4 rounded-lg hover:bg-[#42a5f6] transition-colors text-sm font-medium"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        <div className="mt-12">
          <Link
            href="/doctors"
            className="inline-block bg-[#136afb] text-white px-6 py-3 rounded-lg hover:bg-[#43d5cb] transition-colors font-medium"
          >
            See More Doctors
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopRatedDoctors;
