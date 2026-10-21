'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Photo } from '@/content/os';

// A photo, or a silent looping clip that only downloads once it's on screen.
export function Media({ item, sizes, className = 'object-cover', priority }: { item: Photo; sizes: string; className?: string; priority?: boolean }) {
  if (!item.video) return <Image src={item.src} alt={item.alt} fill sizes={sizes} className={className} priority={priority} />;
  return <LazyVideo src={item.video} poster={item.src} label={item.alt} className={className} />;
}

function LazyVideo({ src, poster, label, className }: { src: string; poster: string; label: string; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false); // set once, the first time it's on screen

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setArmed(true);
        void el.play().catch(() => {});
      } else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={armed ? src : undefined}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
}
