'use client';

import { LazyMotion, domAnimation } from 'framer-motion';

/**
 * Every animated element on the site is an `m.*` component, which carries no
 * animation code of its own. The engine is loaded once, here, with only the
 * DOM-animation feature set (no layout/drag), which is most of framer-motion's
 * weight off the first-load bundle. `strict` makes a stray `motion.*` throw in
 * development instead of quietly pulling the full bundle back in.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
