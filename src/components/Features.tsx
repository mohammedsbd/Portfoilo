'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { WordsPullUpMultiStyle } from './PullUp';
import BlueprintPlotter from './BlueprintPlotter';

const COVER_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Features() {
  const reduce = !!useReducedMotion();

  return (
    <section className="section features" id="services">
      <div className="features__paper" aria-hidden="true" />
      <BlueprintPlotter />

      <div className="shell">
        <h2 className="features__head">
          <WordsPullUpMultiStyle
            segments={[{ text: 'Production-grade engineering for ambitious products.' }]}
          />
          <br />
          <WordsPullUpMultiStyle
            segments={[{ text: 'Built for real users. Powered by AI.', className: 'is-dim' }]}
          />
        </h2>

        <Cover reduce={reduce} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cover sheet — the video, pasted onto the folio                      */
/* ------------------------------------------------------------------ */

function Cover({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.95', 'start 0.45'],
  });

  const draw = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const marks = useTransform(scrollYProgress, [0.35, 0.7], [0, 1]);

  return (
    <motion.div
      className="bp__cover"
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <Frame draw={reduce ? 1 : draw} />
      <Marks scale={reduce ? 1 : marks} />

      <video src={COVER_VIDEO} autoPlay loop muted playsInline aria-hidden="true" />

      <div className="bp__coverPlate">
        <span className="bp__coverLabel">Cover</span>
        <span className="bp__coverCaption">Making dreams into software.</span>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Drawing furniture                                                   */
/* ------------------------------------------------------------------ */

/** The wireframe outline that strokes itself in as you scroll. */
function Frame({ draw }: { draw: MotionValue<number> | number }) {
  return (
    <svg className="bp__frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <motion.rect
        x="0.5"
        y="0.5"
        width="99"
        height="99"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: draw }}
      />
    </svg>
  );
}

/** Registration crosshairs at each corner. */
function Marks({ scale }: { scale: MotionValue<number> | number }) {
  return (
    <>
      {['tl', 'tr', 'bl', 'br'].map((corner) => (
        <motion.span
          key={corner}
          className={`bp__mark bp__mark--${corner}`}
          style={{ scale, opacity: scale }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
