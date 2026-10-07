'use client';

import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  poster?: string;
  className?: string;
  /** How far outside the viewport to start fetching. */
  rootMargin?: string;
  /** Above-the-fold clips: wait for the page to finish loading and the main
      thread to go idle before fetching, so the video never competes with the
      HTML, CSS, JS and fonts for bandwidth on first paint. */
  deferUntilIdle?: boolean;
};

/** True when the visitor asked to save data or is on a very slow link. */
function constrained(): boolean {
  const c = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (!c) return false;
  return !!c.saveData || c.effectiveType === 'slow-2g' || c.effectiveType === '2g';
}

/**
 * The one video element used across the site.
 *
 * Nothing is downloaded until the clip is near the screen (the `src` is only
 * set then), it plays only while it is on screen, and it is paused the moment
 * it leaves. Under Data Saver or reduced motion it stays a still poster.
 */
export default function LazyVideo({
  src,
  poster,
  className,
  rootMargin = '300px 0px',
  deferUntilIdle = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (constrained() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let loaded = false;
    let onScreen = false;
    let ready = !deferUntilIdle;
    let cancelIdle = () => {};

    const load = () => {
      if (loaded || !ready || !onScreen) return;
      loaded = true;
      video.src = src;
      video.load();
    };

    const sync = () => {
      load();
      if (!loaded) return;
      if (onScreen && document.visibilityState === 'visible') video.play().catch(() => {});
      else video.pause();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin },
    );
    io.observe(video);
    document.addEventListener('visibilitychange', sync);

    const release = () => {
      const go = () => {
        ready = true;
        sync();
      };
      if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(go, { timeout: 2500 });
        cancelIdle = () => window.cancelIdleCallback(id);
      } else {
        const id = window.setTimeout(go, 1200);
        cancelIdle = () => window.clearTimeout(id);
      }
    };
    if (deferUntilIdle) {
      if (document.readyState === 'complete') release();
      else window.addEventListener('load', release, { once: true });
    }

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('load', release);
      cancelIdle();
    };
  }, [src, rootMargin, deferUntilIdle]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      loop
      muted
      playsInline
      preload="none"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  );
}
