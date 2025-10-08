"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`);
        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="w-11/12 mx-auto py-20">
      <div className="px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-8">
          Our Expert Doctors
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor._id} // MongoDB uses _id
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-60 object-cover"
              />

              <div className="p-4">
                <h2 className="text-2xl font-semibold">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.specialization}</p>
                <p className="text-yellow-500 font-medium">
                  ⭐ {doctor.rating}
                </p>

                <div className="mt-4">
                  <Link
                    href={`/doctor/${doctor._id}`}
                    className="inline-block px-4 py-2 bg-[#435ba1] text-white text-sm font-medium rounded hover:bg-[#4c69c6] transition"
                  >
                    Show Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
