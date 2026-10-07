'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LocalClock from './LocalClock';
import LazyVideo from './LazyVideo';
import { HERO_POSTER, HERO_VIDEO } from '@/data/media';
import { profile } from '@/data/profile';

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

/* Held to titles that are actually held: co-CEO of the PLC, and the AI
   integration lead on its dev team. */
const ROLES = [
  'Software Engineer',
  'Founder & Co-CEO',
  'AI Integration Lead',
  'Systems Builder',
];

/* ─── Particle constellation canvas ─── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
}

function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* Phones get a lighter field: fewer points, a lower backing-store
       resolution and half the frame rate. The pairwise line pass is O(n²),
       so the count is what decides whether a mid-range phone keeps up. */
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const maxDpr = coarse ? 1 : 1.5;
    const frameMs = coarse ? 1000 / 30 : 1000 / 60;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let visible = true;
    let raf = 0;
    let last = 0;
    let time = 0;
    const mouse = { x: -1000, y: -1000 };

    const spawn = () => {
      const count = Math.min(Math.floor((width * height) / (coarse ? 26000 : 16000)), coarse ? 28 : 70);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.4 + 0.6,
        opacity: Math.random() * 0.5 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      /* setTransform, not scale: scale() compounds on every resize. */
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    spawn();

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const pColor = '222, 219, 200';
    const connectionDist = 120;
    const connSq = connectionDist * connectionDist;
    const mouseInfluence = 180;
    /* Lines are bucketed by alpha so the whole web is a handful of stroke()
       calls rather than one per pair. */
    const BUCKETS = 4;
    const buckets: number[][] = Array.from({ length: BUCKETS }, () => []);

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < frameMs) return;
      last = now;
      time++;

      ctx.clearRect(0, 0, width, height);
      const mx = mouse.x;
      const my = mouse.y;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        const dxm = mx - p.x;
        const dym = my - p.y;
        const distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < mouseInfluence && distM > 1) {
          const force = (1 - distM / mouseInfluence) * 0.012;
          p.vx += dxm * force;
          p.vy += dym * force;
        }
        p.vx *= 0.998;
        p.vy *= 0.998;

        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7;
        ctx.globalAlpha = p.opacity * pulse;
        ctx.fillStyle = `rgb(${pColor})`;
        ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      }

      for (const b of buckets) b.length = 0;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < connSq) {
            const k = Math.min(BUCKETS - 1, Math.floor((1 - Math.sqrt(d2) / connectionDist) * BUCKETS));
            buckets[k].push(a.x, a.y, b.x, b.y);
          }
        }
      }

      ctx.strokeStyle = `rgb(${pColor})`;
      ctx.lineWidth = 0.5;
      for (let k = 0; k < BUCKETS; k++) {
        const seg = buckets[k];
        if (!seg.length) continue;
        ctx.globalAlpha = ((k + 0.5) / BUCKETS) * 0.12;
        ctx.beginPath();
        for (let s = 0; s < seg.length; s += 4) {
          ctx.moveTo(seg[s], seg[s + 1]);
          ctx.lineTo(seg[s + 2], seg[s + 3]);
        }
        ctx.stroke();
      }

      if (mx > 0 && my > 0) {
        ctx.lineWidth = 0.3;
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        for (const p of particles) {
          const dx = mx - p.x;
          const dy = my - p.y;
          if (dx * dx + dy * dy < mouseInfluence * mouseInfluence) {
            ctx.moveTo(mx, my);
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    /* The loop only exists while the hero is on screen and the tab is
       visible — off screen it costs nothing at all, not an idle rAF. */
    const sync = () => {
      const run = visible && document.visibilityState === 'visible';
      if (run && !raf) raf = requestAnimationFrame(draw);
      if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    if (!coarse) {
      canvas.addEventListener('mousemove', onMove);
      canvas.addEventListener('mouseleave', onLeave);
    }
    window.addEventListener('resize', onResize);
    sync();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', sync);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [canvasRef]);
}

/* ─── Glitch / decode text ─── */
const GLYPHS = 'アイウエオカキクケコ01!<>-_\\/[]{}—=+*^?#サシスセソ';

function GlitchText({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let frame = 0;
      const chars = text.split('');
      const queue = chars.map((char, i) => ({
        char,
        start: Math.floor(i * 2),
        end: Math.floor(i * 2) + 6 + Math.floor(Math.random() * 12),
      }));

      const tick = () => {
        let done = 0;
        const out = queue
          .map(({ char, start, end }) => {
            if (char === ' ') return ' ';
            if (frame >= end) {
              done++;
              return char;
            }
            if (frame < start) return '';
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('');
        
        if (spanRef.current) {
          spanRef.current.textContent = out;
        }
        
        if (done === queue.filter((q) => q.char !== ' ').length) {
          if (spanRef.current) {
            spanRef.current.textContent = text;
          }
          return;
        }
        frame++;
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, delay]);

  return <span ref={spanRef} className={className}>{'\u00A0'}</span>;
}

/* ─── Rotating Role Text ─── */
function RotatingRoles() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setIndex((i) => (i + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <span className="lhero__roleWrap">
      <AnimatePresence mode="wait">
        <m.span
          key={ROLES[index]}
          className="lhero__roleText"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {ROLES[index]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

/* ─── Scroll Indicator ─── */
function ScrollIndicator() {
  return (
    <m.a
      href="#about"
      className="lhero__scroll"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 1 }}
      aria-label="Scroll to content"
    >
      <span className="lhero__scrollLine" />
      <span className="lhero__scrollLabel">Scroll</span>
    </m.a>
  );
}

/* ─── Main Hero ─── */
export default function LandingHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticles(canvasRef);

  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const orbRef = useRef<HTMLDivElement>(null);
  const sectionRectRef = useRef<{ left: number, top: number, width: number, height: number } | null>(null);

  useEffect(() => {
    const updateRect = () => {
      const section = document.getElementById('top');
      if (section) {
        const rect = section.getBoundingClientRect();
        sectionRectRef.current = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        };
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    let rect = sectionRectRef.current;
    if (!rect) {
      const section = document.getElementById('top');
      if (section) {
        const r = section.getBoundingClientRect();
        rect = { left: r.left, top: r.top, width: r.width, height: r.height };
        sectionRectRef.current = rect;
      }
    }
    
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mousePosRef.current = { x, y };
      
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${x * 30 - 15}%, ${y * 30 - 15}%)`;
      }
    }
  }, []);

  return (
    <section className="lhero" id="top" onMouseMove={onMouseMove}>
      <div className="lhero__frame">
        {/* Interactive particle constellation */}
        <canvas ref={canvasRef} className="lhero__particles" aria-hidden="true" />

        {/* Morphing gradient orb that follows mouse */}
        <div
          ref={orbRef}
          className="lhero__orb"
          aria-hidden="true"
        />
        <div className="lhero__orb lhero__orb--secondary" aria-hidden="true" />

        {/* Video background with enhanced treatment */}
        <div className="lhero__videoBg">
          <LazyVideo className="lhero__video" src={HERO_VIDEO} poster={HERO_POSTER} rootMargin="0px" deferUntilIdle />
        </div>

        {/* Grain + grade overlays */}
        <div className="lhero__noise noise-overlay" aria-hidden="true" />
        <div className="lhero__grade" aria-hidden="true" />

        {/* Aurora gradient wave at bottom */}
        <div className="lhero__aurora" aria-hidden="true" />

        {/* ──── Nav pill ──── */}
        <nav className="lhero__nav" aria-label="Primary">
          {NAV.map((item, i) => (
            <m.a
              key={item.href}
              href={item.href}
              className="lhero__navLink"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: EASE }}
            >
              {item.label}
            </m.a>
          ))}
          <ThemeToggle />
        </nav>

        {/* ──── Floating status badges ──── */}
        <m.div
          className="lhero__badge lhero__badge--clock"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease: EASE }}
        >
          <span className="lhero__badgeDot lhero__badgeDot--pulse" />
          <LocalClock withSeconds={false} />
        </m.div>

        <m.div
          className="lhero__badge lhero__badge--status"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease: EASE }}
        >
          <span className="lhero__badgeDot lhero__badgeDot--live" />
          Available for work
        </m.div>

        {/* ──── Center content ──── */}
        <div className="lhero__content">
          {/* Eyebrow */}
          <m.div
            className="lhero__eyebrow"
            initial={{ opacity: 0, y: 20, scaleX: 0.6 }}
            animate={{ opacity: 1, y: 0, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
          >
            <span className="lhero__eyebrowLine" />
            <GlitchText text="ADDIS ABABA, ETHIOPIA" className="lhero__eyebrowText" delay={800} />
            <span className="lhero__eyebrowLine" />
          </m.div>

          {/* Main title — split across two lines with massive typography */}
          <div className="lhero__title">
            <m.h1
              className="lhero__name"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <m.span
                className="lhero__firstName"
                initial={{ y: 80, opacity: 0, rotateX: 45 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ delay: 0.4, duration: 1.1, ease: EASE }}
              >
                Mohammed
              </m.span>
              <m.span
                className="lhero__lastName"
                initial={{ y: 80, opacity: 0, rotateX: 45 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ delay: 0.55, duration: 1.1, ease: EASE }}
              >
                Salih<sup className="lhero__asterisk">✦</sup>
              </m.span>
            </m.h1>
          </div>

          {/* Rotating role + description */}
          <div className="lhero__meta">
            <m.div
              className="lhero__role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8, ease: EASE }}
            >
              <RotatingRoles />
            </m.div>

            <m.p
              className="lhero__copy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
            >
              AI architecture and full-stack engineering. Software built for the
              people who actually use it: designed from the data model up, shipped,
              and still standing after the requirements change.
            </m.p>

            <m.div
              className="lhero__actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.35, duration: 0.8, ease: EASE }}
            >
              <a href="#work" className="lhero__cta">
                <span className="lhero__ctaLabel">See the work</span>
                <span className="lhero__ctaIcon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>

              {/* Opens in the browser's own PDF viewer, which carries its own
                  download control, so one link covers reading and saving.
                  Ringed rather than ghosted — it is the thing recruiters come
                  for, so it sits a clear step above the contact link. */}
              <a
                href={profile.resume}
                className="lhero__ctaResume"
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="lhero__resumeIcon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="lhero__ctaLabel">Résumé</span>
                <span className="lhero__ctaPdf" aria-hidden="true">
                  PDF
                </span>
              </a>

              <a href="#contact" className="lhero__ctaText">
                <span className="lhero__ctaLabel">Let&apos;s talk</span>
                <span className="lhero__ctaTextArrow" aria-hidden="true">
                  →
                </span>
              </a>
            </m.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <ScrollIndicator />

        {/* Corner coordinates (design flair) */}
        <m.span
          className="lhero__coord lhero__coord--tl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          aria-hidden="true"
        >
          9.0192° N
        </m.span>
        <m.span
          className="lhero__coord lhero__coord--br"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 1 }}
          aria-hidden="true"
        >
          38.7525° E
        </m.span>
      </div>
    </section>
  );
}
