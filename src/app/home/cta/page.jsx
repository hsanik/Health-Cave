"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {

  return (
    <section className="py-16 flex flex-col items-center text-center mx-auto my-12">
      <h2 className="text-3xl font-bold mb-4">
        Get Expert Medical Advice Today
      </h2>
      <p className="mb-6 text-lg max-w-xl">
        HealthCave connects you with certified doctors online. Ask questions,
        receive consultations, and book appointments quickly — all from home.
      </p>
      <Link href="/contact">
        <Button
          size="lg"
          className="rounded-2xl px-8 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
        >
          Contact a Doctor
        </Button>
      </Link>
    </section>
  );
}

