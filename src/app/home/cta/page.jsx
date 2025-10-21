"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative py-20 w-full flex items-center justify-center rounded-2xl overflow-hidden my-16">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-[#136afb]"></div>
      
      {/* Content */}
      <article className="relative z-10 max-w-4xl px-6 lg:px-16 text-center">
        <header>
          <h2 className="text-white text-xl pb-3 tracking-widest font-medium">
            Ready to Get Started?
          </h2>
          <h2 className="text-3xl lg:text-5xl font-light text-white leading-tight mb-6">
            Get Expert Medical Advice <br />
            <span className="">Today</span>
          </h2>
        </header>
        
        <p className="text-base lg:text-lg text-[#fafafa] max-w-2xl mx-auto mb-8 leading-relaxed">
          HealthCave connects you with certified doctors online. Ask questions,
          receive consultations, and book appointments quickly — all from the comfort of your home.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/contact">
            <Button
              size="lg"
              className="px-8 py-3 cursor-pointer rounded-lg font-semibold transition border bg-transparent border-white text-[#fafafa] hover:bg-[#fafafa] hover:text-[#515151] hover:border-transparent"
            >
              Contact a Doctor
            </Button>
          </Link>
          <Link href="/doctors">
            <Button
              size="lg"
              className="px-8 py-3 cursor-pointer rounded-lg font-semibold transition bg-white text-[#515151] hover:bg-[#fafafa] hover:text-[#515151] border-0"
            >
              Browse Doctors
            </Button>
          </Link>
        </div>
      </article>
    </section>
  );
}

