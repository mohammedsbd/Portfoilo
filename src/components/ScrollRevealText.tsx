'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

/**
 * Progressive text reveal: each character lifts from 0.2 to full opacity as
 * the block travels through the viewport, so the sentence appears to be read
 * into existence.
 */
export default function ScrollRevealText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');

  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => (
        <AnimatedLetter
          key={i}
          char={char}
          index={i}
          total={chars.length}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
}

/**
 * One character. Kept as its own component so `useTransform` is a stable hook
 * call per letter rather than a loop inside the parent.
 */
function AnimatedLetter({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const charProgress = index / total;
  const opacity = useTransform(progress, [charProgress - 0.1, charProgress + 0.05], [0.2, 1]);

  // Preserve spaces as real breaks so the paragraph still wraps normally.
  if (char === ' ') return <span> </span>;

  return (
    <motion.span style={{ opacity }} className="reveal-char">
      {char}
    </motion.span>
  );
}
