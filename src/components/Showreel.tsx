'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

const SRC = '/media/showreel.mp4';

/**
 * Cinematic panel inside the Work section.
 *
 * The clip is silent, so it behaves like motion artwork rather than a video
 * player: it streams in only once it is near the viewport, plays while it is
 * on screen, and pauses the moment it leaves so it costs nothing in the
 * background.
 */
export default function Showreel() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  const [armed, setArmed] = useState(false); // src attached
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);

  const progressBarRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end start'],
  });

  /* No parallax on the video itself. Drifting it inside a mask meant
     rendering it ~16% larger than its box, which upscaled a 1924x1076 source
     and visibly softened it. The frame now maps 1:1 to the source pixels. */
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.55, 0.1]);

  /* Attach the source only when the panel is within a screen of the viewport,
     so 14MB is never fetched for someone who never scrolls this far. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Without observer support, just load it rather than showing a dead frame.
    if (typeof IntersectionObserver === 'undefined') {
      setArmed(true);
      return;
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: '100% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Play while visible, pause while not. */
  useEffect(() => {
    const el = wrapRef.current;
    const video = videoRef.current;
    if (!el || !video || !armed || reduce) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          video.play().catch(() => {
            /* autoplay blocked — the poster and controls still work */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [armed, reduce]);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <motion.div
      className="reel"
      ref={wrapRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span className="reel__aura" style={reduce ? undefined : { opacity: glow }} />

      <div
        className="reel__frame"
        onClick={toggle}
        role="button"
        tabIndex={0}
        aria-label={playing ? 'Pause showreel' : 'Play showreel'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <div className="reel__media">
          <video
            ref={videoRef}
            src={armed ? SRC : undefined}
            muted
            loop
            playsInline
            preload="metadata"
            controls={false}
            onLoadedMetadata={(e) => {
              setDuration(e.currentTarget.duration);
              setReady(true);
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) {
                const p = v.currentTime / v.duration;
                if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${p})`;
                if (timeRef.current) timeRef.current.textContent = fmt(v.currentTime);
              }
            }}
          />
        </div>

        {/* Light vignette only, kept to the edges where the HUD text sits, so
            the picture itself stays untouched. */}
        <span className="reel__grade" aria-hidden="true" />

        {/* framing marks */}
        <span className="reel__corner reel__corner--tl" aria-hidden="true" />
        <span className="reel__corner reel__corner--tr" aria-hidden="true" />
        <span className="reel__corner reel__corner--bl" aria-hidden="true" />
        <span className="reel__corner reel__corner--br" aria-hidden="true" />

        <div className="reel__hud reel__hud--top">
          <span className="reel__tag">
            <i className={playing ? 'is-live' : ''} />
            {playing ? 'Now playing' : ready ? 'Paused' : 'Loading'}
          </span>
          <span className="reel__tag">Showreel / 2026</span>
        </div>

        <div className="reel__hud reel__hud--bottom">
          <div className="reel__meta">
            <h3 className="reel__title">Work in motion</h3>
            <p className="reel__sub">
              Interfaces, dashboards and product flows I have designed and shipped.
            </p>
          </div>

          <div className="reel__controls">
            <span className="reel__time">
              <span ref={timeRef}>00:00</span> / {fmt(duration)}
            </span>
            <button
              className="reel__btn"
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
                  <rect x="1.5" y="1" width="3" height="10" fill="currentColor" />
                  <rect x="7.5" y="1" width="3" height="10" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
                  <path d="M2 1 L11 6 L2 11 Z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="reel__progress">
          <span ref={progressBarRef} style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>
    </motion.div>
  );
}
