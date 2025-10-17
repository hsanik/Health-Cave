"use client";

import React from "react";
import Image from "next/image";
import doctors01 from "../../../../public/about/doctor consulting.png";
import doctors02 from "../../../../public/about/doctor-consulting.jpg";
import doctors03 from "../../../../public/about/doctors.jpg";

const AboutPage = () => {
  return (
    <div className="w-full py-20">
      <div className="w-full space-y-24">
        {/* Heading */}
        <div className="text-center mb-16 px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#000] dark:text-[#43d5cb]">
            About HealthCave
          </h2>
          <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            HealthCave is your trusted space for fitness, nutrition, and wellness.  
            We combine expert guidance, smart tools, and a supportive community  
            to help you live a healthier life every day.
          </p>
        </div>

        {/* Section 1 */}
        <div className="grid md:grid-cols-2 items-center gap-12 px-6 lg:px-16">
          {/* Image */}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
            <Image
              src={doctors01}
              alt="Personalized Healthcare"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
              priority
            />
          </div>

          {/* Text */}
          <div>
            <h3 className="text-2xl font-semibold text-black mb-4">
              Personalized Care for Your Health
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-5">
              We believe every person’s health journey is unique. That’s why our
              platform delivers personalized fitness insights, wellness tracking,
              and nutrition guidance — all designed to fit your goals.
            </p>
            <ul className="space-y-3 text-[#333] dark:text-gray-200">
              <li>✔ Tailored fitness and diet plans</li>
              <li>✔ AI-driven health tracking</li>
              <li>✔ Real-time progress monitoring</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid md:grid-cols-2 items-center gap-12 px-6 lg:px-16">
          {/* Text */}
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-semibold text-black mb-4">
              Expert Guidance, Anytime You Need
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-5">
              Get insights and tips from certified professionals in fitness,
              nutrition, and mental health. Our experts ensure that you stay on
              the right track toward a balanced and fulfilling lifestyle.
            </p>
            <ul className="space-y-3 text-[#333] dark:text-gray-200">
              <li>✔ Connect with health professionals</li>
              <li>✔ Verified expert advice</li>
              <li>✔ 24/7 availability and support</li>
            </ul>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2 relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
            <Image
              src={doctors02}
              alt="Expert Guidance"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
            />
          </div>
        </div>

        {/* Section 3 */}
        <div className="grid md:grid-cols-2 items-center gap-12 px-6 lg:px-16">
          {/* Image */}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
            <Image
              src={doctors03}
              alt="Community Wellness"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
            />
          </div>

          {/* Text */}
          <div>
            <h3 className="text-2xl font-semibold text-black mb-4">
              Join a Thriving Health Community
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-5">
              HealthCave isn’t just an app — it’s a movement. Engage with a
              vibrant community that supports, inspires, and celebrates every
              small step toward better health.
            </p>
            <ul className="space-y-3 text-[#333] dark:text-gray-200">
              <li>✔ Friendly and inclusive environment</li>
              <li>✔ Wellness challenges and group goals</li>
              <li>✔ Continuous motivation and learning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
