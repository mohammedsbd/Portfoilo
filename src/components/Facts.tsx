'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { stack, stackGroups, type StackGroup } from '@/data/facts';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

type Filter = 'All' | StackGroup;

const FILTERS: Filter[] = ['All', ...stackGroups];

/**
 * The stack, set as a table of elements.
 *
 * One tile per language, framework and tool; picking a tile reads it out in
 * the panel beside the table. The filter dims the tiles it excludes rather
 * than removing them, so the shape of the table stays put and nothing under
 * the pointer jumps while you are reading it.
 */
export default function Facts() {
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState<Filter>('All');
  const reduce = useReducedMotion();

  const active = stack[selected];
  const matches = (group: StackGroup) => filter === 'All' || group === filter;
  const shown = stack.filter((e) => matches(e.group)).length;

  return (
    <section className="section" id="facts">
      <div className="shell">
        <SectionHeader
          num="06"
          label="The stack"
          title="Things that are true"
          lede="Every language and framework I actually work in. Pick one and it says what I do with it."
        />

        <Reveal>
          <div className="tbl">
            <div>
              <div className="tbl__filters" role="group" aria-label="Filter the table by group">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`tbl__filter ${filter === f ? 'is-on' : ''}`}
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
                <span className="tbl__count" aria-hidden="true">
                  {shown} / {stack.length}
                </span>
              </div>

              <div className="tbl__grid">
                {stack.map((e, i) => (
                  <button
                    key={e.symbol}
                    type="button"
                    className={`el ${selected === i ? 'is-active' : ''} ${
                      matches(e.group) ? '' : 'is-muted'
                    }`}
                    aria-pressed={selected === i}
                    aria-label={`${e.name}, ${e.group}`}
                    onClick={() => setSelected(i)}
                    onMouseEnter={() => setSelected(i)}
                  >
                    <span className="el__no" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="el__sym" aria-hidden="true">
                      {e.symbol}
                    </span>
                    <span className="el__name" aria-hidden="true">
                      {e.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* The readout. Keyed on the symbol so React swaps the whole block
                and the entrance replays — deliberately without AnimatePresence:
                the tiles select on hover, and waiting out an exit animation
                before each new one would put the panel a beat behind the
                pointer the whole way across the table. */}
            <aside className="read" aria-live="polite">
              <div>
                <motion.div
                  key={active.symbol}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="read__ghost" aria-hidden="true">
                    {active.symbol}
                  </span>

                  <span className="read__group">{active.group}</span>
                  <h3 className="read__name">{active.name}</h3>
                  <p className="read__line">{active.line}</p>

                  {active.shipped ? (
                    <p className="read__shipped">
                      <span>Shipped in</span>
                      <em>{active.shipped}</em>
                    </p>
                  ) : (
                    <p className="read__shipped read__shipped--none">
                      <span>In the kit</span>
                      <em>no shipped project yet</em>
                    </p>
                  )}
                </motion.div>
              </div>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
