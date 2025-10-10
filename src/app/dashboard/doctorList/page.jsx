"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Page = () => {
  const [doctors, setDoctors] = useState([]);

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:5000/doctors");
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Remove doctor
  const handleRemove = async (id, name) => {
    Swal.fire({
      title: `Remove ${name}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#435ba1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5000/doctors/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            Swal.fire("Removed!", `${name} has been deleted.`, "success");
            fetchDoctors();
          } else {
            Swal.fire("Error!", "Failed to remove doctor.", "error");
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  return (
    <div className="w-11/12 mx-auto py-12">
      <h1 className="text-3xl font-bold text-[#136afb] mb-8 text-center">
        All Doctors
      </h1>

      {/* Table view for large screens */}
      <div className="hidden md:block overflow-x-auto shadow-md rounded-lg bg-[#fafafa]">
        <table className="w-full border-collapse">
          <thead className="bg-[#136afb] text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Specialization</th>
              <th className="p-3 text-left">Experience</th>
              <th className="p-3 text-left">Qualification</th>
              <th className="p-3 text-left">Hospital</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <tr
                  key={doctor._id}
                  className="border-b hover:bg-[#f0f4ff] transition"
                >
                  <td className="p-3 font-medium">{doctor.name}</td>
                  <td className="p-3">{doctor.specialization}</td>
                  <td className="p-3">{doctor.experience}</td>
                  <td className="p-3">{doctor.qualification}</td>
                  <td className="p-3">{doctor.hospital}</td>
                  <td className="p-3">{doctor.email}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleRemove(doctor._id, doctor.name)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-4 text-center text-[#515151] font-medium"
                >
                  No doctors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card view for small screens */}
      <div className="md:hidden grid grid-cols-1 gap-6">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-[#fafafa] shadow-md rounded-xl p-4 border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#43d5cb]"
                />
                <div>
                  <h2 className="text-lg font-semibold text-[#136afb]">
                    {doctor.name}
                  </h2>
                  <p className="text-sm text-[#515151]">
                    {doctor.specialization}
                  </p>
                  <p className="text-sm text-gray-500">{doctor.hospital}</p>
                </div>
              </div>

              <div className="mt-3 text-sm text-[#515151] space-y-1">
                <p>
                  <span className="font-medium">Experience:</span>{" "}
                  {doctor.experience}
                </p>
                <p>
                  <span className="font-medium">Qualification:</span>{" "}
                  {doctor.qualification}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {doctor.email}
                </p>
              </div>

              <button
                onClick={() => handleRemove(doctor._id, doctor.name)}
                className="w-full mt-4 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-[#515151]">No doctors found</p>
        )}
      </div>
    </div>
  );
};

export default Page;
