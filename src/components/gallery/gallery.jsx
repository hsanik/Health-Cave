import React from 'react';
import { doctors } from '@/lib/doctors';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const Gallery = () => {
    return (
        <section className="py-12 sm:py-16 lg:py-20">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold sm:text-4xl xl:text-5xl">Meet Our Team</h2>
                    <p className="max-w-3xl mx-auto mt-4 text-lg font-normal sm:mt-5">
                        Our team of dedicated and experienced doctors is here to provide you with the best possible care. We are committed to your health and well-being.
                    </p>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full max-w-6xl mx-auto mt-12"
                >
                    <CarouselContent>
                        {doctors.map((doctor) => (
                            <CarouselItem key={doctor.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <div className="p-1">
                                    <Card className="text-center h-full">
                                        <CardHeader>
                                            <img className="object-cover w-40 h-40 mx-auto rounded-full" src={doctor.image} alt={doctor.name} />
                                        </CardHeader>
                                        <CardContent className="flex flex-col items-center justify-start flex-grow">
                                            <CardTitle>{doctor.name}</CardTitle>
                                            <p className="mt-2 text-base font-normal">{doctor.specialty}</p>
                                            <p className="max-w-xs mx-auto mt-4 text-sm font-normal">
                                                {doctor.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="cursor-pointer" />
                    <CarouselNext className="cursor-pointer" />
                </Carousel>
            </div>
        </section>
    );
};

export default Gallery;
