'use client';

import { useEffect, useState } from 'react';
import { m, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Page-wide backdrop.
 *
 * Replaces the old starfield: a night sky belongs to the previous theme, not
 * to a black-and-cream cinematic one. This is grain plus two very soft cream
 * washes that drift on scroll — no SVG filters, no blend modes, nothing that
 * re-rasterises per frame.
 */
export default function Backdrop() {
  const reduce = useReducedMotion();
  /* On touch screens the drift is invisible under a thumb-scroll anyway, and
     moving a full-viewport layer every scroll frame is real work for a phone. */
  const [touch, setTouch] = useState(true);
  useEffect(() => {
    setTouch(window.matchMedia('(hover: none), (pointer: coarse)').matches);
  }, []);
  const { scrollYProgress } = useScroll();

  const y = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '-12%']), {
    stiffness: 40,
    damping: 22,
    mass: 0.7,
    restDelta: 0.01,
  });

  return (
    <div className="backdrop" aria-hidden="true">
      <m.div className="backdrop__wash" style={reduce || touch ? undefined : { y }} />
      <div className="backdrop__grain bg-noise" />
    </div>
  );
}
