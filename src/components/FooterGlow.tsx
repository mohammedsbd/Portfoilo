'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * The light that follows the cursor across the footer.
 *
 * It is a single radial gradient offset from centre by two custom properties
 * — no filter and no blend mode, so it costs one paint and never forces a
 * re-raster on scroll. The listener sits on the parent rather than on a
 * wrapper of its own, which keeps the footer itself a server component.
 */
export default function FooterGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || reduce) return;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      host.style.setProperty('--fx', `${e.clientX - (r.left + r.width / 2)}px`);
      host.style.setProperty('--fy', `${e.clientY - (r.top + r.height / 2)}px`);
    };

    host.addEventListener('pointermove', onMove, { passive: true });
    return () => host.removeEventListener('pointermove', onMove);
  }, [reduce]);

  return <div className="footer__glow" ref={ref} aria-hidden="true" />;
}
