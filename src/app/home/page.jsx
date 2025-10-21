import React from 'react'
import CTA from './cta/page'
import Banner from './banner/page';
import About from './about/page';
import Bmi from './bmi/page';
import Heilight from "../heilight/page"
import DoctorHilight from './DoctorHilight/page';
import Marquery from './marquery/page';
import Gallery from '@/components/gallery/gallery';
import Faq from '@/components/faq/faq';


export default function Home() {
  return (
    <div className="">
      <Banner></Banner>
      <Marquery></Marquery>
      <Heilight></Heilight>
      <About></About>
      {/* <DoctorHilight></DoctorHilight> */}
      <Bmi></Bmi>
      <CTA />
      <DoctorHilight></DoctorHilight>
      <Gallery />
      <Faq />
    </div>
  );
}
