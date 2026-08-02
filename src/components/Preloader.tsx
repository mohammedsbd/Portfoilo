'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent } from 'framer-motion';

/**
 * The intro: the hallmark being struck.
 *
 * What was here before was the stock portfolio preloader — katakana scramble,
 * three-digit counter, INITIALIZING — which is on a few thousand other sites
 * and said nothing about this one. This one is built out of the mark in the
 * header, so the first thing a visitor sees is the thing they will keep
 * seeing:
 *
 *   1. registration marks find the centre, the way a plate is set up
 *   2. the die traces itself — the rounded square, then the diagonal score
 *   3. M and S strike into it, each throwing a shockwave ring
 *   4. the name signs itself underneath in the serif it is set in everywhere
 *   5. the rule fills while the page actually becomes ready
 *   6. the plate splits along its own score and the two halves slide apart
 *
 * The split is the payoff: the screen tears along the same diagonal the logo
 * is scored with, so the reveal is the mark opening rather than a curtain.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
/** Hard in, soft out — a punch rather than a drift. */
const STRIKE = [0.16, 1.3, 0.4, 1] as const;

/** Choreography, in seconds, so the timeline reads in one place. */
const T = {
  die: 0.15,
  score: 0.75,
  strikeM: 1.15,
  strikeS: 1.32,
  sign: 1.55,
  rule: 1.85,
  ruleFill: 1.5,
};

/** Nothing is released before this — the strike needs room to land. */
const FLOOR_MS = (T.rule + T.ruleFill) * 1000 + 250;
/** …and nothing is held past this, however slow the network is. */
const CEILING_MS = 6000;

type Phase = 'strike' | 'release' | 'done';

/** Resolves when the document has actually finished, or when time runs out. */
function whenReady(): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const signals: Promise<unknown>[] = [];

    if (document.readyState === 'complete') {
      signals.push(Promise.resolve());
    } else {
      signals.push(new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true })));
    }

    /* Fonts matter more than bytes here: the name signs itself in Instrument
       Serif, and revealing before it lands means the hero swaps face on
       arrival. */
    if (document.fonts?.ready) signals.push(document.fonts.ready);

    Promise.all(signals).then(done);
    window.setTimeout(done, CEILING_MS);
  });
}

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>('strike');
  const [pct, setPct] = useState(0);

  const fill = useMotionValue(0);
  useMotionValueEvent(fill, 'change', (v) => setPct(Math.round(v * 100)));

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      return;
    }

    document.body.classList.add('is-locked');
    const started = performance.now();

    const controls = animate(fill, 1, {
      duration: T.ruleFill,
      delay: T.rule,
      ease: EASE,
    });

    let releaseTimer = 0;
    let doneTimer = 0;

    whenReady().then(() => {
      const waited = performance.now() - started;
      releaseTimer = window.setTimeout(
        () => {
          setPhase('release');
          doneTimer = window.setTimeout(() => {
            setPhase('done');
            document.body.classList.remove('is-locked');
          }, 1150);
        },
        Math.max(0, FLOOR_MS - waited),
      );
    });

    return () => {
      controls.stop();
      window.clearTimeout(releaseTimer);
      window.clearTimeout(doneTimer);
      document.body.classList.remove('is-locked');
    };
  }, [fill]);

  const releasing = phase === 'release';

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div className="pre" exit={{ opacity: 0 }} transition={{ duration: 0.3 }} aria-hidden="true">
          {/* The two halves of the plate. They carry the black, so sliding
              them apart is what uncovers the page. */}
          <motion.div
            className="pre__half pre__half--a"
            animate={releasing ? { x: '-72%', y: '-72%' } : { x: 0, y: 0 }}
            transition={{ duration: 1.05, ease: EASE, delay: releasing ? 0.1 : 0 }}
          />
          <motion.div
            className="pre__half pre__half--b"
            animate={releasing ? { x: '72%', y: '72%' } : { x: 0, y: 0 }}
            transition={{ duration: 1.05, ease: EASE, delay: releasing ? 0.1 : 0 }}
          />

          <motion.div
            className="pre__stage"
            animate={releasing ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* Registration marks, drawing in from outside the frame. */}
            {(['tl', 'tr', 'bl', 'br'] as const).map((corner, i) => (
              <motion.span
                key={corner}
                className={`pre__reg pre__reg--${corner}`}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 0.32, scale: 1 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: EASE }}
              />
            ))}

            <div className="pre__mark">
              {/* The die, cutting itself. `pathLength` normalises both shapes
                  to 1, so one transition drives a rounded rect and a line
                  alike and neither needs measuring. */}
              <svg className="pre__die" viewBox="0 0 100 100" fill="none">
                <motion.rect
                  x="1.5"
                  y="1.5"
                  width="97"
                  height="97"
                  rx="16"
                  pathLength={1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.85, delay: T.die, ease: EASE }}
                />
                <motion.line
                  x1="13"
                  y1="87"
                  x2="87"
                  y2="13"
                  pathLength={1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: T.score, ease: EASE }}
                />
              </svg>

              {/* The strikes. Each letter lands with a ring thrown off it. */}
              <motion.span
                className="pre__letter pre__letter--m"
                initial={{ opacity: 0, scale: 1.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: T.strikeM, ease: STRIKE }}
              >
                M
              </motion.span>
              <motion.span
                className="pre__letter pre__letter--s"
                initial={{ opacity: 0, scale: 1.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: T.strikeS, ease: STRIKE }}
              >
                S
              </motion.span>

              <motion.span
                className="pre__shock pre__shock--m"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: [0, 0.5, 0], scale: 2.4 }}
                transition={{ duration: 0.85, delay: T.strikeM, ease: 'easeOut' }}
              />
              <motion.span
                className="pre__shock pre__shock--s"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: [0, 0.5, 0], scale: 2.4 }}
                transition={{ duration: 0.85, delay: T.strikeS, ease: 'easeOut' }}
              />
            </div>

            {/* The signature. */}
            <motion.p
              className="pre__name"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: T.sign, ease: EASE }}
            >
              Mohammed <em>Salih</em>
            </motion.p>

            <motion.div
              className="pre__meter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: T.rule }}
            >
              <span className="pre__rule">
                <motion.i style={{ scaleX: fill }} />
              </span>
              <span className="pre__pct">{String(pct).padStart(2, '0')}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
