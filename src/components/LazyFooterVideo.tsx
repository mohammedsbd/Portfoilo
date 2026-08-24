'use client';

import { useEffect, useRef, useState } from 'react';

export default function LazyFooterVideo({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!videoSrc) setVideoSrc(src);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '200% 0px' }
    );

    io.observe(container);
    return () => io.disconnect();
  }, [src, videoSrc]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        src={videoSrc}
        loop
        muted
        playsInline
        preload="none"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}
