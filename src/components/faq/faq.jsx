import React from 'react';
import { faqData } from '@/lib/faqData';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
    return (
        <section className="py-12 dark:text-white sm:py-16 lg:py-20">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-semibold text-black dark:text-white sm:text-4xl xl:text-5xl">Frequently Asked Questions</h2>
                    <p className="max-w-3xl dark:text-white mx-auto mt-4 text-lg font-normal text-gray-600 sm:mt-5">
                        Find below our frequently asked questions. If you have other questions please contact us.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto mt-12">
                    <Accordion type="single" collapsible className="w-full">
                        {faqData.map((faq, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
};

export default Faq;
