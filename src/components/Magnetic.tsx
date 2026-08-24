'use client';

import { useRef, useEffect, type ReactNode, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface Props {
  children: ReactNode;
  /** How far the element is allowed to be pulled, in pixels. */
  strength?: number;
  className?: string;
}

/** Pulls its child toward the pointer while hovered, then springs back. */
export default function Magnetic({ children, strength = 18, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const rectRef = useRef<DOMRect | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  useEffect(() => {
    const handleResize = () => {
      rectRef.current = null;
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onPointerEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || !rectRef.current) return;
    const r = rectRef.current;
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * strength);
    y.set(Math.max(-1, Math.min(1, dy)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onPointerEnter={onPointerEnter}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
