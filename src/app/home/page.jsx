import React from 'react'
import CTA from './cta/page'
import Banner from './banner/page';
import About from './about/page';
import Bmi from './bmi/page';
/* import DoctorHilight from './DoctorHilight/page'; */
import Gallery from '@/components/gallery/gallery';
import Faq from '@/components/faq/faq';


export default function Home() {
  return (
    <div className="">
      <Banner></Banner>
      <About></About>
      {/* <DoctorHilight></DoctorHilight> */}
      <Bmi></Bmi>
      <CTA />
      <Gallery />
      <Faq />
    </div>
  );
}
