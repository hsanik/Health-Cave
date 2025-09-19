import React from 'react'
import CTA from './cta/page'
import Banner from './banner/page';
import About from './about/page';
import Gallery from '@/components/gallery/gallery';

export default function Home() {
  return (
    <div className="">
      <Banner></Banner>
      <About></About>
      <CTA />
      <Gallery />
    </div>
  );
}
