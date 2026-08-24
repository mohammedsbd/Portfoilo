'use client';

import { useRef } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

/**
 * Progressive text reveal: each character lifts from 0.2 to full opacity as
 * the block travels through the viewport, so the sentence appears to be read
 * into existence.
 */
export default function ScrollRevealText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');
  const total = chars.length;

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!ref.current) return;
    const spans = ref.current.querySelectorAll<HTMLSpanElement>('.reveal-char');
    
    spans.forEach((span) => {
      const index = parseInt(span.dataset.index || '0', 10);
      const charProgress = index / total;
      
      const start = charProgress - 0.1;
      const end = charProgress + 0.05;
      
      let opacity = 0.2;
      if (latest >= end) {
        opacity = 1;
      } else if (latest > start) {
        opacity = 0.2 + 0.8 * ((latest - start) / (end - start));
      }
      
      span.style.opacity = opacity.toString();
    });
  });

  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => {
        if (char === ' ') return <span key={i}> </span>;
        
        return (
          <span 
            key={i} 
            data-index={i} 
            className="reveal-char"
            style={{ opacity: 0.2 }}
          >
            {char}
          </span>
        );
      })}
    </p>
  );
}
