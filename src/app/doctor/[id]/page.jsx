"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const DoctorDetails = () => {
  const params = useParams(); // get id from URL
  const { id } = params;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(
          `https://health-cave-server.vercel.app/doctors/${id}`
        ); // your backend API
        if (!res.ok) throw new Error("Doctor not found");
        const data = await res.json();
        setDoctor(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="w-11/12 mx-auto py-20 text-center">
        <p className="text-lg font-semibold">Loading doctor details...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="w-11/12 mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">Doctor not found</h1>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto py-20">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image */}
        <div className="flex items-center justify-center bg-gray-100">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Details */}
        <div className="p-6 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
          <p className="text-gray-600 mb-2">{doctor.specialization}</p>
          <p className="text-yellow-500 font-medium mb-4">⭐ {doctor.rating}</p>

          <div className="space-y-2">
            <p>
              <span className="font-semibold">Qualification:</span>{" "}
              {doctor.qualification}
            </p>
            <p>
              <span className="font-semibold">Experience:</span>{" "}
              {doctor.experience}
            </p>
            <p>
              <span className="font-semibold">Hospital:</span> {doctor.hospital}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {doctor.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {doctor.phone}
            </p>
            <p>
              <span className="font-semibold">Languages:</span>{" "}
              {doctor.languages?.join(", ")}
            </p>

            <a
              href={`/book-appointment/${doctor._id}`} // replace with your booking page route
              className="inline-block px-4 py-2 bg-[#435ba1] text-white text-sm font-medium rounded hover:bg-[#4c69c6] transition mt-4"
            >
              Book An Appointment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
