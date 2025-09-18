import React from "react";
import Image from "next/image";
import bannerImg from "../../../../public/images/banner.jpg";

const Banner = () => {
    return (
        <section className="relative h-[80vh] w-full flex items-center rounded-2xl overflow-hidden">
            {/* Background Image */}
            <Image
                src={bannerImg}
                alt="Health and Wellness Banner"
                fill
                className="object-cover object-top object-center"
                priority
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#435ba1] to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl px-6 lg:px-16 text-center lg:text-left">
                <h1 className="text-[#43d5cb] text-xl pb-3 tracking-widest">Welcome to HealthCave</h1>
                <h1 className="text-3xl lg:text-6xl font-light text-white leading-tight">
                    Empower Your Health & Wellness Journey <br /> <span className="text-3xl lg:text-6xl font-semibold text-white leading-tight">with HealthCave</span>
                </h1>
                <p className="mt-4 text-base lg:text-lg text-gray-200">
                    Track your fitness, manage nutrition, and connect with health experts — all in one place.
                </p>
                <button className="mt-6 px-6 py-3 cursor-pointer rounded-lg font-semibold transition border bg-transparent border-[#43d5cb] text-[#fafafa] hover:bg-[#fafafa] hover:text-black hover:border-transparent">
                    Get Started
                </button>

            </div>
        </section>
    );
};

export default Banner;
