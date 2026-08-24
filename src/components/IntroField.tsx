'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Set behind the orbit, one at a time, in the tint of the fronted satellite. */
const PHRASES = [
  'Welcome to my world',
  'Still building',
  'Shipped, not shelved',
  'Make it hold up',
];

/** How long each phrase holds before the next one crossfades in. */
const PHRASE_MS = 5200;

/**
 * The field the orbit sits in.
 *
 * Two tinted clouds, a starfield, and a well that follows the cursor. All of
 * it takes its colour from `--tint`, which the section already re-points at
 * whichever satellite is out front, so the whole background changes hue as
 * the orbit turns rather than being decoration bolted on beside it.
 *
 * The pointer is written to two custom properties and each layer multiplies
 * them by its own depth, so the parallax costs one property write per frame
 * and no layout. The follow is damped: the field trails the cursor instead of
 * snapping to it, which is what makes it read as depth rather than as a
 * cursor effect.
 */
export default function IntroField() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [phrase, setPhrase] = useState(0);

  // Held still for anyone who asked for less motion: the first line stays up.
  useEffect(() => {
    if (reduce) return;

    let id: number | undefined;
    const start = () => {
      if (!id) {
        id = window.setInterval(
          () => setPhrase((i) => (i + 1) % PHRASES.length),
          PHRASE_MS,
        );
      }
    };
    const stop = () => {
      if (id) {
        window.clearInterval(id);
        id = undefined;
      }
    };

    const host = ref.current?.parentElement;
    if (!host) {
      start();
      return stop;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) start();
      else stop();
    });
    observer.observe(host);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [reduce]);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || reduce) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let rect = { left: 0, top: 0, width: 0, height: 0 };

    const updateRect = () => {
      rect = host.getBoundingClientRect();
    };
    updateRect(); // initial

    const follow = () => {
      cx += (tx - cx) * 0.075;
      cy += (ty - cy) * 0.075;
      host.style.setProperty('--ix', `${cx.toFixed(1)}px`);
      host.style.setProperty('--iy', `${cy.toFixed(1)}px`);

      // Stop the loop once it has caught up, rather than running forever.
      raf =
        Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4 ? requestAnimationFrame(follow) : 0;
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX - (rect.left + rect.width / 2);
      ty = e.clientY - (rect.top + rect.height / 2);
      if (!raf) raf = requestAnimationFrame(follow);
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(follow);
    };

    host.addEventListener('pointerenter', updateRect, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      host.removeEventListener('pointerenter', updateRect);
      window.removeEventListener('resize', updateRect);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div className="intro__field" ref={ref} aria-hidden="true">
      <span className="intro__cloud intro__cloud--a" />
      <span className="intro__cloud intro__cloud--b" />
      <span className="intro__stars" />

      {/* Set into the margins either side of the orbit, which is where the
          room actually is. The two columns are held half the list apart so
          they never show the same phrase at once.

          Every phrase is mounted for good, stacked in one grid cell, and only
          the current one is switched on. Nothing enters or leaves, so the two
          sides of the crossfade cannot get out of step: swapping these through
          AnimatePresence meant a phrase was only removed once its exit
          animation finished, and rAF is paused in a hidden tab while the
          interval keeps firing. Tab away and back, and every line it had
          advanced through was still sitting on top of the last. */}
      <GhostColumn side="left" active={phrase} />
      <GhostColumn side="right" active={(phrase + Math.floor(PHRASES.length / 2)) % PHRASES.length} />

      <span className="intro__well" />
    </div>
  );
}

/** One margin of phrases. Only `active` is lit; the rest sit at zero. */
function GhostColumn({ side, active }: { side: 'left' | 'right'; active: number }) {
  return (
    <span className={`intro__ghost intro__ghost--${side}`}>
      {PHRASES.map((text, i) => (
        <span key={text} className={`intro__ghostLine ${i === active ? 'is-on' : ''}`}>
          {text}
        </span>
      ))}
    </span>
  );
}
