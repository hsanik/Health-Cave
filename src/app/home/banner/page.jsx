import React from "react";
import Image from "next/image";
import bannerImg from "../../../../public/images/banner.svg";

const Banner = () => {
  return (
    <section className="w-full">
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
