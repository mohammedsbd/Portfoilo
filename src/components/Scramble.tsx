'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from './Reveal';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

interface Props {
  text: string;
  className?: string;
  /** Scramble again whenever the pointer enters. */
  onHover?: boolean;
}

/**
 * Decodes text out of random glyphs — once on entering the viewport, and
 * again on hover if `onHover` is set.
 */
export default function Scramble({ text, className = '', onHover = true }: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const raf = useRef<number | null>(null);

  const run = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }

    if (raf.current) cancelAnimationFrame(raf.current);
    frame.current = 0;

    // Each character resolves at its own moment, left to right.
    const queue = text.split('').map((char, i) => ({
      char,
      start: Math.floor(i * 1.6),
      end: Math.floor(i * 1.6) + 8 + Math.floor(Math.random() * 10),
    }));

    const tick = () => {
      let done = 0;
      const out = queue
        .map(({ char, start, end }) => {
          if (char === ' ') return ' ';
          if (frame.current >= end) {
            done++;
            return char;
          }
          if (frame.current < start) return '';
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');

      setDisplay(out);

      if (done === queue.filter((q) => q.char !== ' ').length) {
        setDisplay(text);
        return;
      }

      frame.current++;
      raf.current = requestAnimationFrame(tick);
    };

    tick();
  };

  useEffect(() => {
    if (inView) run();
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, text]);

  return (
    <span
      ref={ref}
      className={className}
      onPointerEnter={onHover ? run : undefined}
      style={{ display: 'inline-block' }}
    >
      {display || ' '}
    </span>
  );
}
