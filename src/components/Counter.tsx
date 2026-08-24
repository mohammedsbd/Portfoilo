'use client';

import { useEffect, useRef } from 'react';
import { useInView } from './Reveal';

interface Props {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

/** Counts up from zero the first time it scrolls into view. */
export default function Counter({ value, suffix = '', decimals = 0, duration = 1600 }: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (numRef.current) numRef.current.textContent = value.toFixed(decimals);
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast start, gentle landing
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      
      if (numRef.current) {
        numRef.current.textContent = (value * eased).toFixed(decimals);
      }
      
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (numRef.current) {
        numRef.current.textContent = value.toFixed(decimals);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, decimals]);

  return (
    <span ref={ref}>
      <span ref={numRef}>{(0).toFixed(decimals)}</span>
      <em>{suffix}</em>
    </span>
  );
}
