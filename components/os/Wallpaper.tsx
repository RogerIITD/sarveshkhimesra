'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { Persona } from '@/content/personas';
import { SHAYARI } from '@/content/secret-shayari';

// Base wallpaper for the active persona + a hidden layer that only shows
// under a soft spotlight following the cursor (desktop pointers only).
export function Wallpaper({ persona }: { persona: Persona }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.current?.style.setProperty('--mx', `${e.clientX}px`);
        root.current?.style.setProperty('--my', `${e.clientY}px`);
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const w = persona.wallpaper;
  return (
    <div ref={root} className="absolute inset-0" style={{ ['--mx' as string]: '-999px', ['--my' as string]: '-999px' }} aria-hidden>
      {w.kind === 'image' && (
        <>
          <Image key={w.src} src={w.src} alt="" fill priority sizes="100vw" className="object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/75 via-bg/30 to-bg/85" />
        </>
      )}
      {w.kind === 'ink' && (
        <div className="absolute inset-0 bg-[#100b09]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgb(var(--accent)/0.22),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgb(var(--accent)/0.10),transparent_50%)]" />
          <p className="absolute -right-10 bottom-10 font-hindi text-[22vw] leading-none text-white/[0.035] select-none">शायरी</p>
        </div>
      )}
      {w.kind === 'court' && (
        <div className="absolute inset-0 bg-[#0b1c15] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(var(--accent)/0.12),transparent_60%)]" />
          <div className="absolute left-1/2 top-[8%] w-[46vw] [transform:translateX(-50%)_perspective(1200px)_rotateX(58deg)] origin-top">
            <Court className="w-full text-[rgb(var(--accent)/0.28)]" />
          </div>
        </div>
      )}

      {/* hidden layer, revealed by the cursor */}
      <div
        className="absolute inset-0 hidden md:block [mask-image:radial-gradient(240px_circle_at_var(--mx)_var(--my),black,transparent)] [-webkit-mask-image:radial-gradient(240px_circle_at_var(--mx)_var(--my),black,transparent)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(240px_circle_at_var(--mx)_var(--my),rgb(var(--accent)/0.10),transparent)]" />
        <div className="absolute inset-0 grid grid-cols-2 gap-x-24 gap-y-16 p-24 content-center">
          {SHAYARI.flatMap((s) => s.text.split('\n')).map((line, i) => (
            <p key={i} className={`font-hindi text-2xl text-accent/40 ${i % 2 ? 'text-right' : ''}`}>
              {line}
            </p>
          ))}
        </div>
        <Court className="absolute right-[6%] top-[12%] h-[70%] text-accent/25 rotate-12" />
      </div>
    </div>
  );
}

// Top-down tennis court to ITF proportions (cm).
function Court({ className }: { className?: string }) {
  return (
    <svg viewBox="-20 -20 1137 2417" className={className} fill="none" stroke="currentColor" strokeWidth="6">
      <rect x="0" y="0" width="1097" height="2377" />
      <line x1="137" y1="0" x2="137" y2="2377" />
      <line x1="960" y1="0" x2="960" y2="2377" />
      <line x1="137" y1="548" x2="960" y2="548" />
      <line x1="137" y1="1829" x2="960" y2="1829" />
      <line x1="548" y1="548" x2="548" y2="1829" />
      <line x1="-20" y1="1188" x2="1117" y2="1188" strokeWidth="10" />
      <line x1="548" y1="0" x2="548" y2="30" />
      <line x1="548" y1="2347" x2="548" y2="2377" />
    </svg>
  );
}
