"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    qualification: "",
    hospital: "",
    email: "",
    phone: "",
    language: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // add role property before sending
      const applicationData = { ...formData, role: "user" };

      const res = await fetch("http://localhost:5000/doctorApply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      if (res.ok) {
        Swal.fire({
          title: "Apply Successful!",
          text: "Your application has been submitted successfully.",
          icon: "success",
          confirmButtonColor: "#435ba1",
        });
        setFormData({
          name: "",
          specialization: "",
          experience: "",
          qualification: "",
          hospital: "",
          email: "",
          phone: "",
          language: "",
          image: "",
        });
      } else {
        Swal.fire({
          title: "❌ Failed",
          text: "There was an issue submitting your application.",
          icon: "error",
          confirmButtonColor: "#435ba1",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "⚠️ Error",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#435ba1",
      });
    }
  };

  const specializations = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Gynecologist",
    "Hematologist",
    "Infectious Disease Specialist",
    "Nephrologist",
    "Neurologist",
    "Oncologist",
    "Ophthalmologist",
    "Orthopedic Surgeon",
    "Otolaryngologist (ENT)",
    "Pediatrician",
    "Psychiatrist",
    "Pulmonologist",
    "Radiologist",
    "Rheumatologist",
    "Surgeon",
    "Urologist",
    "Dentist",
    "Physiotherapist",
    "Nutritionist",
    "Other",
  ];

  const languages = [
    "English",
    "Bengali",
    "Hindi",
    "Arabic",
    "French",
    "Spanish",
    "German",
    "Chinese",
  ];

  return (
    <div className="w-11/12 mx-auto py-16">
      <h1 className="text-3xl font-bold text-[#435ba1] mb-6 text-center">
        Become a Doctor
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-8 rounded-2xl border space-y-4"
      >
        {/* Full Name */}
        <div>
          <label className="block font-semibold mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#43d5cb]"
            required
          />
        </div>

        {/* Specialization */}
        <div>
          <label className="block font-semibold mb-1">Specialization</label>
          <select
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#43d5cb]"
            required
          >
            <option value="">Select Specialization</option>
            {specializations.map((spec, idx) => (
              <option key={idx} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Other Inputs */}
        {[
          { label: "Experience(years)", name: "experience", type: "text" },
          { label: "Qualification", name: "qualification", type: "text" },
          { label: "Hospital", name: "hospital", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone", name: "phone", type: "text" },
          { label: "Image URL", name: "image", type: "text" },
        ].map((field, idx) => (
          <div key={idx}>
            <label className="block font-semibold mb-1">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#43d5cb]"
              required
            />
          </div>
        ))}

        {/* Language Dropdown */}
        <div>
          <label className="block font-semibold mb-1">Preferred Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#43d5cb]"
            required
          >
            <option value="">Select Language</option>
            {languages.map((lang, idx) => (
              <option key={idx} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#435ba1] text-white py-2 rounded-md hover:bg-[#4c69c6] transition"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default Page;
