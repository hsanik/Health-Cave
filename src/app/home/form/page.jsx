'use client';

import React, { useState } from 'react';

const Page = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    concern: '',
    query: ''
  });

  const concerns = [
    'General Inquiry',
    'Appointment Booking',
    'Medical Advice',
    'Feedback',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted!');
    setFormData({ name: '', email: '', concern: '', query: '' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:py-12">
      
      {/* Top Heading and Subtext */}
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-4xl font-semibold text-gray-900 mb-2 dark:text-white">
          Get in Touch with Us
        </h1>
        <p className="text-gray-600 text-lg dark:text-white">
          Have a question, feedback, or need assistance? Fill out the form below and our team will get back to you as soon as possible.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl  rounded-lg shadow-md p-6 md:p-8"
      >
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Concern */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="concern">
            What is your concern?
          </label>
          <select
            name="concern"
            value={formData.concern}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Concern</option>
            {concerns.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Query */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="query">
            Your Query
          </label>
          <textarea
            name="query"
            value={formData.query}
            onChange={handleChange}
            placeholder="Write your query here..."
            rows="5"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-[#43d5cb] cursor-pointer transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
