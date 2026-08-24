'use client';

import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';

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
  const { scrollYProgress } = useScroll();

  const y = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '-12%']), {
    stiffness: 40,
    damping: 22,
    mass: 0.7,
    restDelta: 0.01,
  });

  return (
    <div className="backdrop" aria-hidden="true">
      <motion.div className="backdrop__wash" style={reduce ? undefined : { y }} />
      <div className="backdrop__grain bg-noise" />
    </div>
  );
}
