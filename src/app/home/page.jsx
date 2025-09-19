import React from 'react'
import CTA from './cta/page'
import Banner from './banner/page';
import About from './about/page';
import DoctorHilight from './DoctorHilight/page';

export default function Home() {
  return (
    <div className="">
      <Banner></Banner>
      <About></About>
      <DoctorHilight></DoctorHilight>
      <CTA />
    </div>
  );
}
