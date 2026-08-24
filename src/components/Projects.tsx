'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { projects, type Project } from '@/data/projects';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import ProjectArt from './ProjectArt';
import WorkField from './WorkField';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Mockup browser frame for project preview ─── */
function LazyVideo({ src, className }: { src: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    io.observe(container);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="none"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}

function BrowserMockup({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <div className={`pshow__mockup ${isEven ? '' : 'pshow__mockup--right'}`}>
      <div className="pshow__browser">
        {/* Browser chrome */}
        <div className="pshow__chrome">
          <div className="pshow__dots">
            <i /><i /><i />
          </div>
          <div className="pshow__url">
            <svg viewBox="0 0 16 16" fill="none" width="10" height="10">
              <path d="M8 1a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V6a5 5 0 0 0-5-5z" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span>{project.links[0]?.url?.replace(/^https?:\/\//, '').replace(/\/$/, '') || `${project.slug}.app`}</span>
          </div>
        </div>
        {/* Screen area with video or generative art */}
        <div className="pshow__screen">
          {project.video ? (
            <LazyVideo src={project.video} className="pshow__video" />
          ) : (
            <div className="pshow__artWrap">
              <ProjectArt kind={project.art} palette={project.palette} seed={`show-${project.slug}`} />
            </div>
          )}
          <div className="pshow__screenGrade" />
        </div>
      </div>
      {/* Floating reflection */}
      <div className="pshow__reflection" aria-hidden="true" />
    </div>
  );
}

/* ─── Individual project showcase card ─── */
function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const y = useTransform(smoothProgress, [0, 1], [60, -60]);
  const isEven = index % 2 === 0;
  const [hi, lo] = project.palette;

  return (
    <motion.article
      ref={ref}
      className={`pshow ${isEven ? '' : 'pshow--flip'}`}
      style={
        {
          '--p-hi': hi,
          '--p-lo': lo,
        } as React.CSSProperties
      }
    >
      {/* Gradient background glow */}
      <div className="pshow__glow" aria-hidden="true" />

      <div className="pshow__inner">
        {/* Content side */}
        <motion.div className="pshow__content" style={{ y }}>
          {/* Number + category */}
          <Reveal>
            <div className="pshow__eyebrow">
              <span className="pshow__num">{String(index + 1).padStart(2, '0')}</span>
              <span className="pshow__divider" />
              <span className="pshow__cat">{project.categoryLabel}</span>
              <span className="pshow__statusBadge" data-status={project.status}>
                {project.status}
              </span>
            </div>
          </Reveal>

          {/* Title */}
          <Reveal delay={60}>
            <h3 className="pshow__title">{project.title}</h3>
          </Reveal>

          {/* Tagline */}
          <Reveal delay={120}>
            <p className="pshow__tagline">{project.tagline}</p>
          </Reveal>

          {/* Description */}
          <Reveal delay={180}>
            <p className="pshow__desc">{project.description}</p>
          </Reveal>

          {/* Metrics */}
          <Reveal delay={240}>
            <div className="pshow__metrics">
              {project.metrics.map((m, i) => (
                <div className="pshow__metric" key={i}>
                  <span className="pshow__metricVal">{m.value}</span>
                  <span className="pshow__metricLabel">{m.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Stack tags */}
          <Reveal delay={300}>
            <div className="pshow__stack">
              {project.stack.map((tech) => (
                <span className="pshow__tag" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>

          {/* CTA */}
          {project.links.length > 0 && (
            <Reveal delay={360}>
              <div className="pshow__actions">
                {project.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    className="pshow__cta"
                    target={l.url.startsWith('http') ? '_blank' : undefined}
                    rel={l.url.startsWith('http') ? 'noreferrer noopener' : undefined}
                  >
                    <span>{l.label}</span>
                    <span className="pshow__ctaArrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M7 17L17 7M17 7H7M17 7V17"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          )}
        </motion.div>

        {/* Visual side — browser mockup */}
        <Reveal delay={200} className="pshow__visual">
          <BrowserMockup project={project} index={index} />
        </Reveal>
      </div>
    </motion.article>
  );
}

/* ─── Main Projects section ─── */
export default function Projects() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  /* Which project owns the middle of the screen. One observer over the four
     cards rather than a scroll handler: it fires only on the handful of
     crossings, and the palette it picks is what the field behind the section
     eases its light to. */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.pshow'));
    if (!cards.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = cards.indexOf(entry.target as HTMLElement);
          if (i >= 0 && i !== activeRef.current) {
            activeRef.current = i;
            setActive(i);
          }
        }
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const [hi, lo] = projects[active]?.palette ?? projects[0].palette;

  /* `wsec`, not `work` — `.work` is already a two-column grid elsewhere in the
     stylesheet, and taking that name here threw the section's own children
     into columns. */
  return (
    <section
      className="section wsec"
      id="work"
      style={{ '--work-hi': hi, '--work-lo': lo } as React.CSSProperties}
    >
      <WorkField />

      <div className="shell">
        <SectionHeader
          num="03"
          label="Selected work"
          title="Things I have shipped"
          lede="Each project built end-to-end, from architecture to deployment. Hover the cards to explore."
        />
      </div>

      <div className="pshow__grid" ref={gridRef}>
        {projects.map((p, i) => (
          <ProjectShowcase key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
