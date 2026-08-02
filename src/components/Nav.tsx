'use client';

import { useEffect, useState } from 'react';
import { navItems, profile } from '@/data/profile';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  /* The landing hero carries its own nav pill, so this bar stays
     out of the way until the hero has scrolled by, then slides in to serve
     the remaining ~11,000px of page. */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setStuck(y > 40);
      setPastHero(y > window.innerHeight * 0.82);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Scroll-spy: highlight whichever section owns the upper third of the screen.
  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Never leave the drawer open behind a resize to desktop.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(min-width: 1081px)');
    const close = () => setOpen(false);
    mq.addEventListener('change', close);
    return () => mq.removeEventListener('change', close);
  }, [open]);

  return (
    <>
      <header className={`topbar ${pastHero ? '' : 'is-lifted'}`}>
        <div className="announce">
          <a href="#contact">
            <span className="announce__dot" />
            {profile.availabilityNote}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* The bar spans the window; the capsule inside it does not. Same
            object the visitor already met as the hero's own nav pill, which is
            why the header rides in the middle of the page rather than ruling a
            line across the top of it. */}
        <div className={`navbar ${stuck ? 'is-stuck' : ''}`}>
          <div className="shell navbar__shell">
            <div className="nav">
              {/* A maker's hallmark rather than a logo: the two initials
                  stamped either side of a scored diagonal, the way a mark is
                  punched into the back of a piece. */}
              <a href="#top" className="brand" aria-label={`${profile.name}, home`}>
                <span className="brand__plate" aria-hidden="true">
                  <b>M</b>
                  <b>S</b>
                </span>
                <span className="brand__text" aria-hidden="true">
                  Mohammed <em>Salih</em>
                </span>
              </a>

              <nav className="nav__links" aria-label="Sections">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`nav__link ${active === item.id ? 'is-active' : ''}`}
                  >
                    <span className="nav__linkLabel">{item.label}</span>
                    <sup>{item.num}</sup>
                  </a>
                ))}
              </nav>

              <div className="nav__right">
                <a href="#facts" className="nav__ghost">
                  Facts
                </a>
                <ThemeToggle />
                <a href="#contact" className="nav__cta">
                  <span>Hire me</span>
                  <span className="nav__ctaDisc" aria-hidden="true">
                    →
                  </span>
                </a>
                <button
                  className={`burger ${open ? 'is-open' : ''}`}
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Toggle menu"
                  aria-expanded={open}
                >
                  <span />
                  <span />
                  <span />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={`drawer ${open ? 'is-open' : ''}`}>
        {[
          ...navItems,
          { id: 'education', label: 'Education', num: '05' },
          { id: 'facts', label: 'Facts', num: '06' },
          { id: 'contact', label: 'Contact', num: '07' },
        ].map(
          (item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}>
              {item.label}
              <sup>{item.num}</sup>
            </a>
          ),
        )}
      </div>
    </>
  );
}
