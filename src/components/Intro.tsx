'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import Reveal, { useInView } from './Reveal';
import IntroField from './IntroField';
import StatLedger from './StatLedger';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Seconds for one full revolution of the orbit. */
const PERIOD = 30;

/**
 * The satellite marks.
 *
 * Drawn rather than picked: these were ⚡🚀💡🎓, which is the emoji drawer's
 * idea of a career and says nothing about this one. Each is now a figure for
 * what the entry actually was — a team with someone out front, a stack run
 * through end to end, two halves meeting, a pair of dividers holding a line.
 *
 * One family: 24-unit box, 1.5 stroke, round joins, exactly one filled element
 * each. The consistency is the point — it is what makes four marks read as a
 * set instead of four clip-art picks.
 */
const GLYPHS: Record<string, React.ReactNode> = {
  /* Three nodes wired together, the one out front filled in. */
  lead: (
    <>
      <circle cx="12" cy="5" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="18" r="2.1" />
      <circle cx="19" cy="18" r="2.1" />
      <path d="M10.5 7.2 6.4 15.9M13.5 7.2l4.1 8.7M7.1 18h9.8" />
    </>
  ),
  /* Plates narrowing as they go down, with one line threaded through all of
     them and pinned at both ends. */
  stack: (
    <>
      <path d="M5 8.5h14M6.6 12.5h10.8M8.4 16.5h7.2" />
      <path d="M12 3.4v17.2" />
      <circle cx="12" cy="3.4" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  /* Two halves turned toward each other, closing on a single point. */
  match: (
    <>
      <path d="M9.2 4.4a8.6 8.6 0 0 0 0 15.2" />
      <path d="M14.8 4.4a8.6 8.6 0 0 1 0 15.2" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
    </>
  ),
  /* Dividers set to a radius and holding it. */
  compass: (
    <>
      <circle cx="12" cy="4.6" r="1.5" fill="currentColor" stroke="none" />
      <path d="M11.1 6.1 6.2 19M12.9 6.1 17.8 19" />
      <path d="M7.7 15.4a7.6 7.6 0 0 0 8.6 0" />
    </>
  ),
};

function SatGlyph({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {GLYPHS[name]}
    </svg>
  );
}

/** The four milestones, riding the orbit as satellites. */
const SATELLITES = [
  {
    id: 'afrodigital',
    org: 'AfroDigital Innovation Labs',
    short: 'AfroDigital',
    role: 'Co-Founder & Co-CEO',
    period: '2025 – Present',
    kicker: 'I help run the company.',
    desc: 'Leading AI integration across the dev team and steering company strategy alongside my co-CEO, from technical direction to what we ship next.',
    tags: ['Strategy', 'AI Integration', 'Team Lead'],
    icon: 'lead',
    tint: '#e0b978',
  },
  {
    id: 'lalodev',
    org: 'LaloDev',
    short: 'LaloDev',
    role: 'Full-Stack Developer Intern',
    period: 'Dec 2024 – Apr 2025',
    kicker: 'I shipped it end to end.',
    desc: 'Built a full feedback management platform on Laravel and React: REST APIs, reusable components, and the integration layer holding the two halves together.',
    tags: ['Laravel', 'React', 'REST APIs'],
    icon: 'stack',
    tint: '#7fb8d9',
  },
  {
    id: 'products',
    org: 'Agentum & BioMatch',
    short: 'Agentum',
    role: 'Creator & Founder',
    period: '2025',
    kicker: 'I built them from nothing.',
    desc: 'An enterprise AI support platform that ingests a company’s docs and answers from them, and an organ-matching system running compatibility analysis on real population genetics, pitched at the Africa Youth Forum.',
    tags: ['Enterprise AI', 'Organ Matching', 'Investor Pitch'],
    icon: 'match',
    tint: '#b79ae0',
  },
  {
    id: 'bits',
    org: 'BITS College',
    short: 'BITS',
    role: 'Software Engineering Student',
    period: '2024 – Present',
    kicker: 'I have not dropped a point yet.',
    desc: 'Holding a perfect 4.0 / 4.0 GPA in Software Engineering while building and shipping production products on the side.',
    tags: ['4.0 / 4.0 GPA', 'Software Engineering'],
    icon: 'compass',
    tint: '#8fcaa8',
  },
];

const N = SATELLITES.length;

export default function Intro() {
  const reduce = !!useReducedMotion();
  const orbit = useOrbit(reduce);

  return (
    <section
      className="section intro"
      id="about"
      style={{ '--tint': SATELLITES[orbit.front].tint } as React.CSSProperties}
    >
      <IntroField />

      <div className="shell">
        {/* The section is a visual system rather than prose, but the page
            outline and the #about nav link still need a heading. */}
        <h2 className="intro__srHeading">About Mohammed Salih</h2>

        <OrbitSystem orbit={orbit} reduce={reduce} />

        <Reveal delay={100}>
          <StatLedger />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Orbit engine                                                        */
/* ------------------------------------------------------------------ */

interface Orbit {
  /** Revolutions completed. Satellite i sits at angle 2π(t + i/N). */
  t: MotionValue<number>;
  /** Index currently at the front of the orbit. */
  front: number;
  /** Index held at the front by the visitor, or null while free-running. */
  docked: number | null;
  dock: (i: number) => void;
  release: () => void;
  setRunning: (v: boolean) => void;
}

/**
 * Drives one angle for the whole system. Everything else — satellite
 * positions, which dossier is showing, the section tint — is derived from it.
 */
function useOrbit(reduce: boolean): Orbit {
  // Start a quarter turn in, which puts satellite 0 out front on first paint.
  const t = useMotionValue(0.25);
  const [front, setFront] = useState(0);
  const [docked, setDocked] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  // A satellite is at the front when (t + i/N) mod 1 === 0.25.
  useMotionValueEvent(t, 'change', (v) => {
    const f = ((Math.round((0.25 - v) * N) % N) + N) % N;
    setFront((prev) => (prev === f ? prev : f));
  });

  useEffect(() => {
    if (reduce || docked !== null || !running) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      t.set(t.get() + dt / PERIOD);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, docked, running, t]);

  const dock = useCallback(
    (i: number) => {
      setDocked(i);
      // Swing to the nearest revolution that puts satellite i out front.
      const target = 0.25 - i / N;
      const k = Math.round(t.get() - target);

      if (reduce) {
        t.set(target + k);
        return;
      }
      animate(t, target + k, { type: 'spring', stiffness: 90, damping: 18 });
    },
    [reduce, t],
  );

  const release = useCallback(() => setDocked(null), []);

  return { t, front, docked, dock, release, setRunning };
}

/* ------------------------------------------------------------------ */
/* Orbit system                                                        */
/* ------------------------------------------------------------------ */

function OrbitSystem({ orbit, reduce }: { orbit: Orbit; reduce: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2, false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(0);

  // Only spin while the system is actually on screen.
  const { setRunning } = orbit;
  useEffect(() => setRunning(inView), [inView, setRunning]);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const measure = () => setRadius(el.clientWidth * 0.36);
    measure();

    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="intro__orbitWrap" ref={ref}>
      <div
        className="intro__orbitStage"
        ref={stageRef}
        onPointerLeave={orbit.release}
        role="group"
        aria-label="Milestones in orbit"
      >
        <span className="intro__ring intro__ring--path" aria-hidden="true" />
        <span className="intro__ring intro__ring--inner" aria-hidden="true" />
        <span className="intro__ring intro__ring--outer" aria-hidden="true" />

        <div className="intro__core">
          <span className="intro__coreHalo" aria-hidden="true" />
          <span className="intro__coreSweep" aria-hidden="true" />
          <span className="intro__coreName">Mohammed</span>
          <span className="intro__coreName">Salih</span>
          <span className="intro__coreRole">Addis Ababa</span>
        </div>

        {SATELLITES.map((s, i) => (
          <Satellite
            key={s.id}
            index={i}
            data={s}
            t={orbit.t}
            radius={radius}
            isFront={orbit.front === i}
            isDocked={orbit.docked === i}
            onDock={orbit.dock}
            onRelease={orbit.release}
          />
        ))}
      </div>

      <span className="intro__orbitHint" aria-hidden="true">
        {orbit.docked === null ? 'tap or hover a satellite to dock it' : 'docked · move away to resume'}
      </span>

      <Dossier item={SATELLITES[orbit.front]} index={orbit.front} reduce={reduce} />
    </div>
  );
}

function Satellite({
  index,
  data,
  t,
  radius,
  isFront,
  isDocked,
  onDock,
  onRelease,
}: {
  index: number;
  data: (typeof SATELLITES)[number];
  t: MotionValue<number>;
  radius: number;
  isFront: boolean;
  isDocked: boolean;
  onDock: (i: number) => void;
  onRelease: () => void;
}) {
  const angle = useTransform(t, (v) => 2 * Math.PI * (v + index / N));

  // -1 at the back of the ellipse, +1 at the front.
  const depth = useTransform(angle, (a) => Math.sin(a));

  const x = useTransform(angle, (a) => Math.cos(a) * radius);
  const y = useTransform(angle, (a) => Math.sin(a) * radius * 0.34);
  const scale = useTransform(depth, [-1, 1], [0.66, 1.14]);
  const opacity = useTransform(depth, [-1, 1], [0.42, 1]);

  // Stepped, NOT continuous. Writing z-index every frame makes the compositor
  // restack the stage 60 times a second, which reads as a flicker.
  const zIndex = useTransform(depth, (d) => (d > 0.35 ? 80 : d < -0.35 ? 20 : 56));

  return (
    <motion.button
      type="button"
      className={`intro__sat ${isFront ? 'is-front' : ''} ${isDocked ? 'is-docked' : ''}`}
      style={{ x, y, scale, opacity, zIndex, '--tint': data.tint } as never}
      onPointerEnter={() => onDock(index)}
      onFocus={() => onDock(index)}
      /* Pointer release is handled by the stage, so moving between satellites
         does not flicker. Blur has no such wrapper — without this, tabbing
         away would leave the orbit frozen for good. */
      onBlur={onRelease}
      onClick={() => onDock(index)}
      aria-label={`${data.org}, ${data.role}`}
    >
      <span className="intro__satHalo" aria-hidden="true" />
      <span className="intro__satIcon" aria-hidden="true">
        <SatGlyph name={data.icon} />
      </span>
      <span className="intro__satOrg">{data.short}</span>
      <span className="intro__satNum" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
    </motion.button>
  );
}

/** The panel that reads out whichever satellite is at the front. */
function Dossier({
  item,
  index,
  reduce,
}: {
  item: (typeof SATELLITES)[number];
  index: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 20 });
  const sry = useSpring(ry, { stiffness: 150, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    ry.set(dx * 5);
    rx.set(-dy * 5);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      className="intro__dossier"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX: srx, rotateY: sry, ...({ '--tint': item.tint } as React.CSSProperties) }}
    >
      <span className="intro__dossierGlow" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {/* Opacity and position only — animating `filter: blur()` on a panel
            this size repaints the whole thing every frame. */}
        <motion.div
          key={item.id}
          className="intro__dossierBody"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <div className="intro__dossierTop">
            <span className="intro__dossierPeriod">{item.period}</span>
            <span className="intro__dossierIndex" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
              <em>/ {String(N).padStart(2, '0')}</em>
            </span>
          </div>

          <p className="intro__dossierKicker">{item.kicker}</p>
          <h3 className="intro__dossierOrg">{item.org}</h3>
          <p className="intro__dossierRole">{item.role}</p>
          <p className="intro__dossierDesc">{item.desc}</p>

          <div className="intro__dossierTags">
            {item.tags.map((tag) => (
              <span className="intro__dossierTag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
