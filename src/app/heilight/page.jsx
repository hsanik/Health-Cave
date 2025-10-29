"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
    User,
    UserCheck,
    Users,
    Activity,
    DollarSign,
} from "lucide-react";

import chatbot from "../../../public/heilight/chatbot.svg";
import emergencyCall from "../../../public/heilight/Emergency call.svg";
import epresciption from "../../../public/heilight/epresciption.svg";
import musicTherapy from "../../../public/heilight/music therapy.svg";
import onlineConsultation from "../../../public/heilight/online consultation.svg";

const Page = () => {
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalUsers: 0,
        totalAppointments: 0,
        totalIncome: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const doctorsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`);
                const doctors = await doctorsRes.json();

                const appointmentsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/appointments`);
                const appointments = await appointmentsRes.json();

                // Example calculations — you can modify based on your DB structure
                const totalDoctors = doctors.length;
                const totalPatients = doctors.reduce((sum, doc) => sum + (doc.patients || 0), 0);
                const totalAppointments = appointments.length;
                const totalIncome = appointments
                    .filter((a) => a.paymentStatus === "paid")
                    .reduce((sum, a) => sum + (a.amount || 0), 0);

                setStats({
                    totalDoctors,
                    totalPatients,
                    totalUsers: totalDoctors + totalPatients,
                    totalAppointments,
                    totalIncome,
                });
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };

        fetchData();
    }, []);

    const highlights = [
        {
            title: "Online Consultation",
            desc: "Connect with doctors anytime, anywhere via video calls.",
            img: onlineConsultation,
        },
        {
            title: "E-Prescription",
            desc: "Get prescriptions digitally after online consultation.",
            img: epresciption,
        },
        {
            title: "Chatbot Assistance",
            desc: "Instant AI-powered medical help and guidance.",
            img: chatbot,
        },
        {
            title: "Music Therapy",
            desc: "Relax with scientifically proven healing music.",
            img: musicTherapy,
        },
        {
            title: "Emergency Call",
            desc: "Quick connect with nearby hospitals during emergencies.",
            img: emergencyCall,
        },

    ];

    return (
        <div className="py-10 space-y-10">
            {/* Section 1 — Highlights */}
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                    {highlights.map((item, index) => (
                        <Card
                            key={index}
                            className="border-2 border-[#fafafa] hover:border-[#136afb] transition-all rounded-2xl text-center p-4"
                        >
                            <CardContent className="flex flex-col items-center">
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    width={200}
                                    height={200}
                                    className="mb-3"
                                />
                                <h3 className="text-lg font-semibold text-[#000000] dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    {item.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Section 2 — Stats */}
            <div className="bg-[#43d5cb] py-10 rounded-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-11/12 mx-auto">
                    {/* Total Doctors */}
                    <div className="rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300">
                        <div className="p-4 bg-white rounded-full mb-4 shadow-sm">
                            <UserCheck className="text-[#43d5cb]" size={40} />
                        </div>
                        <p className="text-[#fafafa] text-2xl">Total Doctors</p>
                        <p className="text-white text-2xl font-semibold mt-1">
                            {stats.totalDoctors}
                        </p>
                    </div>

                    {/* Total Users */}
                    <div className="rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300">
                        <div className="p-4 bg-white rounded-full mb-4 shadow-sm">
                            <User className="text-[#43d5cb]" size={40} />
                        </div>
                        <p className="text-[#fafafa] text-2xl">Total Users</p>
                        <p className="text-white text-2xl font-semibold mt-1">
                            {stats.totalUsers}
                        </p>
                    </div>

                    {/* Total Appointments */}
                    <div className="rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300">
                        <div className="p-4 bg-white rounded-full mb-4 shadow-sm">
                            <Activity className="text-[#43d5cb]" size={40} />
                        </div>
                        <p className="text-[#fafafa] text-2xl">Appointments</p>
                        <p className="text-white text-2xl font-semibold mt-1">
                            {stats.totalAppointments}
                        </p>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Page;