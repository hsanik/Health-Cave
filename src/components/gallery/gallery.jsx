import React from 'react';
import { doctors } from '@/lib/doctors';

const Gallery = () => {
    return (
        <section className="py-12 bg-gray-50 sm:py-16 lg:py-20">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl">Meet Our Team</h2>
                    <p className="max-w-3xl mx-auto mt-4 text-lg font-normal text-gray-600 sm:mt-5">
                        Exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo non habent claritatem insitamconsequat duis
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 px-8 mt-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-0">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="text-center">
                            <img className="object-cover w-40 h-40 mx-auto rounded-full" src={doctor.image} alt={doctor.name} />
                            <p className="mt-5 text-lg font-bold text-gray-900">{doctor.name}</p>
                            <p className="mt-2 text-base font-normal text-gray-600">{doctor.specialty}</p>
                            <p className="max-w-xs mx-auto mt-4 text-sm font-normal text-gray-500">
                                Ut wisi enim ad minim veniam, quis laore nostrud exerci tation ulm hedi corper turet suscipit lobortis
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
