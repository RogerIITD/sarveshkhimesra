'use client';

import { useEffect, useRef, useState } from 'react';
import { useGame } from './GameProvider';

export function HUD() {
  const { xp, streak, classic, toggleClassic } = useGame();
  const [displayed, setDisplayed] = useState(xp);
  const prev = useRef(xp);

  // Count-up animation when XP changes
  useEffect(() => {
    if (xp === prev.current) return;
    const start = prev.current;
    const delta = xp - start;
    const duration = 400;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      setDisplayed(Math.round(start + delta * t));
      if (t < 1) raf = requestAnimationFrame(step);
      else prev.current = xp;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [xp]);

  return (
    <div className="flex items-center gap-3 text-xs text-muted" role="status" aria-live="polite">
      <span className="text-ball">XP {displayed}</span>
      <span aria-hidden>·</span>
      <span>🔥{streak}</span>
      <span aria-hidden>·</span>
      <button
        onClick={toggleClassic}
        className="underline decoration-dotted hover:text-prompt focus:text-prompt"
        aria-pressed={classic}
        data-target="hud-toggle"
      >
        [{classic ? 'game' : 'no-game'}]
      </button>
    </div>
  );
}
