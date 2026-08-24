'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LocalClock from './LocalClock';
import { HERO_VIDEO } from '@/data/media';
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
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const dims = useRef({ w: 0, h: 0 });
  const visible = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      dims.current = { w: rect.width, h: rect.height };
    };
    resize();

    /* Spawn particles */
    const count = Math.min(Math.floor(window.innerWidth / 12), 100);
    const rect = canvas.getBoundingClientRect();
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.4 + 0.6,
      opacity: Math.random() * 0.5 + 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);

    let time = 0;
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (!visible.current) return;

      time++;
      const { w: width, h: height } = dims.current;
      ctx.clearRect(0, 0, width, height);

      /* Always dark theme particle color */
      const pColor = '222, 219, 200';

      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const connectionDist = 120;
      const mouseInfluence = 180;

      /* Update & draw particles */
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        /* Mouse attraction */
        const dxm = mx - p.x;
        const dym = my - p.y;
        const distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < mouseInfluence && distM > 1) {
          const force = (1 - distM / mouseInfluence) * 0.012;
          p.vx += dxm * force;
          p.vy += dym * force;
        }

        /* Dampen */
        p.vx *= 0.998;
        p.vy *= 0.998;

        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7;
        const alpha = p.opacity * pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pColor}, ${alpha})`;
        ctx.fill();
      }

      /* Connection lines */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${pColor}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      /* Mouse-to-particle lines */
      if (mx > 0 && my > 0) {
        for (const p of particles) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseInfluence) {
            const alpha = (1 - dist / mouseInfluence) * 0.2;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(${pColor}, ${alpha})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
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
        <motion.span
          key={ROLES[index]}
          className="lhero__roleText"
          initial={{ y: 20, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -20, opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ─── Scroll Indicator ─── */
function ScrollIndicator() {
  return (
    <motion.a
      href="#about"
      className="lhero__scroll"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 1 }}
      aria-label="Scroll to content"
    >
      <span className="lhero__scrollLine" />
      <span className="lhero__scrollLabel">Scroll</span>
    </motion.a>
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
          <video
            className="lhero__video"
            src={HERO_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        </div>

        {/* Grain + grade overlays */}
        <div className="lhero__noise noise-overlay" aria-hidden="true" />
        <div className="lhero__grade" aria-hidden="true" />

        {/* Aurora gradient wave at bottom */}
        <div className="lhero__aurora" aria-hidden="true" />

        {/* ──── Nav pill ──── */}
        <nav className="lhero__nav" aria-label="Primary">
          {NAV.map((item, i) => (
            <motion.a
              key={item.href}
              href={item.href}
              className="lhero__navLink"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: EASE }}
            >
              {item.label}
            </motion.a>
          ))}
          <ThemeToggle />
        </nav>

        {/* ──── Floating status badges ──── */}
        <motion.div
          className="lhero__badge lhero__badge--clock"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease: EASE }}
        >
          <span className="lhero__badgeDot lhero__badgeDot--pulse" />
          <LocalClock withSeconds={false} />
        </motion.div>

        <motion.div
          className="lhero__badge lhero__badge--status"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease: EASE }}
        >
          <span className="lhero__badgeDot lhero__badgeDot--live" />
          Available for work
        </motion.div>

        {/* ──── Center content ──── */}
        <div className="lhero__content">
          {/* Eyebrow */}
          <motion.div
            className="lhero__eyebrow"
            initial={{ opacity: 0, y: 20, scaleX: 0.6 }}
            animate={{ opacity: 1, y: 0, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
          >
            <span className="lhero__eyebrowLine" />
            <GlitchText text="ADDIS ABABA, ETHIOPIA" className="lhero__eyebrowText" delay={800} />
            <span className="lhero__eyebrowLine" />
          </motion.div>

          {/* Main title — split across two lines with massive typography */}
          <div className="lhero__title">
            <motion.h1
              className="lhero__name"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.span
                className="lhero__firstName"
                initial={{ y: 80, opacity: 0, rotateX: 45 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ delay: 0.4, duration: 1.1, ease: EASE }}
              >
                Mohammed
              </motion.span>
              <motion.span
                className="lhero__lastName"
                initial={{ y: 80, opacity: 0, rotateX: 45 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ delay: 0.55, duration: 1.1, ease: EASE }}
              >
                Salih<sup className="lhero__asterisk">✦</sup>
              </motion.span>
            </motion.h1>
          </div>

          {/* Rotating role + description */}
          <div className="lhero__meta">
            <motion.div
              className="lhero__role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8, ease: EASE }}
            >
              <RotatingRoles />
            </motion.div>

            <motion.p
              className="lhero__copy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
            >
              AI architecture and full-stack engineering. Software built for the
              people who actually use it: designed from the data model up, shipped,
              and still standing after the requirements change.
            </motion.p>

            <motion.div
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
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <ScrollIndicator />

        {/* Corner coordinates (design flair) */}
        <motion.span
          className="lhero__coord lhero__coord--tl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          aria-hidden="true"
        >
          9.0192° N
        </motion.span>
        <motion.span
          className="lhero__coord lhero__coord--br"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 1 }}
          aria-hidden="true"
        >
          38.7525° E
        </motion.span>
      </div>
    </section>
  );
}
