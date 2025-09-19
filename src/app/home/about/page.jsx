import React from "react";
import Image from "next/image";
import aboutJpg from "../../../../public/images/about.png"

const page = () => {
  return (
    <div>
      <section className="py-20 px-6 rounded-2xl mt-10">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-[#515151] dark:text-white">About - HealthCave</h2>
            <p className="mt-3 text-gray-600 dark:text-white max-w-2xl mx-auto">
              HealthCave is your trusted space for fitness, nutrition, and
              wellness. We combine expert guidance, smart tools, and a
              supportive community to help you live healthier every day.
            </p>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left - Text */}
            <div>
              <h3 className="text-xl font-semibold text-[#515151] dark:text-white">
                Why Choose HealthCave?
              </h3>
              <ul className="mt-5 space-y-4 text-[#333333] dark:text-white">
                <li className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-[#4c69c6] rounded-full mt-2 dark:text-white"></span>
                  Personalized health and fitness insights tailored to your goals.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-[#4c69c6] rounded-full mt-2 dark:text-white"></span>
                  Nutrition tracking and wellness tips for a balanced lifestyle.
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-[#4c69c6] rounded-full mt-2 dark:text-white"></span>
                  Connect with health experts and join a supportive community.
                </li>
              </ul>
            </div>

            {/* Right - Image */}
            <div className="rounded-2xl overflow-hidden">
              <Image
                src={aboutJpg}
                alt="Health & Wellness"
                className="object-cover"
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
