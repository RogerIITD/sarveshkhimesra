'use client';

import { useEffect, useRef } from 'react';
import { useGame } from './GameProvider';

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bornAt: number;
  bounces: number;
  targetsHit: Set<string>;
  el: HTMLDivElement;
};

function reducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function BallField() {
  const { classic, turbo, unlock } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const servedRef = useRef(false);

  useEffect(() => {
    if (classic) return;
    const container = containerRef.current;
    if (!container) return;
    const MAX_BALLS = 8;
    const reduced = reducedMotion();

    function spawn(x: number, y: number) {
      if (!container) return;
      // Trim oldest if at cap
      while (ballsRef.current.length >= MAX_BALLS) {
        const oldest = ballsRef.current.shift();
        oldest?.el.remove();
      }
      const speed = turbo ? 7 : 4.5;
      const angle = Math.random() * Math.PI * 2;
      const el = document.createElement('div');
      el.style.cssText = `position:fixed;left:0;top:0;width:14px;height:14px;border-radius:50%;background:#d9f04a;box-shadow:0 0 ${turbo ? 22 : 12}px #d9f04a;pointer-events:none;z-index:55;will-change:transform`;
      container.appendChild(el);
      ballsRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        bornAt: performance.now(),
        bounces: 0,
        targetsHit: new Set<string>(),
        el,
      });
      if (!servedRef.current) {
        servedRef.current = true;
        unlock('server');
      }
      // For reduced-motion: fade out quickly with no physics path.
      if (reduced) {
        el.style.transform = `translate(${x - 7}px, ${y - 7}px)`;
        el.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 400, fill: 'forwards' },
        ).onfinish = () => el.remove();
        ballsRef.current = ballsRef.current.filter((b) => b.el !== el);
      }
    }

    function onPointerDown(e: PointerEvent) {
      const t = e.target as HTMLElement | null;
      if (t?.closest('a, button, input, textarea, select, [role="button"]')) return;
      spawn(e.clientX, e.clientY);
    }
    window.addEventListener('pointerdown', onPointerDown);

    let raf = 0;
    const tick = (now: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-target]'));
      const surviving: Ball[] = [];
      for (const b of ballsRef.current) {
        b.x += b.vx;
        b.y += b.vy;
        let bounced = false;
        if (b.x < 7) { b.x = 7; b.vx *= -1; bounced = true; }
        if (b.x > w - 7) { b.x = w - 7; b.vx *= -1; bounced = true; }
        if (b.y < 7) { b.y = 7; b.vy *= -1; bounced = true; }
        if (b.y > h - 7) { b.y = h - 7; b.vy *= -1; bounced = true; }
        if (bounced) b.bounces++;

        for (const t of targets) {
          const r = t.getBoundingClientRect();
          if (b.x + 7 > r.left && b.x - 7 < r.right && b.y + 7 > r.top && b.y - 7 < r.bottom) {
            const key = `${t.dataset.target}:${Math.round(r.left)},${Math.round(r.top)}`;
            if (!b.targetsHit.has(key)) {
              b.targetsHit.add(key);
              t.animate(
                [
                  { filter: 'brightness(1)' },
                  { filter: 'brightness(1.6) drop-shadow(0 0 8px #d9f04a)' },
                  { filter: 'brightness(1)' },
                ],
                { duration: 320 },
              );
              if (b.targetsHit.size >= 3) unlock('net_shot');
            }
            const cx = (r.left + r.right) / 2;
            const cy = (r.top + r.bottom) / 2;
            const dx = b.x - cx;
            const dy = b.y - cy;
            if (Math.abs(dx) > Math.abs(dy)) b.vx = Math.sign(dx || 1) * Math.abs(b.vx);
            else b.vy = Math.sign(dy || 1) * Math.abs(b.vy);
          }
        }

        const age = now - b.bornAt;
        if (age >= 10000 && !b.targetsHit.has('__volley__')) {
          unlock('volley');
          b.targetsHit.add('__volley__');
        }
        if (b.bounces >= 4 || age > 12000) {
          b.el.remove();
          continue;
        }

        b.el.style.transform = `translate(${b.x - 7}px, ${b.y - 7}px)`;
        surviving.push(b);
      }
      ballsRef.current = surviving;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointerdown', onPointerDown);
      ballsRef.current.forEach((b) => b.el.remove());
      ballsRef.current = [];
    };
  }, [classic, turbo, unlock]);

  return <div ref={containerRef} aria-hidden />;
}
