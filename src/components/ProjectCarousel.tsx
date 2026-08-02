'use client';

import { useEffect, useRef, useState } from 'react';
import { projects } from '@/data/projects';
import ProjectArt from './ProjectArt';

/**
 * 3D cylinder carousel of the projects, styled as premium metal cards.
 *
 * The transform maths, the eased "magnetic dwell" step, the smoothstep
 * interpolation bands and the perspective-aware edge alignment are kept
 * exactly as specified.
 *
 * Everything expensive is gated on visibility: the rAF loop does not run and
 * the videos carry no `src` until the section is on screen. Ten simultaneously
 * decoding videos — five of them blurred — is not something to leave running
 * behind eleven thousand pixels of page.
 */

const CARD_VIDEOS = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_030111_a9e15665-d379-4a7f-8116-695bbe452ad1.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_171347_f640c30d-ec21-426a-98bc-77e07c2c60cb.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_104800_bc43ae09-f494-43e3-97d7-2f8c1692cfd7.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4',
];

/** Volumetric depth: five parallel slices spanning -1.47px to 1.47px. */
const THICKNESS_LAYERS = [-1.47, -0.73, 0, 0.73, 1.47];

/** Vertical breathing room between the centre card and its neighbours. */
const GAP = 72;

/** Auto-rotation stays paused this long after the last drag. */
const IDLE_RESUME_MS = 1600;

/**
 * The wrap happens at ±cardCount/2, and the choreography only pushes a card
 * fully off-stage once |offset| passes 2. So the cylinder needs at least five
 * slots, or a card snaps from the top peek to the bottom peek in view.
 *
 * With four projects we run eight slots — each project twice, exactly half a
 * revolution apart, so a duplicate is always hidden or reduced to a sliver at
 * the opposite edge when its twin is on screen.
 */
const SLOTS = projects.length >= 5 ? projects.length : projects.length * 2;

