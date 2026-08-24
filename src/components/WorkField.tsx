'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * The field behind the work.
 *
 * It runs down the two margins and leaves the middle alone — the cards are
 * the content, and a background that crosses them competes with them. So the
 * section keeps its centred column and gets a lit lane on either side of it.
 *
 * Everything is driven by how far through the section the reader is, never by
 * a clock, so the field only moves while they do. Per lane:
 *
 *   · a ruled column of ticks drifting vertically, the two lanes running
 *     against each other so the margins read as depth rather than as one
 *     more thing scrolling at page speed;
 *   · a rail that fills as the section is read, with a lit node riding its
 *     head, so there is always a reading of how much work is left.
 *
 * Behind both, two colour blooms tinted by whichever project is currently on
 * screen (`--work-hi` / `--work-lo`, set on the section and eased between
 * palettes by the registered properties in the stylesheet), so the whole
 * section changes light as the work changes.
 *
 * Only `transform` is ever written — no width, top or background changes — so
 * each layer stays on the compositor and the section costs nothing to scroll.
 * The performance notes in the README rule out the alternatives.
 */
export default function WorkField() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  /* Springing the progress rather than reading it raw keeps the field a beat
     behind the cards, which is what makes it read as depth instead of as a
     second thing scrolling at the same speed. */
  const p = useSpring(scrollYProgress, { stiffness: 55, damping: 22, restDelta: 0.01 });

  const bloomL = useTransform(p, [0, 1], ['16%', '-18%']);
  const bloomR = useTransform(p, [0, 1], ['-16%', '20%']);
  const ticksL = useTransform(p, [0, 1], ['0%', '-14%']);
  const ticksR = useTransform(p, [0, 1], ['-14%', '0%']);
  const railFill = useTransform(p, [0.05, 0.95], [0, 1]);
  const railNode = useTransform(p, [0.05, 0.95], ['0%', '100%']);

  /* Reduced motion keeps the field — the colour still follows the work, the
     rails still read as full — and drops only the drift, so nothing here
     slides under a reader who asked for stillness. */
  const drift = (value: object) => (reduce ? undefined : value);

  const lane = (side: 'l' | 'r') => (
    <div className={`wfield__lane wfield__lane--${side}`}>
      <motion.span
        className="wfield__ticks"
        style={drift({ y: side === 'l' ? ticksL : ticksR })}
      />
      <span className="wfield__rail">
        <motion.i
          className="wfield__railFill"
          style={reduce ? { scaleY: 1 } : { scaleY: railFill }}
        />
        <motion.i className="wfield__railNode" style={drift({ y: railNode })} />
      </span>
    </div>
  );

  return (
    <div className="wfield" ref={ref} aria-hidden="true">
      <motion.span className="wfield__bloom wfield__bloom--l" style={drift({ y: bloomL })} />
      <motion.span className="wfield__bloom wfield__bloom--r" style={drift({ y: bloomR })} />

      {lane('l')}
      {lane('r')}
    </div>
  );
}
