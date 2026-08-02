'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * Adds `.is-in` once the element scrolls into view. Cheaper than mounting a
 * motion component for every block, and the CSS transition lives in the
 * stylesheet next to the rest of the design tokens.
 */
export function useInView<T extends HTMLElement>(threshold = 0.15, once = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.unobserve(entry.target);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return { ref, inView };
}

interface RevealProps {
  children: ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  as?: ElementType;
  className?: string;
  threshold?: number;
  style?: React.CSSProperties;
  /** Anything else (event handlers, aria-*) lands on the rendered element. */
  [key: string]: unknown;
}

export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  threshold = 0.15,
  style,
  ...rest
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(threshold);

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`.trim()}
      style={{ '--d': `${delay}ms`, ...style } as React.CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
