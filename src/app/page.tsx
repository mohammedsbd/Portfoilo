import Preloader from '@/components/Preloader';
import Backdrop from '@/components/Backdrop';
import ScrollProgress from '@/components/ScrollProgress';
import Nav from '@/components/Nav';
import LandingHero from '@/components/LandingHero';
import Ticker from '@/components/Ticker';
import Intro from '@/components/Intro';
import Features from '@/components/Features';
import Projects from '@/components/Projects';
import Journey from '@/components/Journey';
import Education from '@/components/Education';
import Facts from '@/components/Facts';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

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
        <Intro />
        <Features />
        <Projects />
        <Journey />
        <Education />
        <Facts />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
