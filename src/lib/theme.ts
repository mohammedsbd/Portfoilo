export type Theme = 'light' | 'dark';

const KEY = 'theme';
const listeners = new Set<() => void>();

/** Read whatever the pre-paint script already stamped on <html>. */
export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return (document.documentElement.dataset.theme as Theme) ?? 'dark';
}

/** Server render assumes dark; the inline script corrects before first paint. */
export function getServerTheme(): Theme {
  return 'dark';
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function commit(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* private mode — the theme still applies for this session */
  }
  listeners.forEach((fn) => fn());
}

/**
 * Swap the theme, revealing it as a circle growing out of the point the user
 * clicked. Uses the View Transitions API where available; everywhere else the
 * theme simply flips, which is a perfectly good outcome rather than a broken
 * one.
 */
export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';

  // Not in Firefox or older Safari yet, so feature-detect rather than assume.
  const start = document.startViewTransition?.bind(document);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!start || reduce || !origin) {
    commit(next);
    return;
  }

  const { x, y } = origin;
  // Radius needed to cover the furthest corner from the click point.
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  const transition = start(() => commit(next));

  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`],
        },
        {
          duration: 620,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    })
    .catch(() => {
      /* transition was skipped — the theme is already committed */
    });
}
