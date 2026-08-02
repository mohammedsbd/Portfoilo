'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { education, certifications } from '@/data/profile';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * '4.0 / 4.0' → the two halves plus the ratio between them. Anything that
 * does not parse falls back to a closed ring rather than an empty one, so a
 * reworded GPA in profile.ts degrades to a mark instead of a broken gauge.
 */
function readGpa(gpa: string): { got: string; of: string; ratio: number } {
  const [got = gpa, of = ''] = gpa.split('/').map((s) => s.trim());
  const a = Number.parseFloat(got);
  const b = Number.parseFloat(of);
  const ratio = Number.isFinite(a) && Number.isFinite(b) && b > 0 ? Math.min(a / b, 1) : 1;
  return { got, of, ratio };
}

/** Two or three letters for the seal — 'Evangadi Tech' → ET, 'LaloDev' → LA. */
function initials(name: string) {
  const words = name.trim().split(/\s+/);
  const raw = words.length > 1 ? words.map((w) => w[0]).join('') : name.slice(0, 2);
  return raw.toUpperCase().slice(0, 3);
}

/**
 * The academic record, set as issued credentials rather than as a transcript.
 *
 * The degree is a plaque: engraved security-paper ruling, a foil sweep across
 * it, and a medallion whose rim carries the institution as circular type
 * turning around the grade. The coursework sits under it as numbered modules
 * that light up in sequence. The two certificates are torn-off tickets — a
 * vertical stub with the issuer stamped into it, punched notches at the tear,
 * and the detail on the counterfoil.
 */
export default function Education() {
  const reduce = useReducedMotion();
  const { got, of, ratio } = readGpa(education.gpa);

  /* Stretched to the full circumference below, so the rim always closes
     however the school or the dates are later reworded. */
  const rim = `${education.school} · ${education.period} · ${education.location} · `.toUpperCase();

  return (
    <section className="section" id="education">
      <div className="shell">
        <SectionHeader
          num="05"
          label="Education"
          title="Studying & certified"
          lede="A degree in progress, plus two hands-on programs that were all project work."
        />

        <Reveal>
          <article className="plaque">
            {/* Engraved ruling and the foil pass over it. */}
            <span className="plaque__guilloche" aria-hidden="true" />
            <span className="plaque__foil" aria-hidden="true" />

            <div className="plaque__inner">
              {/* ---- the medallion ---- */}
              <div className="plaque__medal">
                <div className="medal">
                  <svg className="medal__rim" viewBox="0 0 200 200" aria-hidden="true">
                    <defs>
                      <path
                        id="medalRimPath"
                        d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
                      />
                    </defs>
                    <text className="medal__rimText">
                      <textPath
                        href="#medalRimPath"
                        startOffset="0"
                        textLength="502"
                        lengthAdjust="spacing"
                      >
                        {rim}
                      </textPath>
                    </text>
                  </svg>

                  <svg className="medal__gauge" viewBox="0 0 200 200" aria-hidden="true">
                    <circle className="medal__track" cx="100" cy="100" r="62" />
                    <motion.circle
                      className="medal__arc"
                      cx="100"
                      cy="100"
                      r="62"
                      transform="rotate(-90 100 100)"
                      initial={reduce ? false : { pathLength: 0 }}
                      whileInView={{ pathLength: ratio }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 1.6, ease: EASE }}
                    />
                  </svg>

                  <div className="medal__mark">
                    <span className="medal__gpa">{got}</span>
                    <span className="medal__of">of {of}</span>
                  </div>
                </div>

                <span className="medal__cap">Current GPA</span>
              </div>

              {/* ---- the award line ---- */}
              <div className="plaque__body">
                <div className="plaque__meta">
                  <span className="plaque__live">
                    <i aria-hidden="true" />
                    In progress
                  </span>
                  <span className="plaque__period">{education.period}</span>
                </div>

                <h3 className="plaque__degree">{education.degree}</h3>

                <p className="plaque__school">
                  {education.school}
                  <span aria-hidden="true">·</span>
                  {education.location}
                </p>

                <p className="plaque__note">{education.note}</p>
              </div>
            </div>

            {/* ---- coursework, as numbered modules ---- */}
            <div className="modules">
              <span className="modules__label">Relevant coursework</span>
              <ol className="modules__grid">
                {education.coursework.map((course, i) => (
                  <motion.li
                    key={course}
                    className="module"
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.55, delay: 0.1 + i * 0.09, ease: EASE }}
                  >
                    <span className="module__no">{String(i + 1).padStart(2, '0')}</span>
                    <span className="module__name">{course}</span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </article>
        </Reveal>

        {/* ---- the certificates, as torn-off tickets ---- */}
        <div className="tickets">
          {certifications.map((cert, i) => (
            <Reveal key={cert.title} className="tkt" delay={140 + i * 120}>
              <div className="tkt__stub" aria-hidden="true">
                <span className="tkt__stubSeal">{initials(cert.issuer)}</span>
                <span className="tkt__stubText">Certificate</span>
                <span className="tkt__stubNo">{String(i + 1).padStart(2, '0')}</span>
              </div>

              {/* Punched at the tear so the stub reads as detachable. */}
              <span className="tkt__notch tkt__notch--top" aria-hidden="true" />
              <span className="tkt__notch tkt__notch--bottom" aria-hidden="true" />
              <span className="tkt__tear" aria-hidden="true" />

              <div className="tkt__body">
                <span className="tkt__period">{cert.period}</span>
                <h4 className="tkt__title">{cert.title}</h4>
                <p className="tkt__issuer">{cert.issuer}</p>

                <ul className="tkt__list">
                  {cert.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
