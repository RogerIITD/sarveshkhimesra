'use client';

import { useEffect, useState } from 'react';

const GLYPHS = '!<>-_\\/[]{}=+*^?#%01ABCDEFXYZ';

// Decodes `text` from random glyphs, settling left → right over `ms`.
export function useScramble(text: string, ms = 650, enabled = true): string {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text);
      return;
    }
    const chars = Array.from(text);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const settled = Math.floor(p * chars.length);
      setOut(
        chars
          .map((c, i) => (i < settled || c === ' ' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join(''),
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, ms, enabled]);

  return out;
}
