'use client';

import { useRef, type CSSProperties } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;
const STAGGER = 0.08;

/**
 * Splits text on spaces and slides each word up from y:20, staggered.
 * `showAsterisk` hangs a superscript mark off the final character.
 */
export function WordsPullUp({
  text,
  className = '',
  showAsterisk = false,
  style,
}: {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const words = text.split(' ');

  return (
    <span ref={ref} className={className} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            className="pullup__word"
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: i * STAGGER, duration: 0.7, ease: EASE }}
          >
            {showAsterisk && isLast ? (
              <span className="pullup__mark">
                {word}
                <sup>*</sup>
              </span>
            ) : (
              word
            )}
            {!isLast && ' '}
          </motion.span>
        );
      })}
    </span>
  );
}

export interface Segment {
  text: string;
  className?: string;
}

/**
 * Same pull-up, but across segments that each carry their own styling — so a
 * single heading can mix upright and italic serif mid-sentence.
 */
export function WordsPullUpMultiStyle({
  segments,
  className = '',
}: {
  segments: Segment[];
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  // Flatten to words up front so the stagger runs across the whole heading
  // rather than restarting on each segment.
  const words = segments.flatMap((seg) =>
    seg.text
      .split(' ')
      .filter(Boolean)
      .map((text) => ({ text, className: seg.className ?? '' })),
  );

  return (
    <span ref={ref} className={`pullup__multi ${className}`.trim()}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={`pullup__word ${word.className}`.trim()}
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ delay: i * STAGGER, duration: 0.7, ease: EASE }}
        >
          {word.text}
          {' '}
        </motion.span>
      ))}
    </span>
  );
}
