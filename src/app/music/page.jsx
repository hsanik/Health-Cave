"use client";
import React from "react";
import { FaMusic, FaBrain, FaHeart, FaSpa, FaRegClock } from "react-icons/fa";

const MusicTherapyPage = () => {
  return (
    <div className="w-11/12 mx-auto py-16">
      {/* Header Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#435ba1] mb-4">
          Music Therapy for Relaxation
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the healing power of sound. Music therapy reduces stress,
          improves mood, enhances focus, and promotes overall well-being.
          Immerse yourself in calming melodies that restore balance to your mind
          and body.
        </p>
      </section>

      {/* Benefits Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <FaMusic className="text-4xl text-[#43d5cb] mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Stress Relief</h3>
          <p className="text-gray-600 text-sm">
            Calm your mind and body with soothing sounds that ease anxiety.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <FaBrain className="text-4xl text-[#4c69c6] mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Mental Clarity</h3>
          <p className="text-gray-600 text-sm">
            Enhance focus and creativity with therapeutic rhythms.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <FaHeart className="text-4xl text-[#435ba1] mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Emotional Healing</h3>
          <p className="text-gray-600 text-sm">
            Music fosters emotional expression and supports inner healing.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <FaSpa className="text-4xl text-[#43d5cb] mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Deep Relaxation</h3>
          <p className="text-gray-600 text-sm">
            Induce deep relaxation to improve sleep and reduce fatigue.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-[#435ba1] mb-6 text-center">
          How Music Therapy Works
        </h2>
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          <p className="mb-4">
            Music therapy uses rhythm, melody, and harmony to stimulate the brain
            and relax the nervous system. When you listen to certain frequencies
            and calming tunes, your heart rate slows, stress hormones decrease,
            and you experience a natural state of peace.
          </p>
          <p>
            Sessions can involve listening, singing, or even creating music with
            guidance from a therapist. It’s a holistic approach to healing both
            the mind and body.
          </p>
        </div>
      </section>

      {/* Relaxation Videos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
          <iframe
            className="w-full h-64 md:h-80"
            src="https://www.youtube.com/embed/1ZYbU82GVz4"
            title="Relaxing Music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
          <iframe
            className="w-full h-64 md:h-80"
            src="https://www.youtube.com/embed/2OEL4P1Rz04"
            title="Meditation Music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
          <iframe
            className="w-full h-64 md:h-80"
            src="https://www.youtube.com/embed/77ZozI0rw7w"
            title="Healing Music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
          <iframe
            className="w-full h-64 md:h-80"
            src="https://www.youtube.com/embed/3NycM9lYdRI"
            title="Deep Sleep Music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Recommended Sessions */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-[#435ba1] mb-6 text-center">
          Recommended Sessions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-2xl p-6 text-center">
            <FaRegClock className="text-3xl text-[#43d5cb] mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Morning Boost</h3>
            <p className="text-gray-600 text-sm">
              20–30 mins of uplifting tunes to start your day with positivity.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 text-center">
            <FaRegClock className="text-3xl text-[#4c69c6] mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Afternoon Focus</h3>
            <p className="text-gray-600 text-sm">
              30–40 mins of instrumental tracks to sharpen focus.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 text-center">
            <FaRegClock className="text-3xl text-[#435ba1] mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Night Relaxation</h3>
            <p className="text-gray-600 text-sm">
              45–60 mins of calming music to prepare for restful sleep.
            </p>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#435ba1] mb-6">
          Tips for Maximum Relaxation
        </h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 text-left md:text-center">
          <li>Use headphones for a more immersive sound experience.</li>
          <li>Find a quiet and comfortable space to listen.</li>
          <li>Combine music therapy with deep breathing or meditation.</li>
          <li>Be consistent — daily sessions work best for long-term effects.</li>
        </ul>
      </section>
    </div>
  );
};

export default MusicTherapyPage;
