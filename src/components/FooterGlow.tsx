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

    let rect = { left: 0, top: 0, width: 0, height: 0 };
    let raf = 0;

    const updateRect = () => {
      rect = host.getBoundingClientRect();
    };
    updateRect(); // initial

    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        host.style.setProperty('--fx', `${e.clientX - (rect.left + rect.width / 2)}px`);
        host.style.setProperty('--fy', `${e.clientY - (rect.top + rect.height / 2)}px`);
        raf = 0;
      });
    };

    host.addEventListener('pointerenter', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });
    host.addEventListener('pointermove', onMove, { passive: true });
    
    return () => {
      host.removeEventListener('pointerenter', updateRect);
      window.removeEventListener('resize', updateRect);
      host.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return <div className="footer__glow" ref={ref} aria-hidden="true" />;
}
