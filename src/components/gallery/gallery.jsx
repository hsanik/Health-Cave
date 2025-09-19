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

                <div className="grid grid-cols-1 gap-6 px-8 mt-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:px-0">
                    {/* Doctor cards will go here */}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
