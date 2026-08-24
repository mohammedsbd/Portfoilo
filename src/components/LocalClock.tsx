'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * Live clock in Addis Ababa (UTC+3). Renders empty on the server so the
 * markup matches on hydration, then ticks once mounted.
 */
export default function LocalClock({ withSeconds = true }: { withSeconds?: boolean }) {
  const [time, setTime] = useState('');
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Addis_Ababa',
      hour: '2-digit',
      minute: '2-digit',
      ...(withSeconds ? { second: '2-digit' as const } : {}),
      hour12: false,
    });

    const tick = () => setTime(fmt.format(new Date()));
    tick();

    let id: number | undefined;
    const start = () => {
      if (!id) id = window.setInterval(tick, 1000);
    };
    const stop = () => {
      if (id) {
        window.clearInterval(id);
        id = undefined;
      }
    };

    if (!ref.current) {
      start();
      return stop;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) start();
      else stop();
    });
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [withSeconds]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {time || '--:--'} <span style={{ opacity: 0.5 }}>EAT</span>
    </span>
  );
}