export default function ProjectCarousel() {
  const cardCount = SLOTS;

  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameId = useRef<number>(0);

  /** Continuous scroll progress. */
  const progress = useRef<number>(0);

  /** Cursor position with inertia damping — current lags behind target. */
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  /**
   * Drag state.
   *
   * A mouse drags vertically, matching the direction the cards travel. Touch
   * drags horizontally instead, so `touch-action: pan-y` can keep vertical
   * page scrolling with the browser — grabbing the wheel or the vertical
   * touch axis would trap the reader inside a 774px panel.
   */
  const drag = useRef({
    active: false,
    start: 0,
    startProgress: 0,
    horizontal: false,
  });

  /** Timestamp before which auto-rotation stays paused. */
  const idleUntil = useRef(0);

  const [dragging, setDragging] = useState(false);

  /** Live stage height, so cards peek at the section edge not the viewport. */
  const stageH = useRef<number>(720);

  const [metrics, setMetrics] = useState({ cardW: 336, cardH: 211 });
  const [live, setLive] = useState(false);
  const [reduced, setReduced] = useState(false);

  /* ---- Respect reduced motion ---- */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  /* ---- Only animate and stream video while the section is on screen ---- */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setLive(true);
      return;
    }

    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      rootMargin: '200px 0px',
      threshold: 0,
    });

    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---- Pointer parallax ---- */
  useEffect(() => {
    if (reduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ry = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      mouse.current.targetX = Math.max(-1, Math.min(1, rx));
      mouse.current.targetY = Math.max(-1, Math.min(1, ry));
    };

    const handleMouseLeave = () => {
      mouse.current.targetX = 0;
      mouse.current.targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reduced]);

  /* ---- Card sizing, measured against the stage rather than the window ---- */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      stageH.current = rect.height || 720;

      let cardW = Math.round(rect.width * 0.2 + 170);
      const heightFactor = Math.min(1.0, Math.max(0.65, rect.height / 850));
      cardW = Math.round(cardW * heightFactor);
      cardW = Math.min(460, Math.max(190, cardW));

      const cardH = Math.round(cardW / 1.5925); // standard credit-card ratio
      setMetrics({ cardW, cardH });
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  /* ---- 60fps transform loop ---- */
  useEffect(() => {
    if (!live || reduced) return;

    const renderLoop = () => {
      // Hand control to the reader while they are dragging, and for a beat
      // afterwards so the cylinder does not snatch itself back.
      if (!drag.current.active && performance.now() > idleUntil.current) {
        progress.current += 0.0016;
      }

      // Damping / inertia toward the cursor target.
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

      const cards = cardsRefs.current;
      const h = stageH.current;
      const { cardH } = metrics;

      const continuousProgress = progress.current;
      const roundedIndex = Math.round(continuousProgress);
      const diffFromRound = continuousProgress - roundedIndex; // [-0.5, 0.5]

      // Non-linear magnetic step: a brief dwell at front centre, then accelerate.
      const easedDiff = (Math.sign(diffFromRound) * Math.pow(Math.abs(diffFromRound) * 2, 4.2)) / 2;
      const virtualActiveIndex = roundedIndex + easedDiff;

      for (let i = 0; i < cardCount; i++) {
        const card = cards[i];
        if (!card) continue;

        // Circular wrap to the closest representation.
        let offset = i - virtualActiveIndex;
        const halfCount = cardCount / 2;
        while (offset > halfCount) offset -= cardCount;
        while (offset < -halfCount) offset += cardCount;

        const absOffset = Math.abs(offset);
        const sign = Math.sign(offset);

        if (absOffset > 3.0) {
          card.style.visibility = 'hidden';
          continue;
        }
        card.style.visibility = 'visible';

        const gap = GAP;
        const peekAmount = -55; // push the edge past the boundary to hide part of it
        const D = 1350; // perspective distance

        let y = 0;
        let z = 0;
        let rot = 0;

        if (absOffset <= 1) {
          // Centre card → first adjacent.
          const t = absOffset;
          const easedT = t * t * (3 - 2 * t);

          const targetY = cardH + gap;
          y = -sign * (easedT * targetY);
          z = 400 + easedT * (220 - 400);
          rot = easedT * 132;
        } else if (absOffset <= 2) {
          // Adjacent → peeking at the stage edge.
          const t = absOffset - 1;
          const easedT = t * t * (3 - 2 * t);

          const yStart = cardH + gap;
          const zStart = 220;
          const rotStart = 132;

          const zEnd = -60;
          const rotEnd = 175;

          // Perspective-aware alignment against the stage boundary.
          const sEnd = D / (D - zEnd);
          const yEnd = (h / 2 - peekAmount) / sEnd - cardH / 2;

          y = -sign * (yStart + easedT * (yEnd - yStart));
          z = zStart + easedT * (zEnd - zStart);
          rot = rotStart + easedT * (rotEnd - rotStart);
        } else {
          // Peeking → fully off stage.
          const t = Math.min(absOffset - 2, 1);
          const easedT = t * t * (3 - 2 * t);

          const zStart = -60;
          const rotStart = 175;
          const zEnd3 = -250;
          const rotEnd3 = 195;

          const sEnd2 = D / (D - zStart);
          const yEnd2 = (h / 2 - peekAmount) / sEnd2 - cardH / 2;

          const sEnd3 = D / (D - zEnd3);
          const yEnd3 = (h / 2 + 100) / sEnd3 + cardH / 2;

          y = -sign * (yEnd2 + easedT * (yEnd3 - yEnd2));
          z = zStart + easedT * (zEnd3 - zStart);
          rot = rotStart + easedT * (rotEnd3 - rotStart);
        }

        const localCardRotation = -sign * rot;

        // 1.0 at dead centre, 0.0 once adjacent — scales the pointer tilt.
        const centerFactor = Math.max(0, 1 - absOffset);

        const maxTiltY = 15;
        const maxTiltX = 12;

        const activeTiltX = -mouse.current.y * maxTiltX * centerFactor;
        const activeTiltY = mouse.current.x * maxTiltY * centerFactor;

        const totalRotX = localCardRotation + activeTiltX;
        const totalRotY = activeTiltY;

        card.style.zIndex = Math.round(z).toString();
        card.style.transform =
          `translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(2)}px) ` +
          `rotateX(${totalRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(2)}deg) rotateZ(-3deg)`;
      }
    };

    const tick = () => {
      renderLoop();
      frameId.current = requestAnimationFrame(tick);
    };

    frameId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId.current);
  }, [metrics, live, reduced, cardCount]);

  /* ---- Reduced motion: lay the cards out statically, no loop ---- */
  useEffect(() => {
    if (!reduced) return;
    const { cardH } = metrics;

    cardsRefs.current.forEach((card, i) => {
      if (!card) return;
      card.style.visibility = i < 2 ? 'visible' : 'hidden';
      card.style.zIndex = String(100 - i);
      card.style.transform = `translateY(${i * (cardH + 36)}px) translateZ(${400 - i * 180}px)`;
    });
  }, [reduced, metrics]);

  /* ---- Drag to browse ---- */
  const step = () => metrics.cardH + GAP;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    drag.current.horizontal = e.pointerType === 'touch';
    drag.current.active = true;
    drag.current.start = drag.current.horizontal ? e.clientX : e.clientY;
    drag.current.startProgress = progress.current;
    setDragging(true);
    // Capture can throw if the pointer is already gone; the drag still works
    // without it, so never let that break the interaction.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* no capture available */
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const pos = drag.current.horizontal ? e.clientX : e.clientY;
    // Cards travel downward as progress rises, so dragging down advances.
    progress.current = drag.current.startProgress + (pos - drag.current.start) / step();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    idleUntil.current = performance.now() + IDLE_RESUME_MS;
    setDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* nothing to release */
    }
  };

  /** Step exactly one card, for the arrow controls and keyboard. */
  const nudge = (dir: 1 | -1) => {
    progress.current = Math.round(progress.current) + dir;
    idleUntil.current = performance.now() + IDLE_RESUME_MS;
  };

  return (
    <div
      className={`carousel ${dragging ? 'is-dragging' : ''}`}
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="group"
      aria-label="Project cards, drag to browse"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); nudge(1); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); nudge(-1); }
      }}
    >
      {/* Sits inside the stage, so keep its clicks from starting a drag. */}
      <div className="carousel__controls" onPointerDown={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Previous project" onClick={() => nudge(-1)}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <span className="carousel__hint">Drag</span>
        <button type="button" aria-label="Next project" onClick={() => nudge(1)}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="carousel__camera">
        <div
          className="carousel__space"
          style={{ width: `${metrics.cardW}px`, height: `${metrics.cardH}px` }}
        >
          {Array.from({ length: cardCount }).map((_, i) => {
            const p = projects[i % projects.length];
            // Keyed off the project, not the slot, so both copies of a project
            // share a video and generated palette.
            const projectIndex = i % projects.length;
            const videoSrc = CARD_VIDEOS[projectIndex % CARD_VIDEOS.length];
            const [hi] = p.palette;

            return (
              <div
                key={`${p.slug}-${i}`}
                ref={(el) => {
                  cardsRefs.current[i] = el;
                }}
                className="ccard"
                style={{ width: `${metrics.cardW}px`, height: `${metrics.cardH}px` }}
              >
                {THICKNESS_LAYERS.map((zOffset, layerIdx) => {
                  const isFrontFace = layerIdx === THICKNESS_LAYERS.length - 1;
                  const isBackFace = layerIdx === 0;

                  /* ---- Middle structural slices: the card's metal edge ---- */
                  if (!isFrontFace && !isBackFace) {
                    return (
                      <div
                        key={layerIdx}
                        className="ccard__core"
                        style={{ transform: `translateZ(${zOffset}px)` }}
                      />
                    );
                  }

                  /* ---- Front face ---- */
                  if (isFrontFace) {
                    return (
                      <div
                        key={layerIdx}
                        className="ccard__face ccard__face--front"
                        style={{ transform: `translateZ(${zOffset}px)` }}
                      >
                        {/* Generative art underneath, so the card is never blank
                            if the remote video fails to load. */}
                        <div className="ccard__art">
                          <ProjectArt kind={p.art} palette={p.palette} seed={`car-${p.slug}-${i}`} />
                        </div>

                        {live && (
                          <video
                            src={videoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="none"
                            className="ccard__video"
                          />
                        )}

                        <div className="ccard__content">
                          {/* Silver metallic contact chip */}
                          <div className="ccard__chip">
                            <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M20 8H40V14C40.0016 14.5299 40.2128 15.0377 40.5875 15.4125C40.9623 15.7872 41.4701 15.9984 42 16H59V24H42C41.4701 24.0016 40.9623 24.2128 40.5875 24.5875C40.2128 24.9623 40.0016 25.4701 40 26V52H20V8ZM18 8H8.00039C4.47435 8 1.56576 10.6083 1.08 14H18V8ZM1 16V24V26V34V36V44H18V36H1V34H18V26H1V24H18V16H1ZM1.08 46C1.56576 49.3917 4.47435 52 8.00039 52H18V46H1.08ZM42 14V8H52.0004C55.5264 8 58.4342 10.6084 58.92 14H42ZM59 26H42V34H59V26ZM59 36H42V44H59V36ZM52.0004 52H42V46H58.92C58.4342 49.3916 55.5264 52 52.0004 52Z"
                                fill={`url(#chip-grad-${i})`}
                              />
                              <defs>
                                <linearGradient
                                  id={`chip-grad-${i}`}
                                  x1="30"
                                  y1="8"
                                  x2="30"
                                  y2="52"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#f2f0e2" />
                                  <stop offset="1" stopColor="#8a8778" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>

                          {/* Brand mark, top-right */}
                          <div className="ccard__brand">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M2 7 L12 2 L22 7" stroke="currentColor" strokeWidth="1.8" />
                              <path d="M2 12 L12 7 L22 12" stroke="var(--accent)" strokeWidth="1.8" />
                              <path
                                d="M2 17 L12 12 L22 17"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                opacity="0.5"
                              />
                            </svg>
                            <span>M. Salih</span>
                          </div>

                          {/* Project identity, bottom-left */}
                          <div className="ccard__id">
                            <span className="ccard__cat" style={{ color: hi }}>
                              {p.categoryLabel}
                            </span>
                            <strong className="ccard__title">{p.title}</strong>
                          </div>

                          {/* Intersecting circles, bottom-right */}
                          <div className="ccard__circles">
                            <i />
                            <i />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  /* ---- Back face ---- */
                  return (
                    <div
                      key={layerIdx}
                      className="ccard__face ccard__face--back"
                      style={{ transform: `translateZ(${zOffset}px) rotateX(180deg)` }}
                    >
                      <div className="ccard__blur">
                        <div className="ccard__art">
                          <ProjectArt kind={p.art} palette={p.palette} seed={`carb-${p.slug}-${i}`} />
                        </div>
                        {live && (
                          <video
                            src={videoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="none"
                            className="ccard__video"
                          />
                        )}
                      </div>

                      {/* Magnetic stripe */}
                      <div className="ccard__stripe" />

                      <div className="ccard__details">
                        <div className="ccard__row">{p.stack.slice(0, 3).join('  ')}</div>
                        <div className="ccard__meta">
                          <span>{p.role.toUpperCase()}</span>
                          <span className="ccard__dot">•</span>
                          <span>{p.year}</span>
                          <span className="ccard__dot">•</span>
                          <span>{p.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
