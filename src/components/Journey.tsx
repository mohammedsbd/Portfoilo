'use client';

import { useState } from 'react';
import { experience } from '@/data/profile';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

/**
 * FNV-1a, truncated the way a short commit hash is.
 *
 * Derived from the entry rather than randomised: a random hash would differ
 * between the server render and the client one and break hydration, and these
 * have to stay put across reloads anyway to read as real.
 */
function shortHash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

/**
 * The work history, read back as a commit log.
 *
 * Each role is an entry on the rail: hash, title, and the branch it landed
 * on, with the detail folded underneath as a diff you open. The newest
 * carries HEAD, and the insertion count on each is the real number of
 * highlights on that role rather than a decorative figure.
 *
 * The folds stay mounted and open through a grid row instead of being added
 * and removed, so an interrupted transition still settles somewhere correct.
 */
export default function Journey() {
  const [open, setOpen] = useState<number[]>([0]);

  const toggle = (i: number) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  return (
    <section className="section" id="journey">
      <div className="shell">
        <SectionHeader
          num="04"
          label="Journey"
          title="Where I have worked"
          lede="From maintaining someone else's PHP to designing systems other people maintain."
        />

        <div className="gl">
          {experience.map((job, i) => {
            const hash = shortHash(`${job.company}${job.period}${job.role}`);
            const isOpen = open.includes(i);
            const branch = job.company.split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '');

            return (
              <Reveal
                key={`${job.company}-${job.period}-${job.role}`}
                className={`gl__c ${isOpen ? 'is-open' : ''}`}
                delay={i * 90}
              >
                <span className="gl__rail" aria-hidden="true">
                  <i />
                </span>

                <button
                  type="button"
                  className="gl__head"
                  aria-expanded={isOpen}
                  onClick={() => toggle(i)}
                >
                  <span className="gl__hash">{hash}</span>
                  <span className="gl__role">{job.role}</span>
                  {i === 0 && (
                    <span className="gl__tag">
                      HEAD <span aria-hidden="true">→</span> main
                    </span>
                  )}
                  <span className="gl__caret" aria-hidden="true" />
                </button>

                <div className="gl__meta">
                  <span className="gl__branch">{branch}</span>
                  <span>{job.period}</span>
                  <span>{job.location}</span>
                  <span className="gl__ins">+{job.highlights.length}</span>
                </div>

                <div className="gl__fold">
                  <div className="gl__foldInner">
                    <div className="gl__body">
                      <p className="gl__summary">{job.summary}</p>

                      <ul className="gl__diff">
                        {job.highlights.map((h) => (
                          <li key={h}>
                            <span aria-hidden="true">+</span>
                            {h}
                          </li>
                        ))}
                      </ul>

                      <div className="chips">
                        {job.stack.map((s) => (
                          <span className="chip" key={s}>
                            {s}
                          </span>
                        ))}
                      </div>

                      {job.url && (
                        <a
                          className="gl__remote"
                          href={job.url}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {job.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
