'use client';

import { m, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

/**
 * Closing image for the contact section: the same planet from the hero, now
 * seen from outside — a horizon with a figure standing at the edge. Bookends
 * the page.
 */
export default function ContactScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const spring = { stiffness: 50, damping: 22, mass: 0.7 };
  const yPlanet = useSpring(useTransform(scrollYProgress, [0, 1], [90, -90]), spring);
  const yRidge = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]), spring);

  return (
    <div className="contact__scene" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 1600 620" preserveAspectRatio="xMidYMax slice">
        <defs>
          <radialGradient id="cs-planet" cx="0.35" cy="0.25" r="0.9">
            <stop offset="0%" stopColor="#dedbc8" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#a8703c" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3a2313" stopOpacity="0.2" />
          </radialGradient>
          {/* soft falloff done with gradient stops, not a blur filter */}
          <radialGradient id="cs-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#dedbc8" stopOpacity="0.28" />
            <stop offset="42%" stopColor="#dedbc8" stopOpacity="0.11" />
            <stop offset="100%" stopColor="#dedbc8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cs-ridge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#101010" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
        </defs>

        {/* rising planet */}
        <m.g style={reduce ? undefined : { y: yPlanet }}>
          <circle cx="1180" cy="330" r="360" fill="url(#cs-halo)" />
          <circle cx="1180" cy="330" r="168" fill="url(#cs-planet)" />
          <ellipse
            cx="1180"
            cy="330"
            rx="250"
            ry="40"
            fill="none"
            stroke="#dedbc8"
            strokeWidth="2"
            opacity="0.3"
            transform="rotate(-18 1180 330)"
          />
        </m.g>

        {/* layered ridgeline with a lone figure on the crest */}
        <m.g style={reduce ? undefined : { y: yRidge }}>
          <path
            d="M -20 520 Q 240 452 520 498 Q 800 544 1080 486 Q 1360 428 1620 494 L 1620 640 L -20 640 Z"
            fill="url(#cs-ridge)"
            opacity="0.75"
          />
          <path
            d="M -20 560 Q 300 512 620 552 Q 940 592 1240 540 Q 1440 506 1620 546 L 1620 640 L -20 640 Z"
            fill="#000000"
          />
          <g fill="#020203" transform="translate(432 -8)">
            <ellipse cx="0" cy="512" rx="26" ry="4" opacity="0.6" />
            <path d="M -7 512 q -2 -34 2 -46 q 5 -14 12 0 q 4 12 2 46 z" />
            <circle cx="0" cy="456" r="8" />
          </g>
        </m.g>
      </svg>
    </div>
  );
}
