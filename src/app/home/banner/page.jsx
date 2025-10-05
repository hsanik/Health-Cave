import React from "react";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import bannerImg from "../../../../public/images/banner.svg";

const Banner = () => {
  return (
    <section className="w-full">
      {/* Search Bar (Top of Banner) */}
      <div className="mx-auto mb-6 bg-white rounded-2xl border flex items-center px-4 py-2">
        <FiSearch className="text-[#136afb] text-xl mr-3" />
        <input
          type="text"
          placeholder="Search By Doctor Name"
          className="flex-1 bg-transparent outline-none text-[#515151] placeholder-[#42a5f6]"
        />
        <button className="ml-3 px-4 py-2 bg-[#136afb] text-white rounded-sm text-sm font-medium hover:bg-[#42a5f6] transition cursor-pointer">
          Search
        </button>
      </div>

      {/* Banner Image */}
      <div className="overflow-hidden rounded-2xl">
        <Image
          src={bannerImg}
          alt="Banner"
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    </section>
  );
};

export default Banner;
