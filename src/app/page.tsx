import Preloader from '@/components/Preloader';
import Backdrop from '@/components/Backdrop';
import ScrollProgress from '@/components/ScrollProgress';
import Nav from '@/components/Nav';
import LandingHero from '@/components/LandingHero';
import Ticker from '@/components/Ticker';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Intro = dynamic(() => import('@/components/Intro'));
const Features = dynamic(() => import('@/components/Features'));
const Projects = dynamic(() => import('@/components/Projects'));
const Journey = dynamic(() => import('@/components/Journey'));
const Education = dynamic(() => import('@/components/Education'));
const Facts = dynamic(() => import('@/components/Facts'));
const Contact = dynamic(() => import('@/components/Contact'));
const Footer = dynamic(() => import('@/components/Footer'));

export default function Home() {
  return (
    <>
      <Preloader />
      <Backdrop />
      <ScrollProgress />
      <Nav />

      <main>
        <LandingHero />
        <Ticker />
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Intro />
          <Features />
          <Projects />
          <Journey />
          <Education />
          <Facts />
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={<div style={{ minHeight: '20vh' }} />}>
        <Footer />
      </Suspense>
    </>
  );
}
