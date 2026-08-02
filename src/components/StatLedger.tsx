'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { profile } from '@/data/profile';
import Counter from './Counter';

const EASE = [0.22, 1, 0.36, 1] as const;

/* Mark geometry, in viewBox units. Four uprights to a group and the fifth
   struck across them, the way anyone actually keeps a count on paper. */
const PITCH = 10; // gap between uprights
const GROUP_W = 40; // four uprights plus the strike's overhang
const GROUP_GAP = 15;
const PAD = 5;

interface Mark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Lays out `count` as tally marks: groups of five, the fifth struck across. */
function marksFor(count: number): { marks: Mark[]; width: number } {
  const marks: Mark[] = [];
  const groups = Math.floor(count / 5);
  const rest = count % 5;
  let x = PAD;

  for (let g = 0; g < groups; g++) {
    for (let i = 0; i < 4; i++) {
      marks.push({ x1: x + i * PITCH, y1: 4, x2: x + i * PITCH, y2: 36 });
    }
    // The strike is pushed out past the uprights at both ends, as drawn.
    marks.push({ x1: x - PAD, y1: 34, x2: x + 3 * PITCH + PAD, y2: 6 });
    x += GROUP_W + GROUP_GAP;
  }

  for (let i = 0; i < rest; i++) {
    marks.push({ x1: x + i * PITCH, y1: 4, x2: x + i * PITCH, y2: 36 });
  }
  if (rest > 0) x += (rest - 1) * PITCH;

  return { marks, width: Math.max(x + PAD, PAD * 2) };
}

/**
 * The figures, kept as a ledger.
 *
 * Each line is counted out in tally marks beside it, struck in as the row
 * scrolls up rather than printed already finished, so the count reads as
 * something that was kept rather than something that was claimed.
 */
export default function StatLedger() {
  const reduce = useReducedMotion();

  return (
    <div className="ledger">
      {profile.stats.map((s, i) => (
        <div className="ledger__row" key={s.label}>
          <span className="ledger__no" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>

          <div className="ledger__main">
            <span className="ledger__value">
              <Counter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
            </span>
            <span className="ledger__label">{s.label}</span>
          </div>

          <Tally count={s.tally} reduce={!!reduce} row={i} />
        </div>
      ))}
    </div>
  );
}

function Tally({ count, reduce, row }: { count: number; reduce: boolean; row: number }) {
  const { marks, width } = marksFor(count);

  return (
    <span className="ledger__tally" aria-hidden="true">
      <svg viewBox={`0 0 ${width} 40`} style={{ width: `${width / 40}em` }}>
        {marks.map((m, i) => (
          <motion.line
            key={i}
            x1={m.x1}
            y1={m.y1}
            x2={m.x2}
            y2={m.y2}
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.32, delay: row * 0.12 + i * 0.07, ease: EASE }}
          />
        ))}
      </svg>
    </span>
  );
}
