"use client";
import React from "react";
import Marquee from "react-fast-marquee";
import {
  Stethoscope,
  HeartPulse,
  Brain,
  Syringe,
  Activity,
  ShieldCheck,
} from "lucide-react";

const MarqueeSection = () => {
  const items = [
    {
      icon: <Stethoscope className="w-5 h-5 text-[#136afb]" />,
      text: "Professional Doctors",
    },
    {
      icon: <HeartPulse className="w-5 h-5 text-[#42a5f6]" />,
      text: "24/7 Patient Care",
    },
    {
      icon: <Brain className="w-5 h-5 text-[#43d5cb]" />,
      text: "Expert Neurologists",
    },
    {
      icon: <Syringe className="w-5 h-5 text-[#136afb]" />,
      text: "Advanced Treatments",
    },
    {
      icon: <Activity className="w-5 h-5 text-[#42a5f6]" />,
      text: "Trusted Diagnostics",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#43d5cb]" />,
      text: "Quality You Can Trust",
    },
  ];

  return (
    <div className="py-8">
      <Marquee pauseOnHover={true} gradient={false} speed={45}>
        <div className="flex items-center gap-10 px-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-white shadow-sm px-5 py-2 rounded-full border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              {item.icon}
              <span className="text-sm font-medium text-[#000000] whitespace-nowrap">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default MarqueeSection;
