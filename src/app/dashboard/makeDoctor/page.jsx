"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Page = () => {
  const [applications, setApplications] = useState([]);

  // Load applications
  const fetchApplications = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/doctorApply`
      );
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Approve doctor
  const handleApprove = async (app) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/makeDoctor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...app, role: "doctor" }),
        }
      );

      if (res.ok) {
        Swal.fire("✅ Approved", `${app.name} is now a doctor!`, "success");
        fetchApplications();
      } else {
        Swal.fire("❌ Failed", "Could not approve doctor", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel doctor application
  const handleCancel = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/doctorApply/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        Swal.fire("🗑️ Deleted", "Application removed", "success");
        fetchApplications();
      } else {
        Swal.fire("❌ Failed", "Could not delete application", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-11/12 mx-auto py-12">
      <h1 className="text-3xl font-bold text-[#435ba1] mb-6 text-center">
        Doctor Applications
      </h1>

      {/* Table for desktop */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full border rounded-lg shadow-md bg-[#fafafa]">
          <thead className="bg-[#435ba1] text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Specialization</th>
              <th className="p-3 text-left">Hospital</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr
                  key={app._id}
                  className="border-b hover:bg-[#f0f4ff] transition"
                >
                  <td className="p-3">{app.name}</td>
                  <td className="p-3">{app.specialization}</td>
                  <td className="p-3">{app.hospital}</td>
                  <td className="p-3">{app.email}</td>
                  <td className="p-3">{app.phone}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleApprove(app)}
                      className="bg-[#43d5cb] text-white px-3 py-1 rounded-md hover:bg-[#4c69c6] transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleCancel(app._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-[#515151]">
                  No pending applications
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for mobile */}
      <div className="grid gap-4 md:hidden">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-4 rounded-lg shadow-md border"
            >
              <h2 className="text-lg font-semibold text-[#435ba1] mb-2">
                {app.name}
              </h2>
              <p>
                <strong>Specialization:</strong> {app.specialization}
              </p>
              <p>
                <strong>Hospital:</strong> {app.hospital}
              </p>
              <p>
                <strong>Email:</strong> {app.email}
              </p>
              <p>
                <strong>Phone:</strong> {app.phone}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleApprove(app)}
                  className="bg-[#43d5cb] text-white px-3 py-1 rounded-md hover:bg-[#4c69c6] transition w-1/2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleCancel(app._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition w-1/2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-[#515151]">No pending applications</p>
        )}
      </div>
    </div>
  );
};

export default Page;
