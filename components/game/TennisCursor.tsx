'use client';

import { useEffect, useRef } from 'react';
import { useGame } from './GameProvider';

function shouldDisable(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return true;
  return false;
}

export function TennisCursor() {
  const { classic } = useGame();
  const racquetRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const racquet = useRef({ x: 0, y: 0 });
  const ball = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (classic || shouldDisable()) return;
    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener('pointermove', onMove);
    let raf = 0;
    const tick = () => {
      racquet.current.x += (target.current.x - racquet.current.x) * 0.2;
      racquet.current.y += (target.current.y - racquet.current.y) * 0.2;
      ball.current.x += (racquet.current.x + 14 - ball.current.x) * 0.1;
      ball.current.y += (racquet.current.y + 14 - ball.current.y) * 0.1;
      if (racquetRef.current) {
        racquetRef.current.style.transform = `translate(${racquet.current.x - 18}px, ${racquet.current.y - 18}px) rotate(-18deg)`;
      }
      if (ballRef.current) {
        ballRef.current.style.transform = `translate(${ball.current.x - 6}px, ${ball.current.y - 6}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [classic]);

  if (classic || shouldDisable()) return null;
  return (
    <>
      <div
        ref={racquetRef}
        className="fixed top-0 left-0 w-9 h-9 z-[60] pointer-events-none"
        aria-hidden
      >
        <svg viewBox="0 0 40 40" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 6px rgba(217,240,74,0.5))' }}>
          <ellipse cx="14" cy="14" rx="11" ry="13" fill="none" stroke="#d9f04a" strokeWidth="2" />
          <g stroke="#d9f04a" strokeWidth="0.7" opacity="0.85">
            <line x1="4" y1="14" x2="25" y2="14" />
            <line x1="14" y1="2" x2="14" y2="27" />
            <line x1="7" y1="6" x2="22" y2="22" />
            <line x1="22" y1="6" x2="7" y2="22" />
          </g>
          <line x1="22" y1="22" x2="36" y2="36" stroke="#8a6a2a" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <div
        ref={ballRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-ball z-[60] pointer-events-none"
        style={{ boxShadow: '0 0 10px #d9f04a' }}
        aria-hidden
      />
    </>
  );
}
