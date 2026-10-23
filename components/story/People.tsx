'use client';

import { AnimatePresence, easeOut, motion, useMotionValueEvent, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PEOPLE } from '@/content/os';
import { Media } from '@/components/os/Media';
import { Words } from './Words';

// Desktop: polaroids fly in and land in a scattered collage (left/top in % of the stage).
const SLOTS: { left: number; top: number; rot: number }[] = [
  { left: 0, top: 2, rot: -4 },
  { left: 19, top: 47, rot: 3 },
  { left: 37, top: 0, rot: -3 },
  { left: 54, top: 8, rot: 4 },
  { left: 76, top: 2, rot: -5 },
  { left: 2, top: 50, rot: 4 },
  { left: 39, top: 56, rot: -2 },
  { left: 77, top: 48, rot: 3 },
  { left: 58, top: 52, rot: -4 },
  { left: 19, top: -2, rot: 2 },
];
// Phones: dealt onto one stack, slightly fanned.
const STACK_ROT = [-3, 2, -1, 3, -2, 1, -3, 2, -1, 0];

const windowFor = (i: number): [number, number] => [0.1 + i * 0.085, 0.22 + i * 0.085];

function useDesktop() {
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return desktop;
}

export function People({ p }: { p: MotionValue<number> }) {
  const desktop = useDesktop();
  const [top, setTop] = useState(-1);
  useMotionValueEvent(p, 'change', (v) => setTop(PEOPLE.reduce((n, _, i) => (v > windowFor(i)[1] - 0.04 ? i : n), -1)));

  return (
    <div className="relative h-full flex flex-col pt-20 md:pt-24 md:[@media(max-height:760px)]:pt-16 pb-6 px-6 md:px-16 max-w-7xl mx-auto">
      <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent">05 — my people</p>
      <Words
        text="Everything good in my life has a few people standing next to it."
        progress={p}
        from={0}
        to={0.1}
        className="mt-3 md:mt-4 text-2xl md:text-4xl lg:text-5xl md:[@media(max-height:760px)]:text-4xl [@media(max-height:640px)]:text-xl font-semibold tracking-tight leading-[1.15] text-ink max-w-4xl"
      />
      <div className="relative flex-1 mt-6 md:mt-8 min-h-0">
        {PEOPLE.map((item, i) => (
          <Card key={item.photo.src} i={i} p={p} desktop={desktop} {...item} />
        ))}
      </div>
      {/* phones: the caption of the card on top of the stack */}
      <div className="md:hidden h-16 mt-3 mb-14">
        <AnimatePresence mode="wait">
          {top >= 0 && (
            <motion.p
              key={top}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-dim leading-snug text-center"
            >
              {PEOPLE[top].photo.caption}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Card({ i, p, desktop, photo, shape }: { i: number; p: MotionValue<number>; desktop: boolean } & (typeof PEOPLE)[number]) {
  const [a, b] = windowFor(i);
  const slot = SLOTS[i];
  const rot = desktop ? slot.rot : STACK_ROT[i];
  const from = i % 2 ? 28 : -28;
  // sprung + eased so cards glide in and settle softly rather than tracking the wheel 1:1
  const sp = useSpring(p, { stiffness: 140, damping: 28, mass: 0.6 });
  const y = useTransform(sp, [a, b], [900, 0], { ease: easeOut });
  const x = useTransform(sp, [a, b], [from * 6, 0], { ease: easeOut });
  const rotate = useTransform(sp, [a, b], [rot + from, rot], { ease: easeOut });
  const opacity = useTransform(sp, [a, a + 0.02], [0, 1]);

  // widths scale with both viewport sides so the collage fits short laptop screens too
  const width = desktop
    ? shape === 'L'
      ? 'min(15vw, 24vh)'
      : 'min(11vw, 17vh)'
    : shape === 'L'
      ? 'min(78vw, 36vh)'
      : 'min(56vw, 26vh)';

  return (
    <div
      className={desktop ? 'absolute' : 'absolute inset-0 flex items-center [@media(max-height:640px)]:items-start justify-center pointer-events-none'}
      style={desktop ? { left: `${slot.left}%`, top: `${slot.top}%`, zIndex: i } : { zIndex: i }}
    >
      <motion.figure style={{ y, x, rotate, opacity, width }} className="pointer-events-auto rounded-md bg-[#f4efe6] p-1.5 pb-2 md:p-2 shadow-2xl shadow-black/60 hover:!z-50">
        <div className={`relative ${shape === 'L' ? 'aspect-[4/3]' : 'aspect-[3/4]'} overflow-hidden rounded-[3px] bg-black`}>
          <Media item={photo} sizes="(max-width: 768px) 80vw, 240px" />
        </div>
        <figcaption className="hidden md:block mt-1.5 text-[10px] lg:text-[11px] leading-snug text-[#2b1b13] line-clamp-2">{photo.caption}</figcaption>
      </motion.figure>
    </div>
  );
}
