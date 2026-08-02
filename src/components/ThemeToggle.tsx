'use client';

import { useSyncExternalStore, type MouseEvent } from 'react';
import { getServerTheme, getTheme, subscribe, toggleTheme } from '@/lib/theme';

/**
 * Theme switch.
 *
 * A sliding pill whose thumb carries a sun that closes into a crescent moon —
 * the crescent is a real mask cutout sliding across the disc, not two icons
 * cross-fading. Clicking it wipes the new theme across the page as a circle
 * growing from the button.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const isDark = theme === 'dark';

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`tswitch ${className}`.trim()}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {/* Track scenery: stars for night, drifting cloud for day */}
      <span className="tswitch__sky" aria-hidden="true">
        <i className="tswitch__star" />
        <i className="tswitch__star" />
        <i className="tswitch__star" />
        <i className="tswitch__cloud" />
      </span>

      <span className="tswitch__thumb" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="tswitch__icon">
          <defs>
            <mask id="tswitch-crescent">
              <rect x="0" y="0" width="24" height="24" fill="#fff" />
              {/* Slides over the disc to bite a crescent out of it */}
              <circle className="tswitch__bite" cx="26" cy="6" r="7" fill="#000" />
            </mask>
          </defs>

          <circle
            className="tswitch__disc"
            cx="12"
            cy="12"
            r="5.2"
            fill="currentColor"
            mask="url(#tswitch-crescent)"
          />

          <g className="tswitch__rays" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <line x1="12" y1="1.6" x2="12" y2="3.6" />
            <line x1="12" y1="20.4" x2="12" y2="22.4" />
            <line x1="1.6" y1="12" x2="3.6" y2="12" />
            <line x1="20.4" y1="12" x2="22.4" y2="12" />
            <line x1="4.6" y1="4.6" x2="6" y2="6" />
            <line x1="18" y1="18" x2="19.4" y2="19.4" />
            <line x1="4.6" y1="19.4" x2="6" y2="18" />
            <line x1="18" y1="6" x2="19.4" y2="4.6" />
          </g>
        </svg>
      </span>
    </button>
  );
}
