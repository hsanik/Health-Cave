"use client";
import React, { useState } from "react";

const Page = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState("");

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!height || !weight) return;

    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(bmiValue);

    if (bmiValue < 18.5) setStatus("Underweight");
    else if (bmiValue >= 18.5 && bmiValue < 24.9) setStatus("Normal weight");
    else if (bmiValue >= 25 && bmiValue < 29.9) setStatus("Overweight");
    else setStatus("Obese");
  };

  return (
    <section className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side: BMI Calculator */}
        <div className="border-2 border-[#e5e7eb] rounded-2xl p-8 md:p-20 transition-all duration-300 bg-white dark:bg-[#1a1a1a]">
          <h2 className="text-3xl font-semibold text-center text-[#136afb] dark:text-white mb-6">
            BMI Calculator
          </h2>

          <form onSubmit={calculateBMI} className="flex flex-col gap-4">
            <input
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43d5cb]"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43d5cb]"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#136afb] hover:bg-[#43d5cb] text-white font-semibold rounded-lg transition cursor-pointer"
            >
              Calculate
            </button>
          </form>

          {bmi && (
            <div className="mt-6 text-center">
              <p className="text-xl font-semibold text-[#515151] dark:text-white">
                Your BMI: <span className="text-[#43d5cb]">{bmi}</span>
              </p>
              <p className="text-lg text-[#515151] dark:text-gray-200">
                Status: <span className="font-medium">{status}</span>
              </p>
            </div>
          )}
        </div>

        {/* Right Side: BMI Categories */}
        <div className="border-2 border-[#e5e7eb] rounded-2xl p-8 md:p-20 transition-all duration-300 bg-white dark:bg-[#1a1a1a]">
          <h2 className="text-3xl font-semibold text-center text-[#136afb] dark:text-white mb-6">
            BMI Categories
          </h2>
          <ul className="space-y-4 text-lg">
            <li className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-semibold text-[#515151] dark:text-gray-200">
                Underweight
              </span>
              <span className="text-[#43d5cb]">&lt; 18.5</span>
            </li>
            <li className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-semibold text-[#515151] dark:text-gray-200">
                Normal weight
              </span>
              <span className="text-[#43d5cb]">18.5 – 24.9</span>
            </li>
            <li className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-semibold text-[#515151] dark:text-gray-200">
                Overweight
              </span>
              <span className="text-[#43d5cb]">25 – 29.9</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold text-[#515151] dark:text-gray-200">
                Obese
              </span>
              <span className="text-[#43d5cb]">30+</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

  );
};

export default Page;
