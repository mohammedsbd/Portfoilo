'use client';

import { useEffect, useState } from 'react';

/**
 * Live clock in Addis Ababa (UTC+3). Renders empty on the server so the
 * markup matches on hydration, then ticks once mounted.
 */
export default function LocalClock({ withSeconds = true }: { withSeconds?: boolean }) {
  const [time, setTime] = useState('');

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

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [withSeconds]);

  return (
    <span suppressHydrationWarning>
      {time || '--:--'} <span style={{ opacity: 0.5 }}>EAT</span>
    </span>
  );
}
