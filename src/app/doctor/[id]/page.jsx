import React from "react";
import doctors from "../../../../public/data/doctors.json";
import Link from "next/link";

const DoctorDetails = ({ params }) => {
    const { id } = params;
    const doctor = doctors.find((doc) => doc.id.toString() === id);

    if (!doctor) {
        return (
            <div className="w-11/12 mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold text-red-600">Doctor not found</h1>
            </div>
        );
    }

    return (
        <div className="w-11/12 mx-auto py-20">
            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left: Image */}
                <div className="flex items-center justify-center bg-gray-100">
                    <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right: Details */}
                <div className="p-6 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
                    <p className="text-gray-600 mb-2">{doctor.specialization}</p>
                    <p className="text-yellow-500 font-medium mb-4">⭐ {doctor.rating}</p>

                    <div className="space-y-2">
                        <p>
                            <span className="font-semibold">Qualification:</span>{" "}
                            {doctor.qualification}
                        </p>
                        <p>
                            <span className="font-semibold">Experience:</span>{" "}
                            {doctor.experience}
                        </p>
                        <p>
                            <span className="font-semibold">Hospital:</span> {doctor.hospital}
                        </p>
                        <p>
                            <span className="font-semibold">Email:</span> {doctor.email}
                        </p>
                        <p>
                            <span className="font-semibold">Phone:</span> {doctor.phone}
                        </p>
                        <p>
                            <span className="font-semibold">Languages:</span>{" "}
                            {doctor.languages.join(", ")}
                        </p>
                        <Link
                            href=""
                            className="inline-block px-4 py-2 bg-[#435ba1] text-white text-sm font-medium rounded hover:bg-[#4c69c6] transition"
                        >
                            Book An Appointment
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;
